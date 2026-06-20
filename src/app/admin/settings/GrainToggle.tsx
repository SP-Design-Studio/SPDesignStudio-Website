"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSaving } from "@/lib/admin/saving";
import { saveGrainEnabled } from "./actions";

export function GrainToggle({ enabled: init }: { enabled: boolean }) {
	const router = useRouter();
	const [pending, start] = useSaving();
	const [enabled, setEnabled] = useState(init);
	const [msg, setMsg] = useState("");

	const toggle = (v: boolean) => {
		setEnabled(v);
		start(async () => {
			const res = await saveGrainEnabled(v);
			setMsg(res.error ?? "Saved");
			router.refresh();
		});
	};

	return (
		<label className="flex w-fit cursor-pointer items-center gap-3">
			<input
				type="checkbox"
				checked={enabled}
				disabled={pending}
				onChange={(e) => toggle(e.target.checked)}
				className="h-4 w-4 accent-gold cursor-pointer"
			/>
			<span className="font-sans font-normal text-cream text-base">
				Film grain overlay across the site
			</span>
			{msg && (
				<span className="font-sans font-light text-cream/80 text-sm">
					{msg}
				</span>
			)}
		</label>
	);
}
