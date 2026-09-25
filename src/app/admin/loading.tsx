export default function AdminLoading() {
	return (
		<div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
			<div className="admin-page flex flex-col gap-10">
				<div className="flex flex-col gap-3">
					<div className="h-2.5 w-24 rounded-full bg-cream/10 [animation:admin-pulse_1.4s_ease-in-out_infinite]" />
					<div className="h-9 w-72 max-w-full rounded-sm bg-cream/10 [animation:admin-pulse_1.4s_ease-in-out_infinite_0.1s]" />
					<div className="h-3.5 w-96 max-w-full rounded-full bg-cream/5 [animation:admin-pulse_1.4s_ease-in-out_infinite_0.2s]" />
				</div>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							style={{ animationDelay: `${i * 70}ms` }}
							className="flex flex-col gap-3 rounded-sm border border-cream/10 bg-plum/20 px-5 py-5 [animation:admin-pulse_1.6s_ease-in-out_infinite]">
							<div className="h-4 w-32 rounded-sm bg-cream/10" />
							<div className="h-3 w-40 rounded-full bg-cream/5" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
