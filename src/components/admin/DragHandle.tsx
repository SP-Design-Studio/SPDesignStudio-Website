export function DragHandle({ label }: { label: string }) {
	return (
		<span
			aria-hidden
			title={`Drag to reorder ${label}`}
			className="cursor-grab select-none px-1 font-sans text-cream/80 text-sm leading-none transition-colors hover:text-gold active:cursor-grabbing">
			⠿
		</span>
	);
}
