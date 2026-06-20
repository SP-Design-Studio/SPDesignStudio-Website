"use client";

export default function AuthOverlay({
	show,
	label,
}: {
	show: boolean;
	label: string;
}) {
	if (!show) return null;
	return (
		<div
			className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-plum-dark [animation:auth-fade-in_0.35s_ease]"
			role="status"
			aria-live="polite"
		>
			<div className="flex flex-col items-center gap-7 [animation:auth-rise_0.5s_ease]">
				<div className="flex flex-col items-center gap-2">
					<span className="font-alta text-gold text-5xl tracking-[0.04em] leading-none">
						SP
					</span>
					<span className="font-sans uppercase tracking-[0.4em] text-cream/80 text-[0.62rem]">
						Studio CMS
					</span>
				</div>

				<div className="relative h-px w-44 overflow-hidden bg-cream/10">
					<div className="absolute inset-y-0 w-1/3 bg-gold [animation:auth-sweep_1.1s_ease-in-out_infinite]" />
				</div>

				<span className="font-sans uppercase tracking-[0.32em] text-gold text-[0.66rem]">
					{label}…
				</span>
			</div>
		</div>
	);
}
