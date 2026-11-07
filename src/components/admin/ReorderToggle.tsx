"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setReorderMode, useReorderMode } from "@/lib/admin/reorderMode";

export function ReorderToggle() {
	const active = useReorderMode();
	const path = usePathname();

	useEffect(() => {
		setReorderMode(false);
		return () => setReorderMode(false);
	}, [path]);

	return (
		<button
			type="button"
			aria-pressed={active}
			onClick={() => setReorderMode(!active)}
			className={`cursor-pointer rounded-full border px-3.5 py-1 font-sans font-light uppercase tracking-[0.2em] text-tiny transition-colors pointer-coarse:min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
				active
					? "border-gold/60 bg-gold/10 text-gold"
					: "border-cream/20 text-cream/80 hover:border-gold hover:text-gold"
			}`}>
			{active ? "Done" : "Reorder"}
		</button>
	);
}
