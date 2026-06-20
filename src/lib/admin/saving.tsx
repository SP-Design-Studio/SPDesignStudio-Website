"use client";

import {
	useEffect,
	useState,
	useTransition,
	type TransitionStartFunction,
} from "react";

let count = 0;
const subs = new Set<(n: number) => void>();
const emit = () => subs.forEach((s) => s(count));

const bus = {
	inc() {
		count += 1;
		emit();
	},
	dec() {
		count = Math.max(0, count - 1);
		emit();
	},
	sub(fn: (n: number) => void) {
		subs.add(fn);
		fn(count);
		return () => {
			subs.delete(fn);
		};
	},
};

// Drop-in replacement for useTransition that reports pending state to a global
// indicator (see SavingOverlay).
export function useSaving(): [boolean, TransitionStartFunction] {
	const [pending, start] = useTransition();
	useEffect(() => {
		if (!pending) return;
		bus.inc();
		return () => bus.dec();
	}, [pending]);
	return [pending, start];
}

export function SavingOverlay() {
	const [active, setActive] = useState(false);
	useEffect(() => bus.sub((n) => setActive(n > 0)), []);
	if (!active) return null;
	return (
		<div
			className="fixed bottom-5 right-5 z-[120] flex items-center gap-3 rounded-full border border-gold/30 bg-plum-dark/90 px-5 py-3 backdrop-blur [animation:auth-rise_0.3s_ease]"
			role="status"
			aria-live="polite"
		>
			<span className="h-3.5 w-3.5 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
			<span className="font-sans uppercase tracking-[0.28em] text-gold text-[0.62rem]">
				Saving…
			</span>
		</div>
	);
}
