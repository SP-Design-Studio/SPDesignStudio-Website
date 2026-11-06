import Image from "next/image";

export const AUTH_FIELD =
	"w-full rounded-sm border-b border-cream/25 bg-transparent py-3 text-xl text-cream outline-none transition-colors placeholder:text-cream/30 hover:border-cream/50 focus:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export const AUTH_LABEL =
	"font-sans font-light uppercase tracking-[0.28em] text-gold text-tiny";

export const AUTH_BTN =
	"cta-gold group inline-flex w-fit cursor-pointer items-center gap-3 bg-gold px-9 py-4 font-sans font-light uppercase tracking-[0.28em] text-plum-dark text-sm disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export function AuthScreen({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const long = title.length > 10;
	return (
		<section className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-plum-dark text-cream">
			<div aria-hidden className="auth-glow" />
			<div aria-hidden className="auth-photo">
				<Image
					src="/images/auth-bg.jpg"
					alt=""
					fill
					priority
					quality={70}
					sizes="100vw"
				/>
			</div>
			<div aria-hidden className="auth-veil" />
			<div aria-hidden className="auth-grain" />

			<header className="absolute inset-x-0 top-0 z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 sm:px-10">
				<span className="flex items-baseline gap-3">
					<span className="font-alta text-gold text-3xl leading-none tracking-[0.04em]">
						SP
					</span>
					<span className="font-sans uppercase tracking-[0.4em] text-cream/80 text-micro">
						Studio CMS
					</span>
				</span>
			</header>

			<div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-40 sm:px-10 lg:pb-20">
				<div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-x-10">
					<div className="lg:col-span-7">
						<h1
							className={`font-bdscript leading-[1.05] text-cream ${
								long
									? "text-[clamp(2.75rem,7vw,6.5rem)]"
									: "text-[clamp(3.5rem,10vw,9rem)]"
							}`}>
							<span className="-mb-[0.2em] -mt-[0.1em] block overflow-hidden px-[0.05em] pb-[0.2em] pt-[0.1em]">
								<span className="auth-line">{title}</span>
							</span>
						</h1>
						<span className="auth-rule mt-7 block h-px w-24 bg-gold/60" />
					</div>
					<div className="lg:col-span-5">{children}</div>
				</div>
			</div>
		</section>
	);
}
