"use client";

import { useMemo, useState } from "react";

type Field = string | null | undefined;

export function matchesTerms(fields: Field[], query: string): boolean {
	const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
	if (terms.length === 0) return true;
	const hay = fields.filter(Boolean).join(" ").toLowerCase();
	return terms.every((t) => hay.includes(t));
}

export function useSearch<T>(items: T[], fields: (item: T) => Field[]) {
	const [q, setQ] = useState("");
	const active = q.trim().length > 0;
	const shown = useMemo(
		() => (active ? items.filter((i) => matchesTerms(fields(i), q)) : items),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[items, q, active],
	);
	return { q, setQ, shown, active };
}
