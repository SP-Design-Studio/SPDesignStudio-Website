"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { ProcessStep } from "@/lib/cms/types";
import { createStep, updateStep, deleteStep, reorderSteps } from "./actions";
import { useDirty } from "../useDirty";

const inputCls =
	"w-full border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold";
const labelCls =
	"font-sans font-light uppercase tracking-[0.26em] text-gold text-[0.614rem] mb-1.5";

function Card({
	item,
	index,
	total,
	onMove,
}: {
	item: ProcessStep;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
}) {
	const router = useRouter();
	const [form, setForm] = useState({
		no: item.no,
		title: item.title,
		description: item.description ?? "",
		img: item.img,
	});
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");
	const { dirty, markSaved } = useDirty(form);

	const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
		setForm((f) => ({ ...f, [k]: v }));

	const save = () =>
		start(async () => {
			const res = await updateStep(item.id, {
				...form,
				description: form.description || null,
			});
			setMsg(res.error ?? "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deleteStep(item.id);
			router.refresh();
		});

	return (
		<div className="grid grid-cols-[160px_1fr] gap-4 border border-cream/10 p-4">
			<ImageUploader
				value={form.img}
				onChange={(url) => set("img", url)}
				folder="process"
				aspect="aspect-[4/3]"
			/>
			<div className="flex flex-col gap-3">
				<div className="grid grid-cols-[90px_1fr] gap-3">
					<label>
						<div className={labelCls}>No.</div>
						<input
							className={inputCls}
							value={form.no}
							onChange={(e) => set("no", e.target.value)}
						/>
					</label>
					<label>
						<div className={labelCls}>Title</div>
						<input
							className={inputCls}
							value={form.title}
							onChange={(e) => set("title", e.target.value)}
						/>
					</label>
				</div>
				<label>
					<div className={labelCls}>Description</div>
					<textarea
						rows={3}
						className={`${inputCls} resize-none`}
						value={form.description}
						onChange={(e) => set("description", e.target.value)}
					/>
				</label>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex gap-1">
						<button
							type="button"
							disabled={index === 0}
							onClick={() => onMove(-1)}
							className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
							↑
						</button>
						<button
							type="button"
							disabled={index === total - 1}
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
						<button
							type="button"
							onClick={remove}
							disabled={pending}
							className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-[0.649rem] hover:text-gold">
							Delete
						</button>
						<button
							type="button"
							onClick={save}
							disabled={pending || !dirty}
							className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-[0.708rem] disabled:opacity-40 disabled:cursor-not-allowed">
							{pending ? "…" : "Save"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ProcessManager({ initial }: { initial: ProcessStep[] }) {
	const router = useRouter();
	const [list, setList] = useState(initial);
	const [pending, start] = useTransition();

	useEffect(() => {
		setList(initial);
	}, [initial]);

	const move = (i: number, dir: -1 | 1) => {
		const next = [...list];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		setList(next);
		start(async () => {
			await reorderSteps(next.map((x) => x.id));
			router.refresh();
		});
	};

	return (
		<div className="flex flex-col gap-5">
			{list.map((item, i) => (
				<Card
					key={item.id}
					item={item}
					index={i}
					total={list.length}
					onMove={(dir) => move(i, dir)}
				/>
			))}
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						await createStep();
						router.refresh();
					})
				}
				className="w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.732rem] hover:bg-gold/10 disabled:opacity-60">
				{pending ? "Adding…" : "+ Add step"}
			</button>
		</div>
	);
}
