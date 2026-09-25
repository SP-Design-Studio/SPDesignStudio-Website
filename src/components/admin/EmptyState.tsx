export function EmptyState({
	title,
	body,
	action,
}: {
	title: string;
	body: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-cream/15 px-6 py-12 text-center">
			<span className="h-1.5 w-1.5 rounded-full bg-gold/60" />
			<h3 className="font-serif font-light text-cream text-xl">{title}</h3>
			<p className="max-w-sm font-sans font-light text-cream/80 text-tiny leading-relaxed">
				{body}
			</p>
			{action}
		</div>
	);
}
