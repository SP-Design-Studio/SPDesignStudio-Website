"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveInstagramSettings } from "./home/actions";

const labelCls =
	"font-sans font-light uppercase tracking-[0.26em] text-gold/80 text-[0.614rem] mb-1.5";
const inputCls =
	"w-full border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold";

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
	const [pending, start] = useTransition();
	const [enabled, setEnabled] = useState(initEnabled);
	const [reelsCount, setReels] = useState(initReels);
	const [postsCount, setPosts] = useState(initPosts);
	const [token, setToken] = useState("");
	const [msg, setMsg] = useState("");

	const save = () =>
		start(async () => {
			setMsg("");
			const res = await saveInstagramSettings({
				enabled,
				reelsCount,
				postsCount,
				token: token || undefined,
			});
			setMsg(res.error ?? "Saved");
			setToken("");
			router.refresh();
		});

	return (
		<div className="flex flex-col gap-5">
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
					<div className={labelCls}>Reels (0–18)</div>
					<input
						type="number"
						min={0}
						max={18}
						value={reelsCount}
						onChange={(e) => setReels(Number(e.target.value))}
						className={inputCls}
					/>
				</label>
				<label>
					<div className={labelCls}>Posts (0–18)</div>
					<input
						type="number"
						min={0}
						max={18}
						value={postsCount}
						onChange={(e) => setPosts(Number(e.target.value))}
						className={inputCls}
					/>
				</label>
			</div>

			<label>
				<div className={labelCls}>
					Access token {hasToken ? "(set — paste to replace)" : "(not set)"}
				</div>
				<input
					type="text"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					placeholder={hasToken ? "•••••• stored" : "Paste long-lived token"}
					className={inputCls}
				/>
				<span className="mt-1 block font-sans font-light text-cream/35 text-[0.7rem]">
					Long-lived Instagram Graph token. Auto-refreshes weekly.
				</span>
			</label>

			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={save}
					disabled={pending}
					className="cta-gold w-fit cursor-pointer bg-gold px-7 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-[0.732rem] disabled:opacity-60">
					{pending ? "Saving…" : "Save Instagram settings"}
				</button>
				{msg && (
					<span className="font-sans font-light text-cream/50 text-base">
						{msg}
					</span>
				)}
			</div>
		</div>
	);
}
