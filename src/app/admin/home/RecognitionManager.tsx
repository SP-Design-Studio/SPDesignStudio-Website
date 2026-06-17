"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Recognition } from "@/lib/cms/types";
import {
	createRecognition,
	updateRecognition,
	deleteRecognition,
	reorderRecognition,
} from "./actions";

const inputCls =
	"flex-1 border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold";

function Row({
	item,
	index,
	total,
	onMove,
}: {
	item: Recognition;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
}) {
	const router = useRouter();
	const [label, setLabel] = useState(item.label);
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");
	const dirty = label !== item.label;

	return (
		<div className="flex items-center gap-3">
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
			<input
				className={inputCls}
				value={label}
				onChange={(e) => {
					setLabel(e.target.value);
					setMsg("");
				}}
			/>
			{msg && (
				<span className="font-sans font-light text-cream/50 text-sm">{msg}</span>
			)}
			<button
				type="button"
				disabled={pending || !dirty}
				onClick={() =>
					start(async () => {
						const res = await updateRecognition(item.id, { label });
						setMsg(res.error ?? "Saved");
						router.refresh();
					})
				}
				className="cta-gold cursor-pointer bg-gold px-4 py-2 font-sans font-light uppercase tracking-[0.2em] text-plum-dark text-[0.649rem] disabled:opacity-40">
				Save
			</button>
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						await deleteRecognition(item.id);
						router.refresh();
					})
				}
				className="cursor-pointer border border-cream/20 px-3 py-2 text-cream/55 text-sm hover:border-gold hover:text-gold">
				×
			</button>
		</div>
	);
}

export function RecognitionManager({ initial }: { initial: Recognition[] }) {
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
			await reorderRecognition(next.map((x) => x.id));
			router.refresh();
		});
	};

	return (
		<div className="flex flex-col gap-3">
			{list.map((item, i) => (
				<Row
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
						await createRecognition();
						router.refresh();
					})
				}
				className="w-fit cursor-pointer border border-gold/40 px-6 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.708rem] hover:bg-gold/10 disabled:opacity-60">
				{pending ? "Adding…" : "+ Add recognition"}
			</button>
			<p className="font-sans font-light text-cream/35 text-sm">
				Shown in the hero footer line (e.g. Designer of the Year · …).
			</p>
		</div>
	);
}
