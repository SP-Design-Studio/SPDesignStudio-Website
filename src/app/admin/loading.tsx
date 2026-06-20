export default function AdminLoading() {
	return (
		<div className="flex min-h-[70vh] items-center justify-center [animation:auth-fade-in_0.25s_ease]">
			<div className="flex flex-col items-center gap-4">
				<span className="h-6 w-6 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
				<span className="font-sans uppercase tracking-[0.3em] text-gold text-[0.62rem]">
					Loading…
				</span>
			</div>
		</div>
	);
}
