"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { CONTACT } from "@/lib/studio";

type Kind = "project" | "partnership";
type Status = "idle" | "sending" | "sent" | "error";

export function ContactDrawer() {
	const [kind, setKind] = useState<Kind | null>(null);
	const [values, setValues] = useState<Record<string, string>>({});
	const [status, setStatus] = useState<Status>("idle");
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onOpen = (e: Event) => {
			const k = (e as CustomEvent).detail?.kind as Kind;
			if (k === "project" || k === "partnership") {
				setValues({});
				setStatus("idle");
				setKind(k);
			}
		};
		window.addEventListener("open-inquiry", onOpen);
		return () => window.removeEventListener("open-inquiry", onOpen);
	}, []);

	const close = () => {
		document.body.style.overflow = "";
		if (!panelRef.current) {
			setKind(null);
			return;
		}
		gsap.to(panelRef.current, {
			clipPath: "inset(100% 0% 0% 0%)",
			duration: 0.55,
			ease: "expo.inOut",
			onComplete: () => setKind(null),
		});
	};

	useEffect(() => {
		if (!kind || !panelRef.current) return;
		document.body.style.overflow = "hidden";
		gsap.set(panelRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
		gsap.to(panelRef.current, {
			clipPath: "inset(0% 0% 0% 0%)",
			duration: 0.7,
			ease: "expo.inOut",
		});
		gsap.fromTo(
			".cd-reveal",
			{ y: 26, autoAlpha: 0, filter: "blur(5px)" },
			{
				y: 0,
				autoAlpha: 1,
				filter: "blur(0px)",
				duration: 0.7,
				ease: "power3.out",
				stagger: 0.05,
				delay: 0.32,
			},
		);
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [kind]);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("sending");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ kind, ...values }),
			});
			if (!res.ok) throw new Error("failed");
			setStatus("sent");
		} catch {
			setStatus("error");
		}
	};

	if (!kind) return null;
	const cfg = CONTACT.forms[kind];

	const inputCls =
		"w-full bg-transparent border-b border-cream/20 py-3 text-cream text-lg outline-none transition-colors placeholder:text-cream/25 focus:border-gold";

	return createPortal(
		<div
			ref={panelRef}
			className="fixed inset-0 z-200 overflow-y-auto bg-plum-dark text-cream"
			style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
			<button
				type="button"
				onClick={close}
				aria-label="Close"
				className="cd-reveal fixed right-6 top-6 z-10 flex cursor-pointer items-center gap-2 font-sans font-light uppercase tracking-[0.28em] text-cream/55 text-[0.6rem] md:right-10 md:top-9 md:text-xs hover:text-cream transition-colors">
				Close
				<span className="text-xl leading-none">&times;</span>
			</button>

			<div className="mx-auto grid min-h-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 sm:px-10 md:px-16 md:py-20 lg:grid-cols-12 lg:gap-16">
				<div className="lg:col-span-5">
					<div className="cd-reveal font-sans font-light uppercase tracking-[0.42em] text-gold text-[0.6rem] md:text-xs mb-5">
						{cfg.eyebrow}
					</div>
					<h2 className="cd-reveal font-bdscript text-cream leading-[0.95] text-5xl sm:text-6xl md:text-7xl mb-7">
						{cfg.headline}
					</h2>
					<span className="cd-reveal block h-px w-16 bg-gold/50 mb-7" />
					<p className="cd-reveal font-serif italic font-light text-cream/65 text-base md:text-xl leading-[1.6] max-w-sm">
						{cfg.intro}
					</p>
				</div>

				<div className="lg:col-span-7 lg:border-l lg:border-cream/10 lg:pl-16">
					{status === "sent" ? (
						<div className="cd-reveal">
							<div className="font-bdscript text-gold text-5xl md:text-6xl mb-4">
								{CONTACT.success.title}
							</div>
							<p className="font-serif italic font-light text-cream/70 text-lg md:text-xl max-w-md">
								{CONTACT.success.body}
							</p>
						</div>
					) : (
						<form onSubmit={submit} className="flex flex-col gap-8">
							{cfg.fields.map((f) => (
								<label key={f.name} className="cd-reveal flex flex-col gap-2.5">
									<span className="font-sans font-light uppercase tracking-[0.28em] text-gold/80 text-[0.58rem]">
										{f.label}
									</span>
									{f.type === "textarea" ? (
										<textarea
											required={f.required}
											rows={3}
											placeholder={f.placeholder}
											value={values[f.name] ?? ""}
											onChange={(e) =>
												setValues((v) => ({ ...v, [f.name]: e.target.value }))
											}
											className={`${inputCls} resize-none`}
										/>
									) : (
										<input
											type={f.type}
											required={f.required}
											placeholder={f.placeholder}
											value={values[f.name] ?? ""}
											onChange={(e) =>
												setValues((v) => ({ ...v, [f.name]: e.target.value }))
											}
											className={inputCls}
										/>
									)}
								</label>
							))}
							<button
								type="submit"
								disabled={status === "sending"}
								className="cd-reveal group mt-3 inline-flex w-fit cursor-pointer items-center gap-3 bg-gold px-9 py-4 font-sans font-light uppercase tracking-[0.28em] text-plum-dark text-xs transition-opacity disabled:opacity-60">
								{status === "sending" ? "Sending…" : "Send Inquiry"}
								<span className="transition-transform duration-500 group-hover:translate-x-1">
									&rarr;
								</span>
							</button>
							{status === "error" && (
								<p className="cd-reveal font-sans text-sm text-gold/80">
									Something went wrong. Please try again or email us directly.
								</p>
							)}
						</form>
					)}
				</div>
			</div>
		</div>,
		document.body,
	);
}
