"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSaving } from "@/lib/admin/saving";
import {
	createCategory,
	updateCategory,
	deleteCategory,
	reorderCategories,
} from "./actions";
import type { ProjectCategoryRow } from "@/lib/cms/types";
import { ui } from "@/lib/admin/ui";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { useFlash } from "@/lib/admin/useFlash";

const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

type Result = { ok?: boolean; error?: string };

function Row({
	item,
	i,
	total,
	run,
}: {
	item: ProjectCategoryRow;
	i: number;
	total: number;
	run: (fn: () => Promise<Result>, dir?: -1 | 1, i?: number) => void;
}) {
	const [label, setLabel] = useState(item.label);
	useEffect(() => setLabel(item.label), [item.label]);
	const dirty = label.trim() !== item.label;

	return (
		<div className="flex items-center gap-4 border-b border-cream/10 py-2.5">
			<input
				value={label}
				onChange={(e) => setLabel(e.target.value)}
				className={`${ui.input} flex-1`}
			/>
			<span className="w-40 truncate font-sans font-light text-cream/50 text-tiny tabular-nums">
				{item.slug}
			</span>
			<button
				aria-label="Move up"
				type="button"
				disabled={i === 0}
				onClick={() => run(async () => ({ ok: true }), -1, i)}
				className={`${ui.btnPrimary} text-cream/70 hover:text-gold`}>
				↑
			</button>
			<button
				aria-label="Move down"
				type="button"
				disabled={i === total - 1}
				onClick={() => run(async () => ({ ok: true }), 1, i)}
				className={`${ui.btnPrimary} text-cream/70 hover:text-gold`}>
				↓
			</button>
			<button
				type="button"
				disabled={!dirty}
				onClick={() =>
					run(() => updateCategory(item.id, { label: label.trim(), slug: item.slug }))
				}
				className={`${ui.btnPrimary} text-gold hover:text-cream`}>
				Save
			</button>
			<ConfirmButton
				label="Delete"
				onConfirm={() => run(() => deleteCategory(item.id))}
				className={`${ui.btnPrimary} text-cream/60 hover:text-gold`}
			/>
		</div>
	);
}

export function ProjectTypesManager({ items }: { items: ProjectCategoryRow[] }) {
	const router = useRouter();
	const [pending, start] = useSaving();
	const [order, setOrder] = useState(items);
	const [newLabel, setNewLabel] = useState("");
	const [msg, flash] = useFlash();

	useEffect(() => setOrder(items), [items]);

	const run = (fn: () => Promise<Result>, dir?: -1 | 1, idx?: number) => {
		if (dir !== undefined && idx !== undefined) {
			const j = idx + dir;
			if (j < 0 || j >= order.length) return;
			const next = [...order];
			[next[idx], next[j]] = [next[j]!, next[idx]!];
			setOrder(next);
			start(async () => {
				await reorderCategories(next.map((c) => c.id));
				router.refresh();
			});
			return;
		}
		start(async () => {
			const r = await fn();
			flash(r?.error ?? "");
			router.refresh();
		});
	};

	const add = () => {
		const label = newLabel.trim();
		if (!label) return;
		start(async () => {
			const r = await createCategory({ label, slug: slugify(label) });
			flash(r.error ?? "");
			if (!r.error) setNewLabel("");
			router.refresh();
		});
	};

	return (
		<div data-busy={pending || undefined} className="mb-12 rounded-sm border border-cream/10 bg-plum/20 p-5 transition-colors hover:border-cream/25">
			<div className="mb-1 font-sans font-light uppercase tracking-[0.28em] text-gold text-tiny">
				Project types
			</div>
			<p className="mb-4 font-sans font-light text-cream/80 text-tiny">
				Categories used by the filter pills. Publish the Projects page for
				changes to appear on the site.
			</p>

			<div>
				{order.map((c, i) => (
					<Row key={c.id} item={c} i={i} total={order.length} run={run} />
				))}
			</div>

			<div className="mt-4 flex items-center gap-4">
				<input
					value={newLabel}
					onChange={(e) => setNewLabel(e.target.value)}
					placeholder="New type (e.g. Retail)"
					className={`${ui.input} flex-1`}
				/>
				<button
					type="button"
					disabled={pending || !newLabel.trim()}
					onClick={add}
					className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.2em] text-plum-dark text-micro disabled:opacity-60">
					Add type
				</button>
				{msg && (
					<span className="font-sans font-light text-cream/80 text-sm">
						{msg}
					</span>
				)}
			</div>
		</div>
	);
}
