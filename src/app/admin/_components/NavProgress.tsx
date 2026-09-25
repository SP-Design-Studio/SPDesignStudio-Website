"use client";

import { useEffect, useState } from "react";
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
	const [veil, setVeil] = useState(false);

	useEffect(() => {
		if (!label) {
			setVeil(false);
			return;
		}
		const t = setTimeout(() => setVeil(true), 140);
		return () => clearTimeout(t);
	}, [label]);

	if (!label) return null;

	return (
		<>
			<div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-gold/10 lg:left-64">
				<div className="h-full w-full origin-left bg-gold [animation:admin-bar_1.1s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
			</div>

			{veil && (
				<div
					role="status"
					aria-live="polite"
					className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center bg-plum-dark/55 backdrop-blur-[2px] [animation:auth-fade-in_0.2s_ease] lg:left-64">
					<div className="flex flex-col items-center gap-4">
						<span className="h-6 w-6 animate-spin rounded-full border-2 border-gold/25 border-t-gold" />
						<div className="flex flex-col items-center gap-1.5">
							<span className="font-sans font-light uppercase tracking-[0.3em] text-gold text-micro">
								Opening
							</span>
							<span className="font-serif font-light text-cream text-2xl [animation:admin-pulse_1.4s_ease-in-out_infinite]">
								{label}
							</span>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
