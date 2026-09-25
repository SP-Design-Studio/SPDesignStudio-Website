"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ui } from "@/lib/admin/ui";

export function SuggestInput({
	value,
	onChange,
	options,
	placeholder,
	className,
	ariaLabel,
}: {
	value: string;
	onChange: (v: string) => void;
	options: string[];
	placeholder?: string;
	className?: string;
	ariaLabel?: string;
}) {
	const listId = useId();
	const wrapRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const [cursor, setCursor] = useState(-1);

	const counts = useMemo(() => {
		const m = new Map<string, number>();
		for (const o of options) {
			const k = o.trim();
			if (k) m.set(k, (m.get(k) ?? 0) + 1);
		}
		return m;
	}, [options]);

	const matches = useMemo(() => {
		const q = value.trim().toLowerCase();
		const all = [...counts.keys()];
		const hits = q
			? all.filter((o) => o.toLowerCase().includes(q) && o.toLowerCase() !== q)
			: all;
		return hits.sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0)).slice(0, 8);
	}, [counts, value]);

	useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);

	useEffect(() => setCursor(-1), [value]);

	const choose = (v: string) => {
		onChange(v);
		setOpen(false);
		setCursor(-1);
	};

	const onKey = (e: React.KeyboardEvent) => {
		if (!open || matches.length === 0) {
			if (e.key === "ArrowDown") setOpen(true);
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setCursor((c) => (c + 1) % matches.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setCursor((c) => (c <= 0 ? matches.length - 1 : c - 1));
		} else if (e.key === "Enter" && cursor >= 0) {
			e.preventDefault();
			choose(matches[cursor]!);
		} else if (e.key === "Escape") {
			setOpen(false);
		}
	};

	const show = open && matches.length > 0;

	return (
		<div ref={wrapRef} className="relative">
			<input
				type="text"
				role="combobox"
				aria-expanded={show}
				aria-controls={listId}
				aria-autocomplete="list"
				aria-activedescendant={
					cursor >= 0 ? `${listId}-${cursor}` : undefined
				}
				aria-label={ariaLabel}
				value={value}
				placeholder={placeholder}
				onChange={(e) => {
					onChange(e.target.value);
					setOpen(true);
				}}
				onFocus={() => setOpen(true)}
				onKeyDown={onKey}
				className={className ?? ui.input}
			/>
			{show && (
				<ul
					id={listId}
					role="listbox"
					className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-sm border border-cream/20 bg-plum-dark shadow-lg">
					{matches.map((o, i) => (
						<li key={o} id={`${listId}-${i}`} role="option" aria-selected={i === cursor}>
							<button
								type="button"
								tabIndex={-1}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => choose(o)}
								onMouseEnter={() => setCursor(i)}
								className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left font-sans font-light text-tiny transition-colors ${
									i === cursor ? "bg-gold/10 text-gold" : "text-cream/82 hover:text-gold"
								}`}>
								<span className="truncate">{o}</span>
								<span className="shrink-0 tabular-nums text-cream/80 text-micro">
									{counts.get(o)}
								</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
