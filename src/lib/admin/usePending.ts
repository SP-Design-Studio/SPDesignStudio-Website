"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { subscribeIdle } from "./saving";

export interface PendingPage {
	status: "unpublished" | "clean" | "dirty";
	dirtyKeys: string[];
}

export type PendingMap = Record<string, PendingPage>;

export function usePending(path: string): PendingMap | null {
	const [map, setMap] = useState<PendingMap | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const load = useCallback(async () => {
		try {
			const res = await fetch("/admin/pending", { cache: "no-store" });
			if (!res.ok) return;
			const json = (await res.json()) as { pages: PendingMap };
			setMap(json.pages);
		} catch {
			return;
		}
	}, []);

	const later = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(load, 700);
	}, [load]);

	useEffect(() => {
		load();
	}, [load, path]);

	useEffect(() => {
		const off = subscribeIdle(later);
		return () => {
			off();
			if (timer.current) clearTimeout(timer.current);
		};
	}, [later]);

	return map;
}
