"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Recognition } from "@/lib/cms/types";
import {
	createRecognition,
	updateRecognition,
	deleteRecognition,
	reorderRecognition,
} from "./actions";
import { ui } from "@/lib/admin/ui";
import { useFlash } from "@/lib/admin/useFlash";

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
	const [pending, start] = useSaving();
	const [msg, flash] = useFlash();
	const dirty = label !== item.label;

	return (
		<div data-busy={pending || undefined} className="flex items-center gap-3">
			<div className="flex gap-1">
				<button
					aria-label="Move up"
					type="button"
					disabled={index === 0}
					onClick={() => onMove(-1)}
					className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
					↑
				</button>
				<button
					aria-label="Move down"
					type="button"
					disabled={index === total - 1}
					onClick={() => onMove(1)}
					className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
					↓
				</button>
			</div>
			<input
				className={ui.input}
				value={label}
				onChange={(e) => {
					setLabel(e.target.value);
					flash("");
				}}
			/>
			{msg && (
				<span className="font-sans font-light text-cream/80 text-sm">{msg}</span>
			)}
			<button
				type="button"
				disabled={pending || !dirty}
				onClick={() =>
					start(async () => {
						const res = await updateRecognition(item.id, { label });
						flash(res.error ?? "Saved");
						router.refresh();
					})
				}
				className="cta-gold cursor-pointer bg-gold px-4 py-2 font-sans font-light uppercase tracking-[0.2em] text-plum-dark text-tiny disabled:opacity-40">
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
				className="cursor-pointer border border-cream/20 px-3 py-2 text-cream/82 text-sm hover:border-gold hover:text-gold">
				×
			</button>
		</div>
	);
}

export function RecognitionManager({ initial }: { initial: Recognition[] }) {
	const router = useRouter();
	const [list, setList] = useState(initial);
	const [pending, start] = useSaving();

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
				className="w-fit cursor-pointer border border-gold/40 px-6 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60">
				{pending ? "Adding…" : "+ Add recognition"}
			</button>
			<p className="font-sans font-light text-cream/80 text-sm">
				Shown in the hero footer line (e.g. Designer of the Year · …).
			</p>
		</div>
	);
}
