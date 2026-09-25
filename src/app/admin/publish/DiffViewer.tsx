"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Change, ChangeKind } from "@/lib/cms/diff";

const KIND: Record<ChangeKind, { label: string; sign: string; cls: string }> = {
	added: {
		label: "Added",
		sign: "+",
		cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
	},
	removed: {
		label: "Removed",
		sign: "−",
		cls: "border-red-400/40 bg-red-400/10 text-red-200",
	},
	edited: {
		label: "Edited",
		sign: "→",
		cls: "border-gold/40 bg-gold/10 text-gold",
	},
	reordered: {
		label: "Reordered",
		sign: "↕",
		cls: "border-cream/25 bg-cream/5 text-cream/75",
	},
	recropped: {
		label: "Recropped",
		sign: "⧉",
		cls: "border-sky-400/40 bg-sky-400/10 text-sky-200",
	},
};

function tokens(s: string): string[] {
	return s.split(/(\s+)/).filter((t) => t !== "");
}

function wordDiff(a: string, b: string) {
	const A = tokens(a);
	const B = tokens(b);
	if (A.length > 300 || B.length > 300)
		return { before: [{ t: a, hit: true }], after: [{ t: b, hit: true }] };

	const dp: number[][] = Array.from({ length: A.length + 1 }, () =>
		new Array(B.length + 1).fill(0),
	);
	for (let i = A.length - 1; i >= 0; i--)
		for (let j = B.length - 1; j >= 0; j--)
			dp[i]![j] =
				A[i] === B[j]
					? dp[i + 1]![j + 1]! + 1
					: Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);

	const before: { t: string; hit: boolean }[] = [];
	const after: { t: string; hit: boolean }[] = [];
	let i = 0;
	let j = 0;
	while (i < A.length && j < B.length) {
		if (A[i] === B[j]) {
			before.push({ t: A[i]!, hit: false });
			after.push({ t: B[j]!, hit: false });
			i++;
			j++;
		} else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
			before.push({ t: A[i]!, hit: true });
			i++;
		} else {
			after.push({ t: B[j]!, hit: true });
			j++;
		}
	}
	while (i < A.length) before.push({ t: A[i++]!, hit: true });
	while (j < B.length) after.push({ t: B[j++]!, hit: true });
	return { before, after };
}

function Thumb({ src, tone }: { src: string; tone: "before" | "after" }) {
	return (
		<div
			className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-sm border bg-plum-dark ${
				tone === "before" ? "border-red-400/30" : "border-emerald-400/30"
			}`}>
			<Image src={src} alt="" fill sizes="96px" className="object-cover" />
		</div>
	);
}

function TextChange({ before, after }: { before: string; after: string }) {
	const d = useMemo(() => wordDiff(before, after), [before, after]);
	return (
		<div className="flex flex-col gap-1.5">
			<p className="font-sans font-light text-cream/82 text-tiny leading-relaxed">
				{d.before.map((w, i) => (
					<span
						key={i}
						className={
							w.hit ? "rounded-[2px] bg-red-400/15 text-red-200/90 line-through" : ""
						}>
						{w.t}
					</span>
				))}
			</p>
			<p className="font-sans font-light text-cream/90 text-tiny leading-relaxed">
				{d.after.map((w, i) => (
					<span
						key={i}
						className={
							w.hit ? "rounded-[2px] bg-emerald-400/15 text-emerald-100" : ""
						}>
						{w.t}
					</span>
				))}
			</p>
		</div>
	);
}

function Row({ c }: { c: Change }) {
	const k = KIND[c.kind];
	const hasImages = Boolean(c.beforeImage || c.afterImage);
	const isText =
		c.kind === "edited" &&
		!hasImages &&
		typeof c.before === "string" &&
		typeof c.after === "string";

	return (
		<li className="flex gap-3 border-b border-cream/5 px-3 py-3 last:border-b-0">
			<span
				className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.65rem] ${k.cls}`}
				title={k.label}>
				{k.sign}
			</span>

			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-baseline gap-x-2">
					<span className="font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-micro">
						{c.field}
					</span>
					{c.kind === "recropped" && (
						<span className="font-sans font-light text-cream/70 text-tiny">
							{c.before} → {c.after}
						</span>
					)}
					{c.kind === "reordered" && (
						<span className="font-sans font-light text-cream/70 text-tiny">
							order changed
						</span>
					)}
				</div>

				{hasImages && (
					<div className="mt-2 flex items-center gap-3">
						{c.beforeImage && <Thumb src={c.beforeImage} tone="before" />}
						{c.beforeImage && c.afterImage && (
							<span className="text-cream/80 text-sm">→</span>
						)}
						{c.afterImage && <Thumb src={c.afterImage} tone="after" />}
						<span className="min-w-0 truncate font-sans font-light text-cream/80 text-micro">
							{c.after ?? c.before}
						</span>
					</div>
				)}

				{isText && (
					<div className="mt-1.5">
						<TextChange before={c.before!} after={c.after!} />
					</div>
				)}

				{!hasImages && !isText && c.kind !== "reordered" && (
					<div className="mt-1 font-sans font-light text-cream/85 text-tiny">
						{c.kind === "removed" ? c.before : c.after}
					</div>
				)}
			</div>
		</li>
	);
}

