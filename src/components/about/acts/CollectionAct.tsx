import Image from "next/image";
import { ABOUT } from "@/lib/studio";
import { Chars } from "@/components/shared/Chars";

interface CollectionActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	eyebrowRef: React.RefObject<HTMLDivElement | null>;
	titleCharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	bodyRef: React.RefObject<HTMLParagraphElement | null>;
	membersRef: React.RefObject<(HTMLDivElement | null)[]>;
	membersMobileRef: React.RefObject<(HTMLDivElement | null)[]>;
}

export function CollectionAct({
	wrapRef,
	eyebrowRef,
	titleCharsRef,
	bodyRef,
	membersRef,
	membersMobileRef,
}: CollectionActProps) {
	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div
				className="min-h-full flex flex-col justify-start md:justify-center items-center px-6 sm:px-8 md:px-10 sm:pt-24 pb-8 md:py-10"
				style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 5rem)" }}>
			<div className="max-w-275 w-full">
				<div className="md:grid md:grid-cols-12 md:gap-8 md:items-end mb-6 md:mb-7">
					<div className="md:col-span-7">
						<div
							ref={eyebrowRef}
							className="font-bdscript text-gold tracking-[0.01em] mb-3 md:mb-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
							{ABOUT.team.eyebrow}
						</div>

						<div
							className="font-serif font-light text-cream tracking-[-0.01em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05]"
							style={{ perspective: "1200px" }}>
							<Chars text={ABOUT.team.title} refStore={titleCharsRef} />
						</div>
					</div>

					<p
						ref={bodyRef}
						className="md:col-span-5 font-sans font-light text-cream/65 text-sm md:text-base leading-[1.65] md:leading-[1.7] mt-4 md:mt-0 max-w-140 md:border-l md:border-gold/35 md:pl-6">
						{ABOUT.team.body}
					</p>
				</div>

				{/* Desktop Grid */}
				<div className="hidden md:grid mx-auto max-w-200 lg:max-w-220 grid-cols-3 gap-x-5 gap-y-3">
					{ABOUT.team.members.map((m, i) => {
						const offsetClass =
							i % 2 === 1 ? "lg:translate-y-4 xl:translate-y-6" : "";

						return (
							<div
								key={m.name}
								ref={(el) => {
									membersRef.current[i] = el;
								}}
								className={`group flex flex-col cursor-default ${offsetClass}`}>
								<div className="relative w-full h-[clamp(130px,24vh,300px)] overflow-hidden mb-2.5 bg-plum/40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
									{m.img ? (
										<Image
											src={m.img}
											alt={m.name}
											fill
											className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
											sizes="25vw"
										/>
									) : (
										<div className="absolute inset-0 flex items-center justify-center">
											<span className="font-bdscript text-gold/35 group-hover:text-gold/55 transition-colors duration-700 text-5xl leading-none">
												{m.name
													.split(" ")
													.map((w) => w[0])
													.join("")}
											</span>
										</div>
									)}

									<span className="absolute top-2.5 left-2.5 font-sans font-light uppercase tracking-[0.28em] text-cream/75 text-[0.55rem]">
										0{i + 1}
									</span>

									<span className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/80 transition-colors duration-500" />
								</div>

								<div className="font-serif font-light text-cream tracking-[-0.01em] mb-0.5 text-base leading-tight transition-transform duration-500 group-hover:translate-x-1">
									{m.name}
								</div>

								<div className="font-sans font-light text-cream/50 group-hover:text-cream/75 transition-colors duration-500 text-[0.6rem] uppercase tracking-[0.18em]">
									{m.role}
								</div>
							</div>
						);
					})}
				</div>

				{/* Mobile Stack */}
				<div
					className="md:hidden relative mx-auto mt-2"
					style={{ maxWidth: 208, height: 432 }}>
					{ABOUT.team.members.map((m, i) => (
						<div
							key={m.name}
							ref={(el) => {
								membersMobileRef.current[i] = el;
							}}
							className="absolute left-0 right-0 will-change-transform"
							style={{
								top: `${i * 30}px`,
								zIndex: i + 1,
							}}>
							<div className="relative aspect-3/4 overflow-hidden bg-plum-dark border border-cream/10 shadow-2xl shadow-plum-dark/60">
								{m.img ? (
									<Image
										src={m.img}
										alt={m.name}
										fill
										className="object-cover"
										sizes="208px"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="font-bdscript text-gold/35 text-5xl leading-none">
											{m.name
												.split(" ")
												.map((w) => w[0])
												.join("")}
										</span>
									</div>
								)}

								<div className="absolute inset-0 bg-linear-to-t from-plum-dark/85 via-plum-dark/20 to-transparent" />

								<span className="absolute top-3 left-3.5 font-sans font-light uppercase tracking-[0.28em] text-cream/80 text-[0.55rem]">
									0{i + 1}
								</span>

								<div className="absolute bottom-3.5 left-3.5 right-3.5">
									<div className="font-serif font-light text-cream text-base tracking-[-0.01em] leading-tight mb-0.5">
										{m.name}
									</div>

									<div className="font-sans font-light text-cream/60 text-[0.58rem] uppercase tracking-[0.18em]">
										{m.role}
									</div>
								</div>

								<span className="absolute bottom-0 left-0 right-0 h-px bg-gold/40" />
							</div>
						</div>
					))}
				</div>
			</div>
			</div>
		</div>
	);
}

