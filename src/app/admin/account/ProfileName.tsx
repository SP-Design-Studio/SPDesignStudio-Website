"use client";
import { useSaving } from "@/lib/admin/saving";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileName } from "./actions";

export function ProfileName({ initial }: { initial: string }) {
	const router = useRouter();
	const [name, setName] = useState(initial);
	const [pending, start] = useSaving();
	const [msg, setMsg] = useState("");
	const dirty = name.trim() !== initial.trim();

	return (
		<div className="flex flex-wrap items-end gap-3">
			<label className="flex flex-col gap-1.5">
				<span className="font-sans font-light uppercase tracking-[0.26em] text-gold text-[0.614rem]">
					Your name
				</span>
				<input
					value={name}
					placeholder="First Last"
					onChange={(e) => {
						setName(e.target.value);
						setMsg("");
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
						setMsg(res.error ?? "Saved");
						router.refresh();
					})
				}
				className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-[0.708rem] disabled:opacity-40">
				{pending ? "Saving…" : "Save"}
			</button>
			{msg && (
				<span className="font-sans font-light text-cream/80 text-sm">{msg}</span>
			)}
		</div>
	);
}
