// Small shared source-of-truth. Kept intentionally lightweight — just the
// values that were previously duplicated across pages.

// Static Japanese Duolingo streak. Used as the initial render value and the
// fallback whenever the live /api/duolingo lookup is unavailable.
export const FALLBACK_STREAK = 238;

export const SOCIAL = {
  email: "dodlavinay012@gmail.com",
  linkedin: "https://linkedin.com/in/vinay-dodla-695232213",
  github: "https://github.com/vinay23is",
};

// Muted body text. Bumped from the old #555555 (too dark on near-black) to a
// value that keeps secondary text clearly secondary while staying readable.
export const MUTED = "#9a9a9a";