{
	/* <div
				ref={a4Wrap}
				className="absolute inset-0 z-10 flex flex-col justify-center items-center px-6 md:px-10 py-14 invisible overflow-y-auto">
				<div className="max-w-275 w-full">
					<div className="md:grid md:grid-cols-12 md:gap-8 md:items-end mb-7 md:mb-9">
						<div className="md:col-span-7">
							<div
								ref={a4Eyebrow}
								className="font-bdscript text-gold tracking-[0.01em] mb-3 md:mb-5 text-3xl md:text-4xl">
								{ABOUT.team.eyebrow}
							</div>
							<div
								className="font-bdscript text-cream tracking-[-0.005em] text-3xl md:text-5xl lg:text-6xl leading-[1.05]"
								style={{ perspective: "1200px" }}>
								<Chars text={ABOUT.team.title} refStore={a4TitleChars} />
							</div>
						</div>
						<p
							ref={a4Body}
							className="md:col-span-5 font-sans font-light text-cream/65 text-sm md:text-base leading-[1.65] md:leading-[1.7] mt-4 md:mt-0 max-w-140 md:border-l md:border-gold/35 md:pl-6">
							{ABOUT.team.body}
						</p>
					</div>

					<div className="hidden md:grid mx-auto max-w-220 grid-cols-3 gap-x-5 gap-y-4">
						{ABOUT.team.members.map((m, i) => {
							const offsetClass =
								i % 2 === 1 ? "translate-y-6 lg:translate-y-8" : "";
							return (
								<div
									key={m.name}
									ref={(el) => {
										a4Members.current[i] = el;
									}}
									className={`group flex flex-col cursor-default ${offsetClass}`}>
									<div className="relative aspect-3/4 overflow-hidden mb-3 bg-plum/40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
										{m.img ? (
											<Image
												src={m.img}
												alt={m.name}
												fill
												className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
												sizes="25vw"
											/>
										) : (
											<div className="absolute inset-0 flex items-center justify-center">
												<span className="font-bdscript text-gold/35 group-hover:text-gold/55 transition-colors duration-700 text-5xl leading-none">
													{m.name
														.split(" ")
														.map((w) => w[0])
														.join("")}
												</span>
											</div>
										)}
										<span className="absolute top-2.5 left-2.5 font-sans font-light uppercase tracking-[0.28em] text-cream/75 text-[0.55rem]">
											0{i + 1}
										</span>
										<span className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/80 transition-colors duration-500" />
									</div>
									<div className="font-serif font-light text-cream tracking-[-0.01em] mb-0.5 text-base leading-tight transition-transform duration-500 group-hover:translate-x-1">
										{m.name}
									</div>
									<div className="font-sans font-light text-cream/50 group-hover:text-cream/75 transition-colors duration-500 text-[0.6rem] uppercase tracking-[0.18em]">
										{m.role}
									</div>
								</div>
							);
						})}
					</div>

					<div
						className="md:hidden relative mx-auto"
						style={{ maxWidth: 280, height: 420 }}>
						{ABOUT.team.members.map((m, i) => (
							<div
								key={m.name}
								ref={(el) => {
									a4MembersMobile.current[i] = el;
								}}
								className="absolute left-0 right-0 will-change-transform"
								style={{ top: `${i * 36}px`, zIndex: i + 1 }}>
								<div className="relative aspect-3/4 overflow-hidden bg-plum-dark border border-cream/10 shadow-2xl shadow-plum-dark/60">
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="font-bdscript text-gold/40 text-5xl leading-none">
											{m.name
												.split(" ")
												.map((w) => w[0])
												.join("")}
										</span>
									</div>
									<span className="absolute top-3 left-3 font-sans font-light uppercase tracking-[0.28em] text-cream/75 text-[0.55rem]">
										0{i + 1}
									</span>
									<div className="absolute bottom-3 left-3 right-3">
										<div className="font-serif font-light text-cream text-base tracking-[-0.01em] leading-tight mb-0.5">
											{m.name}
										</div>
										<div className="font-sans font-light text-cream/55 text-[0.6rem] uppercase tracking-[0.18em]">
											{m.role}
										</div>
									</div>
									<span className="absolute bottom-0 left-0 right-0 h-px bg-gold/40" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div> */
}
