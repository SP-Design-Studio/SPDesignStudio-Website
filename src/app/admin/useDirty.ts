"use client";

import { useRef } from "react";

export function useDirty<T>(form: T): { dirty: boolean; markSaved: () => void } {
	const saved = useRef(JSON.stringify(form));
	return {
		dirty: JSON.stringify(form) !== saved.current,
		markSaved: () => {
			saved.current = JSON.stringify(form);
		},
	};
}
