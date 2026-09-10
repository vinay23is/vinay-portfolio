import { useEffect, useState } from "react";
import { FALLBACK_STREAK } from "../lib/site";

// Single source of truth for the Japanese Duolingo streak shown across the
// Personal page.
//
// Behaviour:
//   - initialises to the static FALLBACK_STREAK (see lib/site) so the UI never
//     renders 0 or an empty/loading value
//   - fetches /api/duolingo once on mount
//   - swaps in the real streak only when the proxy reports source === "duolingo"
//   - keeps the fallback on any failure (network, timeout, unmount, bad shape)
//   - `isLive` is true only when the value genuinely came from Duolingo, so the
//     UI can show a "live" badge honestly and never mislabel the fallback
export function useDuolingoStreak() {
  const [streak, setStreak] = useState(FALLBACK_STREAK);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetch("/api/duolingo", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const value = Number(data.streak);
        // Only replace the fallback with a real, positive Duolingo value.
        if (data.source === "duolingo" && Number.isFinite(value) && value > 0) {
          setStreak(value);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Swallow everything (including AbortError on unmount) — the fallback
        // is already rendered and correct.
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { streak, isLive };
}
