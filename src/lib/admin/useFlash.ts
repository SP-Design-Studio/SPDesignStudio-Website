"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useFlash(ms = 2600): [string, (message: string) => void] {
	const [msg, setMsg] = useState("");
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clear = () => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = null;
	};

	const flash = useCallback(
		(message: string) => {
			clear();
			setMsg(message);
			if (message) timer.current = setTimeout(() => setMsg(""), ms);
		},
		[ms],
	);

	useEffect(() => clear, []);

	return [msg, flash];
}
