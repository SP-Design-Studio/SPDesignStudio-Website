"use client";

import { useState } from "react";
import { ui } from "@/lib/admin/ui";
import { ConfirmDialog } from "./ConfirmDialog";

export function ConfirmButton({
	onConfirm,
	label = "Delete",
	title,
	message = "It leaves your draft now and comes off the live site when you publish. You can restore it until then.",
	confirmLabel,
	disabled,
	className,
}: {
	onConfirm: () => void;
	label?: string;
	title?: string;
	message?: string;
	confirmLabel?: string;
	disabled?: boolean;
	className?: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				disabled={disabled}
				onClick={() => setOpen(true)}
				className={className ?? ui.btnDanger}>
				{label}
			</button>
			<ConfirmDialog
				open={open}
				title={title ?? `${label}?`}
				message={message}
				confirmLabel={confirmLabel ?? label}
				onCancel={() => setOpen(false)}
				onConfirm={() => {
					setOpen(false);
					onConfirm();
				}}
			/>
		</>
	);
}
