"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CareerOpening, CareersSettings } from "@/lib/cms/types";
import {
	saveCareersSettings,
	createOpening,
	updateOpening,
	deleteOpening,
	reorderOpenings,
} from "./actions";
import { useDirty } from "@/lib/admin/useDirty";
import { ui } from "@/lib/admin/ui";
import { SearchBox } from "@/components/admin/SearchBox";
import { DragHandle } from "@/components/admin/DragHandle";
import { useSearch } from "@/lib/admin/useSearch";
import { useDragReorder } from "@/lib/admin/useDragReorder";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { useFlash } from "@/lib/admin/useFlash";

function Select({
	value,
	options,
	onChange,
}: {
	value: string;
	options: string[];
	onChange: (v: string) => void;
}) {
	const has = options.includes(value);
	return (
		<select
			className={`${ui.input} cursor-pointer`}
			value={value}
			onChange={(e) => onChange(e.target.value)}>
			{!has && value && (
				<option value={value} className="bg-plum-dark">
					{value}
				</option>
			)}
			{options.map((o) => (
				<option key={o} value={o} className="bg-plum-dark">
					{o}
				</option>
			))}
		</select>
	);
}

function StringList({
	label,
	items,
	onChange,
}: {
	label: string;
	items: string[];
	onChange: (next: string[]) => void;
}) {
	return (
		<div>
			<div className="mb-2 flex items-center justify-between">
				<span className={ui.label}>{label}</span>
				<button
					type="button"
					onClick={() => onChange([...items, ""])}
					className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-gold text-micro hover:opacity-80">
					+ Add
				</button>
			</div>
			<div className="flex flex-col gap-2">
				{items.map((it, i) => (
					<div key={i} className="flex items-center gap-2">
						<input
							className={ui.input}
							value={it}
							onChange={(e) =>
								onChange(items.map((x, j) => (j === i ? e.target.value : x)))
							}
						/>
						<button
							type="button"
							onClick={() => onChange(items.filter((_, j) => j !== i))}
							className="shrink-0 cursor-pointer border border-cream/20 px-2.5 py-2 text-cream/82 text-sm hover:border-gold hover:text-gold">
							×
						</button>
					</div>
				))}
				{items.length === 0 && (
					<p className="font-sans font-light text-cream/80 text-sm">
						No options yet.
					</p>
				)}
			</div>
		</div>
	);
}

