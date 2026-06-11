"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { TeamMember } from "@/lib/cms/types";
import {
	createMember,
	updateMember,
	deleteMember,
	reorderMembers,
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
	item: TeamMember;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
}) {
	const router = useRouter();
	const [form, setForm] = useState({
		name: item.name,
		role: item.role ?? "",
		note: item.note ?? "",
		img: item.img,
	});
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");
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
			setMsg(res.error ?? "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deleteMember(item.id);
			router.refresh();
		});

	return (
		<div className="grid grid-cols-[120px_1fr] gap-4 border border-cream/10 p-4">
			<ImageUploader
				value={form.img}
				onChange={(url) => set("img", url)}
				folder="team"
				aspect="aspect-[3/4]"
			/>
			<div className="flex flex-col gap-3">
				<label>
					<div className={labelCls}>Name</div>
					<input
						className={inputCls}
						value={form.name}
						onChange={(e) => set("name", e.target.value)}
					/>
				</label>
				<label>
					<div className={labelCls}>Role</div>
					<input
						className={inputCls}
						value={form.role}
						placeholder="Interior Architect"
						onChange={(e) => set("role", e.target.value)}
					/>
				</label>
				<label>
					<div className={labelCls}>Note</div>
					<input
						className={inputCls}
						value={form.note}
						placeholder="Lead Concept & Detailing"
						onChange={(e) => set("note", e.target.value)}
					/>
				</label>
				<div className="mt-auto flex items-center justify-between">
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
					<div className="flex items-center gap-3">
						{msg && (
							<span className="font-sans font-light text-cream/50 text-sm">
								{msg}
							</span>
						)}
						<button
							type="button"
							onClick={remove}
							disabled={pending}
							className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/45 text-[0.649rem] hover:text-gold">
							Delete
						</button>
						<button
							type="button"
							onClick={save}
							disabled={pending || !dirty}
							className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-[0.708rem] disabled:opacity-60">
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
			await reorderMembers(next.map((x) => x.id));
			router.refresh();
		});
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{list.map((item, i) => (
					<Card
						key={item.id}
						item={item}
						index={i}
						total={list.length}
						onMove={(dir) => move(i, dir)}
					/>
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
				className="w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.732rem] hover:bg-gold/10 disabled:opacity-60">
				+ Add member
			</button>
		</div>
	);
}
