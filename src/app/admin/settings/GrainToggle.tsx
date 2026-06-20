"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSaving } from "@/lib/admin/saving";
import { saveGrain } from "./actions";

export function GrainToggle({
	enabled: initEnabled,
	intensity: initIntensity,
}: {
	enabled: boolean;
	intensity: number;
}) {
	const router = useRouter();
	const [pending, start] = useSaving();
	const [enabled, setEnabled] = useState(initEnabled);
	const [intensity, setIntensity] = useState(initIntensity);
	const [msg, setMsg] = useState("");

	const persist = (en: boolean, inten: number) =>
		start(async () => {
			const res = await saveGrain(en, inten);
			setMsg(res.error ?? "Saved");
			router.refresh();
		});

	return (
		<div className="flex flex-col gap-4">
			<label className="flex w-fit cursor-pointer items-center gap-3">
				<input
					type="checkbox"
					checked={enabled}
					disabled={pending}
					onChange={(e) => {
						setEnabled(e.target.checked);
						persist(e.target.checked, intensity);
					}}
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

			{enabled && (
				<label className="flex max-w-sm flex-col gap-1.5">
					<span className="font-sans font-light uppercase tracking-[0.26em] text-gold text-[0.614rem]">
						Intensity — {Math.round((intensity / 0.4) * 100)}%
					</span>
					<input
						type="range"
						min={0}
						max={0.4}
						step={0.01}
						value={intensity}
						disabled={pending}
						onChange={(e) => setIntensity(Number(e.target.value))}
						onPointerUp={() => persist(enabled, intensity)}
						className="w-full accent-gold cursor-pointer"
					/>
				</label>
			)}
		</div>
	);
}
