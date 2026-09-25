"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { TeamMember } from "@/lib/cms/types";
import {
	createMember,
	updateMember,
	deleteMember,
	reorderMembers,
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
	item: TeamMember;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
	reorderable?: boolean;
}) {
	const router = useRouter();
	const [form, setForm] = useState({
		name: item.name,
		role: item.role ?? "",
		note: item.note ?? "",
		img: item.img,
	});
	const [pending, start] = useSaving();
	const [msg, flash] = useFlash();
	const { dirty, markSaved } = useDirty(form);

	const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
		setForm((f) => ({ ...f, [k]: v }));

	const save = () =>
		start(async () => {
			const res = await updateMember(item.id, {
				...form,
				role: form.role || null,
				note: form.note || null,
			});
			flash(res.error ?? "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deleteMember(item.id);
			router.refresh();
		});

	return (
		<div data-busy={pending || undefined} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 rounded-sm border border-cream/10 bg-plum/20 p-4 transition-colors hover:border-cream/25">
			<ImageUploader
				value={form.img}
				onChange={(url) => set("img", url)}
				folder="team"
				aspect="aspect-[3/4]"
			/>
			<div className="flex flex-col gap-3">
				<label>
					<div className={ui.label}>Name</div>
					<input
						className={ui.input}
						value={form.name}
						onChange={(e) => set("name", e.target.value)}
					/>
				</label>
				<label>
					<div className={ui.label}>Role</div>
					<input
						className={ui.input}
						value={form.role}
						placeholder="Interior Architect"
						onChange={(e) => set("role", e.target.value)}
					/>
				</label>
				<label>
					<div className={ui.label}>Note</div>
					<input
						className={ui.input}
						value={form.note}
						placeholder="Lead Concept & Detailing"
						onChange={(e) => set("note", e.target.value)}
					/>
				</label>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-1">
						{reorderable && <DragHandle label="member" />}
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

export function TeamManager({ initial }: { initial: TeamMember[] }) {
	const router = useRouter();
	const [list, setList] = useState(initial);
	const [pending, start] = useSaving();

	useEffect(() => {
		setList(initial);
	}, [initial]);

	const persist = (next: TeamMember[]) => {
		setList(next);
		start(async () => {
			await reorderMembers(next.map((x) => x.id));
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

	const search = useSearch(list, (m) => [m.name, m.role]);
	const drag = useDragReorder(list, persist);

	return (
		<div className="flex flex-col gap-5">
			{list.length > 4 && (
				<SearchBox
					value={search.q}
					onChange={search.setQ}
					shown={search.shown.length}
					total={list.length}
					noun="members"
					placeholder="Search name or role…"
				/>
			)}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{list.length === 0 && (
					<EmptyState
						title="No team members yet"
						body="The Collection section on the About page. Add the people you want shown, each with a portrait, name and role."
					/>
				)}
				{search.active && search.shown.length === 0 && (
					<p className="rounded-sm border border-dashed border-cream/15 px-4 py-8 text-center font-sans font-light text-cream/80 text-tiny">
						No members match &ldquo;{search.q.trim()}&rdquo;.
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
							reorderable={!search.active}
							onMove={(dir) => move(i, dir)}
						/>
					</div>
				))}
			</div>
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						await createMember();
						router.refresh();
					})
				}
				className="w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60">
				{pending ? "Adding…" : "+ Add member"}
			</button>
		</div>
	);
}
