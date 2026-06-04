import type Lenis from "lenis";

// Single shared Lenis instance, set by SmoothScrollProvider on mount. The
// pinned-scroll components read it to drive section snapping through Lenis
// (rather than fighting it with a separate scroll animation).
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
	instance = lenis;
}

export function getLenis() {
	return instance;
}
