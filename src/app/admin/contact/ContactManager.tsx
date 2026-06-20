"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/cms/types";
import { saveSiteSettings } from "./actions";
import { useDirty } from "../useDirty";

const inputCls =
	"w-full border-b border-cream/20 bg-transparent py-2.5 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold";
const labelCls =
	"font-sans font-light uppercase tracking-[0.26em] text-gold text-[0.614rem] mb-1.5";

type Hour = { days: string; time: string };

export function ContactManager({ initial }: { initial: SiteSettings | null }) {
	const router = useRouter();
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");

	const [form, setForm] = useState({
		name: initial?.name ?? "",
		founder: initial?.founder ?? "",
		founded: initial?.founded ?? "",
		email: initial?.email ?? "",
		phone: initial?.phone ?? "",
		whatsapp: initial?.whatsapp ?? "",
		address: initial?.address ?? "",
		location: initial?.location ?? "",
		maps_url: initial?.maps_url ?? "",
		instagram: initial?.instagram ?? "",
		linkedin: initial?.linkedin ?? "",
	});
	const [hours, setHours] = useState<Hour[]>(initial?.hours ?? []);
	const { dirty, markSaved } = useDirty({ form, hours });

	const set = (k: keyof typeof form, v: string) =>
		setForm((f) => ({ ...f, [k]: v }));

	const setHour = (i: number, k: keyof Hour, v: string) =>
		setHours((hs) => hs.map((h, j) => (j === i ? { ...h, [k]: v } : h)));
	const addHour = () => setHours((hs) => [...hs, { days: "", time: "" }]);
	const removeHour = (i: number) =>
		setHours((hs) => hs.filter((_, j) => j !== i));

	const save = () =>
		start(async () => {
			setMsg("");
			const res = await saveSiteSettings({ ...form, hours });
			setMsg(res.error ? res.error : "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});

	const field = (k: keyof typeof form, label: string, placeholder = "") => (
		<label>
			<div className={labelCls}>{label}</div>
			<input
				className={inputCls}
				value={form[k]}
				placeholder={placeholder}
				onChange={(e) => set(k, e.target.value)}
			/>
		</label>
	);

	return (
		<div className="flex flex-col gap-10">
			<section>
				<div className="mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-[0.684rem]">
					Channels
				</div>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					{field("email", "Email", "hello@studio.com")}
					{field("phone", "Phone", "+91 …")}
					{field("whatsapp", "WhatsApp link", "https://wa.me/…")}
					{field("instagram", "Instagram link", "https://instagram.com/…")}
					{field("linkedin", "LinkedIn link", "https://linkedin.com/…")}
				</div>
			</section>

			<section>
				<div className="mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-[0.684rem]">
					Visit
				</div>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					{field("address", "Address", "Banjara Hills, Hyderabad")}
					{field("location", "City / region", "Hyderabad, India")}
					{field("maps_url", "Google Maps link", "https://maps.app.goo.gl/…")}
				</div>
			</section>

			<section>
				<div className="mb-5 flex items-center justify-between">
					<span className="font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-[0.684rem]">
						Studio hours
					</span>
					<button
						type="button"
						onClick={addHour}
						className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-gold text-[0.649rem] hover:opacity-80">
						{pending ? "Adding…" : "+ Add row"}
					</button>
				</div>
				<div className="flex flex-col gap-3">
					{hours.map((h, i) => (
						<div key={i} className="flex items-center gap-3">
							<input
								className={inputCls}
								value={h.days}
								placeholder="Monday — Friday"
								onChange={(e) => setHour(i, "days", e.target.value)}
							/>
							<input
								className={inputCls}
								value={h.time}
								placeholder="10:00 AM — 06:00 PM"
								onChange={(e) => setHour(i, "time", e.target.value)}
							/>
							<button
								type="button"
								onClick={() => removeHour(i)}
								className="shrink-0 cursor-pointer border border-cream/20 px-3 py-2 text-cream/82 text-sm hover:border-gold hover:text-gold">
								×
							</button>
						</div>
					))}
					{hours.length === 0 && (
						<p className="font-sans font-light text-cream/80 text-base">
							No hours yet — add a row.
						</p>
					)}
				</div>
			</section>

			<section>
				<div className="mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-[0.684rem]">
					Studio identity
				</div>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
					{field("name", "Studio name")}
					{field("founder", "Founder")}
					{field("founded", "Founded (year)")}
				</div>
			</section>

			<div className="flex items-center gap-4 border-t border-cream/10 pt-8">
				<button
					type="button"
					onClick={save}
					disabled={pending || !dirty}
					className="cta-gold cursor-pointer bg-gold px-8 py-3 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-sm disabled:opacity-40 disabled:cursor-not-allowed">
					{pending ? "Saving…" : "Save changes"}
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
