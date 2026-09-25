"use client";
import { useSaving } from "@/lib/admin/saving";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileName } from "./actions";
import { useFlash } from "@/lib/admin/useFlash";

export function ProfileName({ initial }: { initial: string }) {
	const router = useRouter();
	const [name, setName] = useState(initial);
	const [pending, start] = useSaving();
	const [msg, flash] = useFlash();
	const dirty = name.trim() !== initial.trim();

	return (
		<div data-busy={pending || undefined} className="flex flex-wrap items-end gap-3">
			<label className="flex flex-col gap-1.5">
				<span className="font-sans font-light uppercase tracking-[0.26em] text-gold text-micro">
					Your name
				</span>
				<input
					value={name}
					placeholder="First Last"
					onChange={(e) => {
						setName(e.target.value);
						flash("");
					}}
					className="w-64 border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold"
				/>
			</label>
			<button
				type="button"
				disabled={pending || !dirty}
				onClick={() =>
					start(async () => {
						const res = await updateProfileName(name);
						flash(res.error ?? "Saved");
						router.refresh();
					})
				}
				className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-tiny disabled:opacity-40">
				{pending ? "Saving…" : "Save"}
			</button>
			{msg && (
				<span className="font-sans font-light text-cream/80 text-sm">{msg}</span>
			)}
		</div>
	);
}
