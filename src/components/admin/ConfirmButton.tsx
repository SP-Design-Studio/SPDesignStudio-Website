"use client";

import { useEffect, useRef, useState } from "react";
import { ui } from "@/lib/admin/ui";

export function ConfirmButton({
	onConfirm,
	label = "Delete",
	confirmLabel = "Confirm?",
	disabled,
	className,
}: {
	onConfirm: () => void;
	label?: string;
	confirmLabel?: string;
	disabled?: boolean;
	className?: string;
}) {
	const [armed, setArmed] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	const click = () => {
		if (!armed) {
			setArmed(true);
			timer.current = setTimeout(() => setArmed(false), 4000);
			return;
		}
		if (timer.current) clearTimeout(timer.current);
		setArmed(false);
		onConfirm();
	};

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={click}
			aria-label={armed ? `${label} — confirm` : label}
			className={
				className ??
				(armed
					? "cursor-pointer rounded-sm border border-red-400/60 bg-red-400/10 px-3 py-1 font-sans font-light uppercase tracking-[0.2em] text-red-200 text-tiny transition-colors"
					: ui.btnDanger)
			}>
			{armed ? confirmLabel : label}
		</button>
	);
}
