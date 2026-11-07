"use client";

import { useEffect } from "react";
import { useLinkStatus } from "next/link";

export function NavWatch({
	label,
	onReport,
}: {
	label: string;
	onReport: (label: string, pending: boolean) => void;
}) {
	const { pending } = useLinkStatus();
	useEffect(() => {
		onReport(label, pending);
	}, [pending, label, onReport]);
	return null;
}

export function NavProgress({ label }: { label: string | null }) {
	if (!label) return null;
	return (
		<div
			role="status"
			aria-label={`Opening ${label}`}
			className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-gold/10 lg:left-64">
			<div className="h-full w-full origin-left bg-gold [animation:admin-bar_1.1s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
		</div>
	);
}
