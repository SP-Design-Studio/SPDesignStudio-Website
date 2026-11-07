"use client";

import { useSyncExternalStore } from "react";

let on = false;
const subs = new Set<() => void>();

function apply() {
	if (typeof document === "undefined") return;
	if (on) document.documentElement.dataset.reorder = "on";
	else delete document.documentElement.dataset.reorder;
}

export function setReorderMode(next: boolean) {
	if (on === next) return;
	on = next;
	apply();
	subs.forEach((s) => s());
}

export function useReorderMode(): boolean {
	return useSyncExternalStore(
		(cb) => {
			subs.add(cb);
			return () => {
				subs.delete(cb);
			};
		},
		() => on,
		() => false,
	);
}
