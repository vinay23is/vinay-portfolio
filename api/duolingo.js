// Vercel serverless function: read-only Duolingo streak proxy.
//
// Why a proxy instead of calling Duolingo from React:
//   - keeps the username/user-id server-side (env vars, never shipped to the client)
//   - lets us add CDN caching so Duolingo isn't hit on every page view
//   - Duolingo's endpoint sends no CORS headers, so a browser fetch would be blocked
//
// This uses ONLY the public, unauthenticated read endpoint. No password, no JWT,
// no auth secret is ever required or sent. If nothing is configured, or Duolingo
// is unreachable / changes shape, the frontend falls back to the static value.

const FALLBACK_STREAK = 238;
const DUOLINGO_BASE = "https://www.duolingo.com/2017-06-30/users";
const TIMEOUT_MS = 6000;

// Pull the streak out of a Duolingo user object, tolerating shape changes.
// The live "current streak" lives in streakData.currentStreak.length; the
// top-level `streak` field is the older/simpler mirror. Prefer the former.
function extractStreak(user) {
  if (!user || typeof user !== "object") return null;
  const current = user.streakData?.currentStreak?.length;
  if (Number.isInteger(current) && current >= 0) return current;
  if (Number.isInteger(user.streak) && user.streak >= 0) return user.streak;
  return null;
}

export default async function handler(req, res) {
  const username = process.env.DUOLINGO_USERNAME;
  const userId = process.env.DUOLINGO_USER_ID;

  const respond = (body, { cache = true } = {}) => {
    if (cache) {
      // Cache at the CDN for ~6h, serve stale for a day while revalidating.
      // A streak changes at most once a day, so this is plenty fresh.
      res.setHeader(
        "Cache-Control",
        "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400"
      );
    } else {
      res.setHeader("Cache-Control", "no-store");
    }
    res.status(200).json(body);
  };

  // Nothing configured — return the static fallback, clearly labelled as such.
  if (!username && !userId) {
    return respond(
      { streak: FALLBACK_STREAK, source: "fallback", reason: "not-configured" },
      { cache: false }
    );
  }

  const url = userId
    ? `${DUOLINGO_BASE}/${encodeURIComponent(userId)}`
    : `${DUOLINGO_BASE}?username=${encodeURIComponent(username)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Duolingo's edge is picky about clients with no UA.
        "User-Agent": "Mozilla/5.0 (compatible; portfolio-streak/1.0)",
        Accept: "application/json",
      },
    });

    if (!upstream.ok) {
      return respond(
        { streak: FALLBACK_STREAK, source: "fallback", reason: `http-${upstream.status}` },
        { cache: false }
      );
    }

    let data;
    try {
      data = await upstream.json();
    } catch {
      return respond(
        { streak: FALLBACK_STREAK, source: "fallback", reason: "bad-json" },
        { cache: false }
      );
    }

    // The ?username= form returns { users: [...] }; the /:id form returns the
    // user object directly. Handle both.
    const user = Array.isArray(data?.users) ? data.users[0] : data;
    const streak = extractStreak(user);

    if (streak === null) {
      return respond(
        { streak: FALLBACK_STREAK, source: "fallback", reason: "no-streak-field" },
        { cache: false }
      );
    }

    return respond({
      streak,
      source: "duolingo",
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    const reason = err?.name === "AbortError" ? "timeout" : "fetch-error";
    return respond(
      { streak: FALLBACK_STREAK, source: "fallback", reason },
      { cache: false }
    );
  } finally {
    clearTimeout(timer);
  }
}
