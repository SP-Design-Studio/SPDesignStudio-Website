"use client";

import { useEffect, useState } from "react";

let dirtyCount = 0;
const listeners = new Set<(n: number) => void>();

const notify = () => listeners.forEach((l) => l(dirtyCount));

export function subscribeDirty(fn: (n: number) => void) {
	listeners.add(fn);
	fn(dirtyCount);
	return () => {
		listeners.delete(fn);
	};
}

export function hasUnsavedWork() {
	return dirtyCount > 0;
}

export function useDirty<T>(form: T): { dirty: boolean; markSaved: () => void } {
	const [saved, setSaved] = useState(() => JSON.stringify(form));
	const dirty = JSON.stringify(form) !== saved;

	useEffect(() => {
		if (!dirty) return;
		dirtyCount += 1;
		notify();
		return () => {
			dirtyCount = Math.max(0, dirtyCount - 1);
			notify();
		};
	}, [dirty]);

	useEffect(() => {
		if (!dirty) return;
		const onLeave = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", onLeave);
		return () => window.removeEventListener("beforeunload", onLeave);
	}, [dirty]);

	return { dirty, markSaved: () => setSaved(JSON.stringify(form)) };
}
