"use client";

import { useState } from "react";

export function useDirty<T>(form: T): { dirty: boolean; markSaved: () => void } {
	const [saved, setSaved] = useState(() => JSON.stringify(form));
	return {
		dirty: JSON.stringify(form) !== saved,
		markSaved: () => setSaved(JSON.stringify(form)),
	};
}
