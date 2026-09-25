"use client";

import {
	useEffect,
	useState,
	useTransition,
	type TransitionStartFunction,
} from "react";

let seq = 0;
const active = new Map<number, string>();
const subs = new Set<(label: string | null) => void>();

const currentLabel = (): string | null => {
	let last: string | null = null;
	for (const v of active.values()) last = v;
	return last;
};

const emit = () => {
	const label = currentLabel();
	subs.forEach((s) => s(label));
};

const bus = {
	inc(label: string) {
		const id = ++seq;
		active.set(id, label);
		emit();
		return id;
	},
	dec(id: number) {
		active.delete(id);
		emit();
	},
	sub(fn: (label: string | null) => void) {
		subs.add(fn);
		fn(currentLabel());
		return () => {
			subs.delete(fn);
		};
	},
};

export function beginTask(label: string): () => void {
	const id = bus.inc(label);
	let released = false;
	return () => {
		if (released) return;
		released = true;
		bus.dec(id);
	};
}

export function useSaving(
	label = "Saving",
): [boolean, TransitionStartFunction] {
	const [pending, start] = useTransition();
	useEffect(() => {
		if (!pending) return;
		const id = bus.inc(label);
		return () => bus.dec(id);
	}, [pending, label]);
	return [pending, start];
}

export function SavingOverlay() {
	const [label, setLabel] = useState<string | null>(null);
	useEffect(() => bus.sub(setLabel), []);
	if (!label) return null;
	return (
		<div
			className="fixed bottom-5 right-5 z-[120] flex items-center gap-3 rounded-full border border-gold/30 bg-plum-dark/90 px-5 py-3 backdrop-blur [animation:auth-rise_0.3s_ease]"
			role="status"
			aria-live="polite"
		>
			<span className="h-3.5 w-3.5 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
			<span className="font-sans uppercase tracking-[0.28em] text-gold text-[0.62rem]">
				{label}…
			</span>
		</div>
	);
}
