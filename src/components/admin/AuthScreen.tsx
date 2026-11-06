export function AuthScreen({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-dvh items-center justify-center px-6 py-10">
			<div className="w-full max-w-md">
				<div className="mb-2 font-sans font-light uppercase tracking-[0.4em] text-gold text-tiny">
					SP Design Studio
				</div>
				<h1 className="mb-8 font-serif font-light text-cream text-4xl md:text-5xl">
					{title}
				</h1>
				{children}
			</div>
		</div>
	);
}
