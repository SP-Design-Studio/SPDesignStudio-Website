"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Discipline } from "@/lib/cms/types";
import {
	createDiscipline,
	updateDiscipline,
	deleteDiscipline,
	reorderDisciplines,
} from "./actions";
import { useDirty } from "../useDirty";

const inputCls =
	"w-full border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold";
const labelCls =
	"font-sans font-light uppercase tracking-[0.26em] text-gold/80 text-[0.614rem] mb-1.5";

function Card({
	item,
	index,
	total,
	onMove,
}: {
	item: Discipline;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
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
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");
	const { dirty, markSaved } = useDirty(form);

	const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
		setForm((f) => ({ ...f, [k]: v }));

	const save = () =>
		start(async () => {
			setMsg("");
			const res = await updateDiscipline(item.id, {
				...form,
				big_stat: form.big_stat || null,
				description: form.description || null,
			});
			setMsg(res.error ? res.error : "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});

	const remove = () =>
		start(async () => {
			await deleteDiscipline(item.id);
			router.refresh();
		});

	return (
		<div className="grid grid-cols-1 gap-5 border border-cream/10 p-5 md:grid-cols-[180px_1fr]">
			<div className="flex flex-col gap-3">
				<ImageUploader
					value={form.img}
					onChange={(url) => set("img", url)}
					folder="home"
					aspect="aspect-[4/3]"
				/>
				<div className="flex items-center justify-between">
					<div className="flex gap-1">
						<button
							type="button"
							disabled={index === 0}
							onClick={() => onMove(-1)}
							className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/60 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
							↑
						</button>
						<button
							type="button"
							disabled={index === total - 1}
							onClick={() => onMove(1)}
							className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/60 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
							↓
						</button>
					</div>
					<button
						type="button"
						onClick={remove}
						disabled={pending}
						className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/45 text-[0.649rem] hover:text-gold">
						Delete
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label>
						<div className={labelCls}>Top label</div>
						<input
							className={inputCls}
							value={form.top_label}
							onChange={(e) => set("top_label", e.target.value)}
						/>
					</label>
					<label>
						<div className={labelCls}>Big stat</div>
						<input
							className={inputCls}
							value={form.big_stat}
							onChange={(e) => set("big_stat", e.target.value)}
						/>
					</label>
				</div>
				<label>
					<div className={labelCls}>Description</div>
					<textarea
						rows={2}
						className={`${inputCls} resize-none`}
						value={form.description}
						onChange={(e) => set("description", e.target.value)}
					/>
				</label>
				<div className="grid grid-cols-2 gap-4">
					<label>
						<div className={labelCls}>Variant</div>
						<select
							className={`${inputCls} cursor-pointer`}
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
						<div className={labelCls}>Span</div>
						<select
							className={`${inputCls} cursor-pointer`}
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
						className="cta-gold cursor-pointer bg-gold px-6 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-[0.732rem] disabled:opacity-60">
						{pending ? "Saving…" : "Save"}
					</button>
					{msg && (
						<span className="font-sans font-light text-cream/50 text-sm">
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
	const [pending, start] = useTransition();

	useEffect(() => {
		setItems(initial);
	}, [initial]);

	const add = () =>
		start(async () => {
			await createDiscipline();
			router.refresh();
		});

	const move = (index: number, dir: -1 | 1) => {
		const next = [...items];
		const j = index + dir;
		if (j < 0 || j >= next.length) return;
		[next[index], next[j]] = [next[j], next[index]];
		setItems(next);
		start(async () => {
			await reorderDisciplines(next.map((d) => d.id));
			router.refresh();
		});
	};

	return (
		<div className="flex flex-col gap-5">
			{items.map((item, i) => (
				<Card
					key={item.id}
					item={item}
					index={i}
					total={items.length}
					onMove={(dir) => move(i, dir)}
				/>
			))}
			<button
				type="button"
				onClick={add}
				disabled={pending}
				className="w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.732rem] transition-colors hover:bg-gold/10 disabled:opacity-60">
				+ Add discipline
			</button>
		</div>
	);
}
