"use client";

import { useRef, useState } from "react";
import { useReorderMode } from "./reorderMode";

export interface DragItem {
	id: string;
}

export function useDragReorder<T extends DragItem>(
	items: T[],
	commit: (ordered: T[]) => void,
) {
	const enabled = useReorderMode();
	const from = useRef<number | null>(null);
	const [dragging, setDragging] = useState<number | null>(null);
	const [over, setOver] = useState<number | null>(null);

	const reset = () => {
		from.current = null;
		setDragging(null);
		setOver(null);
	};

	const move = (a: number, b: number) => {
		if (a === b || a < 0 || b < 0 || a >= items.length || b >= items.length)
			return;
		const next = [...items];
		const [picked] = next.splice(a, 1);
		next.splice(b, 0, picked!);
		commit(next);
	};

	const handlers = (index: number) => {
		if (!enabled) return {};
		return {
			draggable: true,
			onDragStart: (e: React.DragEvent) => {
				from.current = index;
				setDragging(index);
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData("text/plain", String(index));
			},
			onDragOver: (e: React.DragEvent) => {
				if (from.current === null) return;
				e.preventDefault();
				e.dataTransfer.dropEffect = "move";
				if (over !== index) setOver(index);
			},
			onDrop: (e: React.DragEvent) => {
				e.preventDefault();
				const a = from.current;
				reset();
				if (a !== null) move(a, index);
			},
			onDragEnd: reset,
		};
	};

	const itemClass = (index: number) =>
		!enabled
			? ""
			: [
					dragging === index ? "opacity-40" : "",
					over === index && dragging !== null && dragging !== index
						? "ring-1 ring-gold/60"
						: "",
				]
					.filter(Boolean)
					.join(" ");

	return { handlers, itemClass, dragging };
}
