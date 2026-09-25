export const ui = {
	input:
		"w-full rounded-sm border-b border-cream/20 bg-transparent px-0 py-2 text-cream text-sm outline-none transition-colors placeholder:text-cream/25 focus:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
	textarea:
		"w-full resize-none rounded-sm border-b border-cream/20 bg-transparent px-0 py-2 text-cream text-sm outline-none transition-colors placeholder:text-cream/25 focus:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
	select:
		"w-full rounded-sm border-b border-cream/20 bg-transparent px-0 py-2 text-cream text-sm outline-none transition-colors focus:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",

	label:
		"mb-1.5 font-sans font-light uppercase tracking-[0.26em] text-gold text-micro",
	sectionTitle:
		"mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-tiny",
	help: "font-sans font-light text-cream/60 text-tiny",
	muted: "font-sans font-light text-cream/80 text-tiny",

	card: "rounded-sm border border-cream/10 bg-plum/20 p-4 transition-colors hover:border-cream/20",
	cardGrid: "grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]",

	btnPrimary:
		"cta-gold cursor-pointer rounded-sm bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-tiny transition-opacity disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
	btnGhost:
		"cursor-pointer rounded-sm border border-cream/25 px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-cream/85 text-tiny transition-colors hover:border-gold hover:text-gold disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
	btnQuiet:
		"cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/70 text-tiny transition-colors hover:text-gold disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
	btnDanger:
		"cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/70 text-tiny transition-colors hover:text-red-300 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
	btnAdd:
		"mt-5 w-fit cursor-pointer rounded-sm border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny transition-colors hover:bg-gold/10 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
	btnStep:
		"cursor-pointer rounded-sm border border-cream/20 px-2 py-1 text-cream/82 text-tiny transition-colors hover:border-gold hover:text-gold disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
} as const;
