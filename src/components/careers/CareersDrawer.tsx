"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { CloseButton } from "@/components/shared/CloseButton";
import { CAREERS } from "@/lib/studio";

type Status = "idle" | "sending" | "sent" | "error";

export function CareersDrawer() {
	const [open, setOpen] = useState(false);
	const [values, setValues] = useState<Record<string, string>>({});
	const [files, setFiles] = useState<{
		portfolio?: { name: string; content: string };
		resume?: { name: string; content: string };
	}>({});
	const [fileError, setFileError] = useState("");
	const [roleLocked, setRoleLocked] = useState(false);
	const [status, setStatus] = useState<Status>("idle");
	const panelRef = useRef<HTMLDivElement>(null);

	const MAX_FILE = 3 * 1024 * 1024;
	const readPdf = (kind: "portfolio" | "resume", file?: File) => {
		if (!file) {
			setFiles((s) => ({ ...s, [kind]: undefined }));
			return;
		}
		if (file.type !== "application/pdf") {
			setFileError("Please upload a PDF file.");
			return;
		}
		if (file.size > MAX_FILE) {
			setFileError("Each file must be under 3 MB.");
			return;
		}
		setFileError("");
		const reader = new FileReader();
		reader.onload = () => {
			const result = String(reader.result);
			const content = result.includes(",")
				? (result.split(",").pop() ?? "")
				: result;
			setFiles((s) => ({ ...s, [kind]: { name: file.name, content } }));
		};
		reader.readAsDataURL(file);
	};

	useEffect(() => {
		const onOpen = (e: Event) => {
			const role = (e as CustomEvent).detail?.role as string | undefined;
			setValues(role ? { role } : {});
			setRoleLocked(!!role);
			setStatus("idle");
			setOpen(true);
		};
		window.addEventListener("open-application", onOpen);
		return () => window.removeEventListener("open-application", onOpen);
	}, []);

	const close = () => {
		document.body.style.overflow = "";
		if (!panelRef.current) {
			setOpen(false);
			return;
		}
		gsap.to(panelRef.current, {
			clipPath: "inset(100% 0% 0% 0%)",
			duration: 0.55,
			ease: "expo.inOut",
			onComplete: () => setOpen(false),
		});
	};

	useEffect(() => {
		if (!open || !panelRef.current) return;
		document.body.style.overflow = "hidden";
		gsap.set(panelRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
		gsap.to(panelRef.current, {
			clipPath: "inset(0% 0% 0% 0%)",
			duration: 0.7,
			ease: "expo.inOut",
		});
		gsap.fromTo(
			".ca-reveal",
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!files.portfolio) {
			setFileError("Please attach your portfolio (PDF).");
			return;
		}
		if (!files.resume) {
			setFileError("Please attach your resume (PDF).");
			return;
		}
		const totalB64 =
			(files.portfolio?.content.length ?? 0) +
			(files.resume?.content.length ?? 0);
		if (totalB64 > 4_000_000) {
			setFileError(
				"Combined files are too large — please compress to ~2 MB each.",
			);
			return;
		}
		setFileError("");
		setStatus("sending");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					kind: "career",
					...values,
					portfolioFile: files.portfolio,
					resumeFile: files.resume,
				}),
			});
			if (!res.ok) {
				const body = (await res.json().catch(() => null)) as {
					error?: string;
				} | null;
				if (body?.error) setFileError(body.error);
				throw new Error("failed");
			}
			setStatus("sent");
		} catch {
			setStatus("error");
		}
	};

	if (!open) return null;
	const cfg = CAREERS.apply;

	const inputCls =
		"w-full bg-transparent border-b border-cream/20 py-3 text-cream text-xl outline-none transition-colors placeholder:text-cream/25 focus:border-gold";

	return createPortal(
		<div
			ref={panelRef}
			className="fixed inset-0 z-200 overflow-y-auto bg-plum-dark text-cream"
			style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
			<CloseButton
				onClick={close}
				className="ca-reveal fixed right-6 top-6 z-10 md:right-10 md:top-9"
			/>

			<div className="mx-auto grid min-h-full max-w-6xl grid-cols-1 items-start gap-9 px-6 py-20 sm:px-10 sm:py-24 md:px-16 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-16">
				<div className="lg:col-span-5">
					<div className="ca-reveal font-sans font-normal uppercase tracking-[0.42em] text-gold text-[0.672rem] md:text-sm mb-4 md:mb-5">
						{cfg.eyebrow}
					</div>
					<h2 className="ca-reveal font-bdscript text-cream leading-[0.95] text-4xl sm:text-6xl md:text-7xl mb-5 md:mb-7">
						{cfg.headline}
					</h2>
					<span className="ca-reveal block h-px w-16 bg-gold/50 mb-7" />
					<p className="ca-reveal font-serif italic font-light text-cream/90 text-lg md:text-xl leading-[1.6] max-w-sm">
						{cfg.intro}
					</p>
				</div>

				<div className="lg:col-span-7 lg:border-l lg:border-cream/10 lg:pl-16">
					{status === "sent" ? (
						<div className="ca-reveal">
							<div className="font-bdscript text-gold text-5xl md:text-6xl mb-4">
								{cfg.successTitle}
							</div>
							<p className="font-serif italic font-light text-cream/90 text-xl md:text-xl max-w-md">
								{cfg.successBody}
							</p>
						</div>
					) : (
						<form onSubmit={submit} className="flex flex-col gap-6 sm:gap-8">
							{cfg.fields.map((f) => (
								<Fragment key={f.name}>
									<label className="ca-reveal flex flex-col gap-2.5">
										<span className="font-sans font-normal uppercase tracking-[0.28em] text-gold text-[0.65rem]">
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
												readOnly={f.name === "role" && roleLocked}
												placeholder={f.placeholder}
												value={values[f.name] ?? ""}
												onChange={(e) =>
													setValues((v) => ({ ...v, [f.name]: e.target.value }))
												}
												className={
													f.name === "role" && roleLocked
														? `${inputCls} cursor-not-allowed text-cream/70`
														: inputCls
												}
											/>
										)}
									</label>
									{f.name === "role" &&
										(["portfolio", "resume"] as const).map((k) => (
											<label
												key={k}
												className="ca-reveal flex flex-col gap-2.5">
												<span className="font-sans font-normal uppercase tracking-[0.28em] text-gold text-[0.65rem]">
													{k === "portfolio" ? "Portfolio" : "Resume"} (PDF,
													required)
												</span>
												<input
													type="file"
													accept="application/pdf"
													onChange={(e) => readPdf(k, e.target.files?.[0])}
													className="cursor-pointer text-cream/80 text-sm file:mr-4 file:cursor-pointer file:rounded-sm file:border file:border-gold/40 file:bg-transparent file:px-4 file:py-2 file:font-sans file:uppercase file:tracking-[0.2em] file:text-gold file:text-[0.6rem] hover:file:border-gold"
												/>
												{files[k] && (
													<span className="font-sans text-cream/70 text-sm">
														{files[k]!.name}
													</span>
												)}
											</label>
										))}
								</Fragment>
							))}

							{fileError && (
								<p className="ca-reveal font-sans text-base text-gold">
									{fileError}
								</p>
							)}

							<button
								type="submit"
								disabled={status === "sending"}
								className="ca-reveal cta-gold group mt-3 inline-flex w-fit cursor-pointer items-center gap-3 bg-gold px-9 py-4 font-sans font-normal uppercase tracking-[0.28em] text-plum-dark text-sm disabled:opacity-60">
								{status === "sending" ? "Sending…" : "Submit Application"}
								<span className="transition-transform duration-500 group-hover:translate-x-1">
									&rarr;
								</span>
							</button>
							{status === "error" && (
								<p className="ca-reveal font-sans text-base text-gold">
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
