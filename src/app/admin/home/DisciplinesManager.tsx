"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Discipline } from "@/lib/cms/types";
import {
	createDiscipline,
	updateDiscipline,
	deleteDiscipline,
	reorderDisciplines,
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
	item: Discipline;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
	reorderable?: boolean;
}) {
	const router = useRouter();
	const [form, setForm] = useState({
		top_label: item.top_label,
		big_stat: item.big_stat ?? "",
		description: item.description ?? "",
		variant: item.variant,
		span: item.span,
		img: item.img,
	});
	const [pending, start] = useSaving();
	const [msg, flash] = useFlash();
	const { dirty, markSaved } = useDirty(form);

	const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
		setForm((f) => ({ ...f, [k]: v }));

	const save = () =>
		start(async () => {
			flash("");
			const res = await updateDiscipline(item.id, {
				...form,
				big_stat: form.big_stat || null,
				description: form.description || null,
			});
			flash(res.error ? res.error : "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});

	const remove = () =>
		start(async () => {
			await deleteDiscipline(item.id);
			router.refresh();
		});

	return (
		<div data-busy={pending || undefined} className="grid grid-cols-1 gap-5 rounded-sm border border-cream/10 bg-plum/20 p-5 transition-colors hover:border-cream/25 sm:grid-cols-[180px_1fr]">
			<div className="flex flex-col gap-3">
				<ImageUploader
					value={form.img}
					onChange={(url) => set("img", url)}
					folder="home"
					aspect="aspect-[4/3]"
				/>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1">
						{reorderable && <DragHandle label="discipline" />}
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
					<ConfirmButton
						label="Delete"
						onConfirm={remove}
						disabled={pending}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label>
						<div className={ui.label}>Top label</div>
						<input
							className={ui.input}
							value={form.top_label}
							onChange={(e) => set("top_label", e.target.value)}
						/>
					</label>
					<label>
						<div className={ui.label}>Big stat</div>
						<input
							className={ui.input}
							value={form.big_stat}
							onChange={(e) => set("big_stat", e.target.value)}
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
				<div className="grid grid-cols-2 gap-4">
					<label>
						<div className={ui.label}>Variant</div>
						<select
							className={`${ui.input} cursor-pointer`}
							value={form.variant}
							onChange={(e) => set("variant", e.target.value)}>
							<option value="image" className="bg-plum-dark">
								Image
							</option>
							<option value="centered" className="bg-plum-dark">
								Centered
							</option>
							<option value="italic" className="bg-plum-dark">
								Italic
							</option>
						</select>
					</label>
					<label>
						<div className={ui.label}>Span</div>
						<select
							className={`${ui.input} cursor-pointer`}
							value={form.span}
							onChange={(e) => set("span", e.target.value)}>
							<option value="normal" className="bg-plum-dark">
								Normal
							</option>
							<option value="wide" className="bg-plum-dark">
								Wide
							</option>
							<option value="tall" className="bg-plum-dark">
								Tall
							</option>
						</select>
					</label>
				</div>
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={save}
						disabled={pending || !dirty}
						className="cta-gold cursor-pointer bg-gold px-6 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-tiny disabled:opacity-60">
						{pending ? "Saving…" : "Save"}
					</button>
					{msg && (
						<span className="font-sans font-light text-cream/80 text-sm">
							{msg}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

export function DisciplinesManager({ initial }: { initial: Discipline[] }) {
	const router = useRouter();
	const [items, setItems] = useState(initial);
	const [pending, start] = useSaving();

	useEffect(() => {
		setItems(initial);
	}, [initial]);

	const add = () =>
		start(async () => {
			await createDiscipline();
			router.refresh();
		});

	const persist = (next: Discipline[]) => {
		setItems(next);
		start(async () => {
			await reorderDisciplines(next.map((d) => d.id));
			router.refresh();
		});
	};

	const move = (index: number, dir: -1 | 1) => {
		const next = [...items];
		const j = index + dir;
		if (j < 0 || j >= next.length) return;
		[next[index], next[j]] = [next[j], next[index]];
		persist(next);
	};

	const search = useSearch(items, (d) => [
		d.top_label,
		d.big_stat,
		d.description,
	]);
	const drag = useDragReorder(items, persist);

	return (
		<div className="flex flex-col gap-5">
			{items.length > 4 && (
				<SearchBox
					value={search.q}
					onChange={search.setQ}
					shown={search.shown.length}
					total={items.length}
					noun="disciplines"
					placeholder="Search label, stat or text…"
				/>
			)}
			{items.length === 0 && (
				<EmptyState
					title="No disciplines yet"
					body="The disciplines grid on the home page. Add the services the studio offers, each with an image."
				/>
			)}
			{search.active && search.shown.length === 0 && (
				<p className="rounded-sm border border-dashed border-cream/15 px-4 py-8 text-center font-sans font-light text-cream/80 text-tiny">
					No disciplines match &ldquo;{search.q.trim()}&rdquo;.
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
						total={items.length}
						reorderable={!search.active}
						onMove={(dir) => move(i, dir)}
					/>
				</div>
			))}
			<button
				type="button"
				onClick={add}
				disabled={pending}
				className="w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny transition-colors hover:bg-gold/10 disabled:opacity-60">
				{pending ? "Adding…" : "+ Add discipline"}
			</button>
		</div>
	);
}
