"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function ConfirmDialog({
	open,
	title,
	message,
	confirmLabel,
	cancelLabel = "Cancel",
	onConfirm,
	onCancel,
}: {
	open: boolean;
	title: string;
	message: string;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	const [mounted, setMounted] = useState(false);
	const titleId = useId();
	const bodyId = useId();
	const cancelRef = useRef<HTMLButtonElement>(null);
	const confirmRef = useRef<HTMLButtonElement>(null);

	useEffect(() => setMounted(true), []);

	useEffect(() => {
		if (!open) return;
		const previous = document.activeElement as HTMLElement | null;
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		cancelRef.current?.focus();

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onCancel();
				return;
			}
			if (e.key !== "Tab") return;
			const first = cancelRef.current;
			const last = confirmRef.current;
			if (!first || !last) return;
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = overflow;
			previous?.focus();
		};
	}, [open, onCancel]);

	if (!open || !mounted) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[140] flex items-center justify-center bg-plum-dark/80 px-6 backdrop-blur-sm [animation:auth-fade-in_0.2s_ease]"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onCancel();
			}}>
			<div
				role="alertdialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={bodyId}
				className="w-full max-w-md rounded-sm border border-cream/15 bg-plum-dark p-7 shadow-2xl [animation:dialog-pop_0.28s_cubic-bezier(0.16,1,0.3,1)] md:p-9">
				<span className="mb-5 block h-px w-12 bg-bad/70" />
				<h2
					id={titleId}
					className="font-serif font-light text-cream text-3xl leading-tight">
					{title}
				</h2>
				<p
					id={bodyId}
					className="mt-3 font-sans font-light text-cream/85 text-base leading-relaxed">
					{message}
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-end gap-3">
					<button
						ref={cancelRef}
						type="button"
						onClick={onCancel}
						className="cursor-pointer rounded-sm border border-cream/30 px-6 py-2.5 font-sans font-light uppercase tracking-[0.22em] text-cream/90 text-tiny transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
						{cancelLabel}
					</button>
					<button
						ref={confirmRef}
						type="button"
						onClick={onConfirm}
						className="cta-bad cursor-pointer rounded-sm bg-bad px-6 py-2.5 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-tiny focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bad">
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