export function DiffViewer({ changes }: { changes: Change[] }) {
	const [filter, setFilter] = useState<ChangeKind | "all">("all");

	const counts = useMemo(() => {
		const m = new Map<ChangeKind, number>();
		for (const c of changes) m.set(c.kind, (m.get(c.kind) ?? 0) + 1);
		return m;
	}, [changes]);

	const shown = useMemo(
		() => (filter === "all" ? changes : changes.filter((c) => c.kind === filter)),
		[changes, filter],
	);

	const groups = useMemo(() => {
		const m = new Map<string, Change[]>();
		for (const c of shown) {
			const parts = c.path.split("·").map((p) => p.trim());
			const head = parts.length > 1 ? parts.slice(0, -1).join(" · ") : parts[0]!;
			if (!m.has(head)) m.set(head, []);
			m.get(head)!.push(c);
		}
		return [...m.entries()];
	}, [shown]);

	return (
		<div className="overflow-hidden">
			<div className="flex flex-wrap items-center gap-2 border-b border-cream/10 px-3 py-2.5">
				<button
					type="button"
					onClick={() => setFilter("all")}
					className={`cursor-pointer rounded-full border px-2.5 py-0.5 font-sans font-light uppercase tracking-[0.18em] text-micro transition-colors ${
						filter === "all"
							? "border-gold/50 bg-gold/10 text-gold"
							: "border-cream/15 text-cream/82 hover:border-cream/40 hover:text-cream"
					}`}>
					All {changes.length}
				</button>
				{([...counts.entries()] as [ChangeKind, number][]).map(([k, n]) => (
					<button
						key={k}
						type="button"
						onClick={() => setFilter(filter === k ? "all" : k)}
						className={`cursor-pointer rounded-full border px-2.5 py-0.5 font-sans font-light uppercase tracking-[0.18em] text-micro transition-colors ${
							filter === k
								? KIND[k].cls
								: "border-cream/15 text-cream/82 hover:border-cream/40 hover:text-cream"
						}`}>
						{KIND[k].label} {n}
					</button>
				))}
			</div>

			<div className="max-h-[34rem] overflow-y-auto">
				{groups.map(([head, list]) => (
					<div key={head}>
						<div className="sticky top-0 z-10 border-b border-cream/10 bg-plum-dark/95 px-3 py-1.5 font-sans font-light uppercase tracking-[0.24em] text-gold/70 text-micro backdrop-blur">
							{head}
						</div>
						<ul className="flex flex-col">
							{list.map((c, i) => (
								<Row key={`${c.path}-${c.kind}-${i}`} c={c} />
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
