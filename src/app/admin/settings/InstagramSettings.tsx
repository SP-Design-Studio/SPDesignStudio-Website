"use client";
import { useSaving } from "@/lib/admin/saving";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveInstagramSettings } from "../home/actions";
import { ui } from "@/lib/admin/ui";
import { useFlash } from "@/lib/admin/useFlash";

export function InstagramSettings({
	enabled: initEnabled,
	reelsCount: initReels,
	postsCount: initPosts,
	hasToken,
}: {
	enabled: boolean;
	reelsCount: number;
	postsCount: number;
	hasToken: boolean;
}) {
	const router = useRouter();
	const [pending, start] = useSaving();
	const [enabled, setEnabled] = useState(initEnabled);
	const [reelsCount, setReels] = useState(initReels);
	const [postsCount, setPosts] = useState(initPosts);
	const [token, setToken] = useState("");
	const [msg, flash] = useFlash();

	const save = () =>
		start(async () => {
			flash("");
			const res = await saveInstagramSettings({
				enabled,
				reelsCount,
				postsCount,
				token: token || undefined,
			});
			flash(res.error ?? "Saved");
			setToken("");
			router.refresh();
		});

	return (
		<div data-busy={pending || undefined} className="flex flex-col gap-5">
			<label className="flex w-fit cursor-pointer items-center gap-3">
				<input
					type="checkbox"
					checked={enabled}
					onChange={(e) => setEnabled(e.target.checked)}
					className="h-4 w-4 accent-gold cursor-pointer"
				/>
				<span className="font-sans font-normal text-cream text-base">
					Show Instagram feed on the home page
				</span>
			</label>

			<div className="grid grid-cols-2 gap-5 max-w-sm">
				<label>
					<div className={ui.label}>Reels (0–18)</div>
					<input
						type="number"
						min={0}
						max={18}
						value={reelsCount}
						onChange={(e) => setReels(Number(e.target.value))}
						className={ui.input}
					/>
				</label>
				<label>
					<div className={ui.label}>Posts (0–18)</div>
					<input
						type="number"
						min={0}
						max={18}
						value={postsCount}
						onChange={(e) => setPosts(Number(e.target.value))}
						className={ui.input}
					/>
				</label>
			</div>

			<label>
				<div className={ui.label}>
					Access token {hasToken ? "(set — paste to replace)" : "(not set)"}
				</div>
				<input
					type="text"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					placeholder={hasToken ? "•••••• stored" : "Paste long-lived token"}
					className={ui.input}
				/>
				<span className="mt-1 block font-sans font-light text-cream/80 text-tiny">
					Long-lived Instagram Graph token. Auto-refreshes weekly.
				</span>
			</label>

			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={save}
					disabled={pending}
					className="cta-gold w-fit cursor-pointer bg-gold px-7 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-tiny disabled:opacity-60">
					{pending ? "Saving…" : "Save Instagram settings"}
				</button>
				{msg && (
					<span className="font-sans font-light text-cream/80 text-base">
						{msg}
					</span>
				)}
			</div>
		</div>
	);
}
