"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { TimelineEntry } from "@/lib/cms/types";
import {
	createEntry,
	updateEntry,
	deleteEntry,
	reorderEntries,
} from "./actions";
import { useDirty } from "@/lib/admin/useDirty";
import { ui } from "@/lib/admin/ui";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { useFlash } from "@/lib/admin/useFlash";
import { EmptyState } from "@/components/admin/EmptyState";
import { SearchBox } from "@/components/admin/SearchBox";
import { DragHandle } from "@/components/admin/DragHandle";
import { useSearch } from "@/lib/admin/useSearch";
import { useDragReorder } from "@/lib/admin/useDragReorder";

function Card({
	item,
	index,
	total,
	onMove,
	reorderable = true,
}: {
	item: TimelineEntry;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
	reorderable?: boolean;
}) {
	const router = useRouter();
	const [form, setForm] = useState({
		year: item.year,
		label: item.label,
		description: item.description ?? "",
		img: item.img,
	});
	const [pending, start] = useSaving();
	const [msg, flash] = useFlash();
	const { dirty, markSaved } = useDirty(form);

	const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
		setForm((f) => ({ ...f, [k]: v }));

	const save = () =>
		start(async () => {
			const res = await updateEntry(item.id, {
				...form,
				description: form.description || null,
			});
			flash(res.error ?? "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deleteEntry(item.id);
			router.refresh();
		});

	return (
		<div data-busy={pending || undefined} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 rounded-sm border border-cream/10 bg-plum/20 p-4 transition-colors hover:border-cream/25">
			<ImageUploader
				value={form.img}
				onChange={(url) => set("img", url)}
				folder="timeline"
				aspect="aspect-[16/10]"
			/>
			<div className="flex flex-col gap-3">
				<div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-3">
					<label>
						<div className={ui.label}>Year</div>
						<input
							className={ui.input}
							value={form.year}
							onChange={(e) => set("year", e.target.value)}
						/>
					</label>
					<label>
						<div className={ui.label}>Label</div>
						<input
							className={ui.input}
							value={form.label}
							onChange={(e) => set("label", e.target.value)}
						/>
					</label>
				</div>
				<label>
					<div className={ui.label}>Description</div>
					<textarea
						rows={2}
						className={`${ui.input} resize-none`}
						value={form.description}
						onChange={(e) => set("description", e.target.value)}
					/>
				</label>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-1">
						{reorderable && <DragHandle label="entry" />}
						<button
							aria-label="Move up"
							type="button"
							disabled={index === 0 || !reorderable}
							onClick={() => onMove(-1)}
							className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
							↑
						</button>
						<button
							aria-label="Move down"
							type="button"
							disabled={index === total - 1 || !reorderable}
							onClick={() => onMove(1)}
							className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
							↓
						</button>
					</div>
					<div className="flex items-center gap-3">
						{msg && (
							<span className="font-sans font-light text-cream/80 text-sm">
								{msg}
							</span>
						)}
						<ConfirmButton
							label="Delete"
							onConfirm={remove}
							disabled={pending}
						/>
						<button
							type="button"
							onClick={save}
							disabled={pending || !dirty}
							className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-tiny disabled:opacity-60">
							{pending ? "…" : "Save"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function TimelineManager({ initial }: { initial: TimelineEntry[] }) {
	const router = useRouter();
	const [list, setList] = useState(initial);
	const [pending, start] = useSaving();

	useEffect(() => {
		setList(initial);
	}, [initial]);

	const persist = (next: TimelineEntry[]) => {
		setList(next);
		start(async () => {
			await reorderEntries(next.map((x) => x.id));
			router.refresh();
		});
	};

	const move = (i: number, dir: -1 | 1) => {
		const next = [...list];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		persist(next);
	};

	const search = useSearch(list, (t) => [t.year, t.label, t.description]);
	const drag = useDragReorder(list, persist);

	return (
		<div className="flex flex-col gap-5">
			{list.length > 4 && (
				<SearchBox
					value={search.q}
					onChange={search.setQ}
					shown={search.shown.length}
					total={list.length}
					noun="entries"
					placeholder="Search year, label or text…"
				/>
			)}
			{list.length === 0 && (
				<EmptyState
					title="No timeline entries yet"
					body="Studio Evolution on the About page. Add milestones in order — each with a year, title and image."
				/>
			)}
			{search.active && search.shown.length === 0 && (
				<p className="rounded-sm border border-dashed border-cream/15 px-4 py-8 text-center font-sans font-light text-cream/80 text-tiny">
					No entries match &ldquo;{search.q.trim()}&rdquo;.
				</p>
			)}
			{search.shown.map((item, i) => (
				<div
					key={item.id}
					{...(search.active ? {} : drag.handlers(i))}
					className={search.active ? "" : drag.itemClass(i)}>
					<Card
						item={item}
						index={i}
						total={list.length}
						onMove={(dir) => move(i, dir)}
						reorderable={!search.active}
					/>
				</div>
			))}
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						await createEntry();
						router.refresh();
					})
				}
				className="w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60">
				{pending ? "Adding…" : "+ Add entry"}
			</button>
			<p className="font-sans font-light text-cream/80 text-sm">
				The desktop timeline curve shows up to 5 entries; all entries appear on
				mobile.
			</p>
		</div>
	);
}
