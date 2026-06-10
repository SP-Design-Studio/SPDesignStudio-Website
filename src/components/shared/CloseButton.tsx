interface CloseButtonProps {
	onClick: () => void;
	className?: string;
}

export function CloseButton({ onClick, className = "" }: CloseButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Close"
			className={`group inline-flex cursor-pointer items-center gap-3 ${className}`}>
			<span className="font-sans font-normal uppercase tracking-[0.28em] text-cream/78 text-[0.672rem] md:text-sm transition-colors duration-300 group-hover:text-gold">
				Close
			</span>
			<span className="x-close flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 group-hover:border-gold group-hover:text-gold">
				<span className="text-xl leading-none">&times;</span>
			</span>
		</button>
	);
}
