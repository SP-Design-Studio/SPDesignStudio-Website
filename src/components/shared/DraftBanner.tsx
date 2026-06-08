export function DraftBanner({
	label,
	exitHref,
}: {
	label: string;
	exitHref: string;
}) {
	return (
		<div className="fixed inset-x-0 top-0 z-9999 flex items-center justify-center gap-4 bg-gold px-4 py-2 text-plum-dark">
			<span className="font-sans font-light uppercase tracking-[0.22em] text-[0.6rem]">
				Draft preview — {label} (not live)
			</span>
			<a
				href={exitHref}
				className="font-sans font-light uppercase tracking-[0.22em] text-[0.6rem] underline underline-offset-2 transition-opacity hover:opacity-70">
				Exit
			</a>
		</div>
	);
}