function OpeningCard({
	item,
	index,
	total,
	roleOptions,
	typeOptions,
	onMove,
	reorderable = true,
}: {
	item: CareerOpening;
	index: number;
	total: number;
	roleOptions: string[];
	typeOptions: string[];
	onMove: (dir: -1 | 1) => void;
	reorderable?: boolean;
}) {
	const router = useRouter();
	const [form, setForm] = useState({
		role: item.role,
		type: item.type ?? "",
		location: item.location ?? "",
		description: item.description ?? "",
	});
	const [pending, start] = useSaving();
	const [msg, flash] = useFlash();
	const { dirty, markSaved } = useDirty(form);

	const set = (k: keyof typeof form, v: string) =>
		setForm((f) => ({ ...f, [k]: v }));

	const save = () =>
		start(async () => {
			const res = await updateOpening(item.id, form);
			flash(res.error ?? "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deleteOpening(item.id);
			router.refresh();
		});

	return (
		<div data-busy={pending || undefined} className="flex flex-col gap-4 rounded-sm border border-cream/10 bg-plum/20 p-5 transition-colors hover:border-cream/25">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<label>
					<div className={ui.label}>Role</div>
					<Select
						value={form.role}
						options={roleOptions}
						onChange={(v) => set("role", v)}
					/>
				</label>
				<label>
					<div className={ui.label}>Type</div>
					<Select
						value={form.type}
						options={typeOptions}
						onChange={(v) => set("type", v)}
					/>
				</label>
				<label>
					<div className={ui.label}>Location</div>
					<input
						className={ui.input}
						value={form.location}
						placeholder="Hyderabad"
						onChange={(e) => set("location", e.target.value)}
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
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1">
					{reorderable && <DragHandle label="role" />}
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
	);
}

export function CareersManager({
	openings,
	settings,
}: {
	openings: CareerOpening[];
	settings: CareersSettings | null;
}) {
	const router = useRouter();
	const [list, setList] = useState(openings);
	const [pending, start] = useSaving();

	useEffect(() => {
		setList(openings);
	}, [openings]);

	const [s, setS] = useState({
		subtitle: settings?.subtitle ?? "",
		empty_note: settings?.empty_note ?? "",
		apply_email: settings?.apply_email ?? "",
	});
	const [roleOptions, setRoleOptions] = useState<string[]>(
		settings?.role_options ?? [],
	);
	const [typeOptions, setTypeOptions] = useState<string[]>(
		settings?.type_options ?? [],
	);
	const [smsg, setSmsg] = useState("");

	const saveSettings = () =>
		start(async () => {
			const res = await saveCareersSettings({
				...s,
				role_options: roleOptions.map((x) => x.trim()).filter(Boolean),
				type_options: typeOptions.map((x) => x.trim()).filter(Boolean),
			});
			setSmsg(res.error ?? "Saved");
			router.refresh();
		});

	const persist = (next: CareerOpening[]) => {
		setList(next);
		start(async () => {
			await reorderOpenings(next.map((x) => x.id));
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

	const search = useSearch(list, (o) => [
		o.role,
		o.type,
		o.location,
		o.description,
	]);
	const drag = useDragReorder(list, persist);

	return (
		<div data-busy={pending || undefined} className="flex flex-col gap-14">
			<section>
				<div className="mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-tiny">
					Page settings
				</div>
				<div className="flex flex-col gap-5">
					<label>
						<div className={ui.label}>Hero subtitle</div>
						<textarea
							rows={2}
							className={`${ui.input} resize-none`}
							value={s.subtitle}
							onChange={(e) => setS((p) => ({ ...p, subtitle: e.target.value }))}
						/>
					</label>
					<label>
						<div className={ui.label}>Empty state note (when no roles)</div>
						<textarea
							rows={2}
							className={`${ui.input} resize-none`}
							value={s.empty_note}
							onChange={(e) =>
								setS((p) => ({ ...p, empty_note: e.target.value }))
							}
						/>
					</label>
					<label>
						<div className={ui.label}>Applications email</div>
						<input
							className={ui.input}
							value={s.apply_email}
							placeholder="careers@studio.com"
							onChange={(e) =>
								setS((p) => ({ ...p, apply_email: e.target.value }))
							}
						/>
					</label>

					<div className="grid grid-cols-1 gap-6 border-t border-cream/10 pt-5 sm:grid-cols-2">
						<StringList
							label="Role options"
							items={roleOptions}
							onChange={setRoleOptions}
						/>
						<StringList
							label="Type options"
							items={typeOptions}
							onChange={setTypeOptions}
						/>
					</div>

					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={saveSettings}
							disabled={pending}
							className="cta-gold cursor-pointer bg-gold px-7 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-tiny disabled:opacity-60">
							{pending ? "Saving…" : "Save settings"}
						</button>
						{smsg && (
							<span className="font-sans font-light text-cream/80 text-base">
								{smsg}
							</span>
						)}
					</div>
				</div>
			</section>

			<section>
				<div className="mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-tiny">
					Open roles
				</div>
				{list.length > 4 && (
					<SearchBox
						value={search.q}
						onChange={search.setQ}
						shown={search.shown.length}
						total={list.length}
						noun="roles"
						placeholder="Search role, type, location…"
					/>
				)}
				<div className="flex flex-col gap-4">
					{search.active && search.shown.length === 0 && (
						<p className="rounded-sm border border-dashed border-cream/15 px-4 py-8 text-center font-sans font-light text-cream/80 text-tiny">
							No roles match &ldquo;{search.q.trim()}&rdquo;.
						</p>
					)}
					{search.shown.map((item, i) => (
						<div
							key={item.id}
							{...(search.active ? {} : drag.handlers(i))}
							className={search.active ? "" : drag.itemClass(i)}>
							<OpeningCard
								item={item}
								index={i}
								total={list.length}
								roleOptions={roleOptions}
								typeOptions={typeOptions}
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
							await createOpening();
							router.refresh();
						})
					}
					className="mt-5 w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60">
					{pending ? "Adding…" : "+ Add role"}
				</button>
			</section>
		</div>
	);
}
