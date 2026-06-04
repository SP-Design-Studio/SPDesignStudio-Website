import { getLenis } from "./smoothScroll";

// Section snapping for the pinned scrub timelines — TOUCH SCREENS ONLY.
//
// Each pinned page is a single ScrollTrigger-pinned wrapper whose master
// timeline is scrubbed by scroll, with each "act" animating in and out at a
// fixed timeline time. We mark the settled rest point of every act with a GSAP
// label (`tl.addLabel(...)`). On a touch-primary device, when a swipe ends we
// snap the scroll to the next/previous labelled rest point in the direction of
// the swipe — so one swipe advances exactly one section, and because the snap
// is just a scroll animation, the pinned act animations play through the glide.
//
// On pointer:fine devices (desktops / laptops, incl. touch laptops with a
// mouse) this is a no-op: free scrubbing is preserved everywhere.
//
// The snap is driven through the shared Lenis instance (lenis.scrollTo) so it
// cooperates with Lenis's syncTouch handling instead of fighting it.
export function enableSectionSnap(tl: gsap.core.Timeline): () => void {
	if (typeof window === "undefined") return () => {};
	if (!window.matchMedia("(pointer: coarse)").matches) return () => {};

	const st = tl.scrollTrigger;
	if (!st) return () => {};

	const labelTimes = Object.values(tl.labels).sort((a, b) => a - b);
	if (labelTimes.length === 0) return () => {};

	// Resolve label times → absolute scroll positions at snap time, so they
	// stay correct across viewport resizes / ScrollTrigger.refresh().
	const anchors = () => {
		const dur = tl.duration();
		const range = st.end - st.start;
		return labelTimes
			.map((t) => st.start + (t / dur) * range)
			.sort((a, b) => a - b);
	};

	const EPS = 8; // px — so resting exactly on an anchor still advances on swipe
	const MOVED = 6; // px of vertical travel before a gesture counts as a scroll
	let snapping = false;
	let startScroll = 0;

	const settle = () => {
		const lenis = getLenis();
		if (!lenis || snapping) return;

		const cur = lenis.scroll;
		// Outside the pinned range: let momentum carry to the header/footer.
		if (cur < st.start - 1 || cur > st.end + 1) return;

		// Direction from how far the page actually scrolled during this gesture.
		// A horizontal carousel swipe doesn't move the page, so we never snap.
		const moved = cur - startScroll;
		if (Math.abs(moved) < MOVED) return;
		const dir = moved > 0 ? 1 : -1;

		const pts = anchors();
		const target =
			dir > 0
				? pts.find((a) => a > cur + EPS)
				: [...pts].reverse().find((a) => a < cur - EPS);

		// No section that way (top/bottom of the pin) → free-scroll out.
		if (target == null) return;

		snapping = true;
		lenis.scrollTo(target, {
			duration: 0.9,
			lock: true,
			easing: (x: number) => 1 - Math.pow(1 - x, 3),
			onComplete: () => {
				snapping = false;
			},
		});
	};

	const onTouchStart = () => {
		const lenis = getLenis();
		startScroll = lenis ? lenis.scroll : 0;
	};

	// Wait two frames after the finger lifts so the page has registered the
	// gesture's scroll travel before we decide whether (and where) to snap.
	const onTouchEnd = () => {
		requestAnimationFrame(() => requestAnimationFrame(settle));
	};

	window.addEventListener("touchstart", onTouchStart, { passive: true });
	window.addEventListener("touchend", onTouchEnd, { passive: true });
	return () => {
		window.removeEventListener("touchstart", onTouchStart);
		window.removeEventListener("touchend", onTouchEnd);
	};
}
