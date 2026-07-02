"use client";

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectsHeroAct } from "./acts/ProjectsHeroAct";
import { ProjectsGridAct } from "./acts/ProjectsGridAct";
import { CategoryPills } from "./CategoryPills";
import { ProjectDetail } from "./ProjectDetail";
import { getLenis } from "@/lib/smoothScroll";
import { enableSectionSnapAnchors } from "@/lib/sectionSnap";
import {
	DEFAULT_CATEGORIES,
	type Project,
	type ProjectCategory,
	type ProjectCategoryOption,
} from "@/lib/data/projects";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN_WORD_3D = {
	rotateX: -88,
	y: 70,
	opacity: 0,
	filter: "blur(6px)",
	transformPerspective: 1200,
};

const CLIP_HIDDEN = "inset(100% 0% 0% 0% round 0.125rem)";
const CLIP_SHOWN = "inset(0% 0% 0% 0% round 0.125rem)";
const CLIP_EXIT = "inset(0% 0% 100% 0% round 0.125rem)";

export default function ProjectsPinnedScroll({
	started,
	projects,
	categories,
}: {
	started: boolean;
	projects: Project[];
	categories: ProjectCategoryOption[];
}) {
	const cats = categories?.length ? categories : DEFAULT_CATEGORIES;
	const wrapperRef = useRef<HTMLDivElement>(null);

	const heroRef = useRef<HTMLDivElement>(null);
	const eyebrowRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const title1Ref = useRef<(HTMLSpanElement | null)[]>([]);
	const title2Ref = useRef<(HTMLSpanElement | null)[]>([]);
	const title3Ref = useRef<(HTMLSpanElement | null)[]>([]);
	const pillWrapRef = useRef<HTMLDivElement>(null);
	const countRef = useRef<HTMLDivElement>(null);
	const stripRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const pillSlotRef = useRef<HTMLDivElement>(null);

	const [active, setActive] = useState<ProjectCategory | null>(null);
	const [detail, setDetail] = useState<string | null>(null);
	const busy = useRef(false);
	const introDone = useRef(false);
	const revealed = useRef(false);

	const indexed = projects.map((p, i) => ({ ...p, _i: i }));
	const filtered = active
		? indexed.filter((p) => p.category === active)
		: indexed;

	const detailIndex = detail
		? filtered.findIndex((p) => p.id === detail)
		: -1;
	const detailProject = detailIndex >= 0 ? filtered[detailIndex] : null;

	const openDetail = useCallback((id: string) => {
		setDetail(id);
	}, []);

	const navDetail = useCallback(
		(dir: 1 | -1) => {
			setDetail((d) => {
				if (!d) return d;
				const list = active
					? indexed.filter((p) => p.category === active)
					: indexed;
				const i = list.findIndex((p) => p.id === d);
				if (i < 0) return d;
				return list[(i + dir + list.length) % list.length].id;
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[active],
	);

	const allTitleWords = useCallback(
		() =>
			[
				...(title1Ref.current ?? []),
				...(title2Ref.current ?? []),
				...(title3Ref.current ?? []),
			].filter(Boolean) as HTMLSpanElement[],
		[],
	);

	const animateCardsIn = useCallback(() => {
		const strip = stripRef.current;
		if (!strip) return;
		const cards = gsap.utils.toArray<HTMLElement>(strip.querySelectorAll(".pc"));
		if (!cards.length) return;
		const tl = gsap.timeline();
		cards.forEach((card, i) => {
			const media = card.querySelector(".pc-media");
			const inner = card.querySelector(".pc-media-inner");
			const copy = card.querySelectorAll(".pc-copy");
			const t = i * 0.085;
			tl.fromTo(
				media,
				{ clipPath: CLIP_HIDDEN },
				{ clipPath: CLIP_SHOWN, duration: 1.05, ease: "expo.out" },
				t,
			)
				.fromTo(
					inner,
					{ scale: 1.28 },
					{ scale: 1, duration: 1.2, ease: "expo.out" },
					t,
				)
				.fromTo(
					copy,
					{ y: 18, autoAlpha: 0 },
					{ y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" },
					t + 0.18,
				);
		});
	}, []);

	const animateCardsOut = useCallback((onDone: () => void) => {
		const strip = stripRef.current;
		const cards = strip
			? gsap.utils.toArray<HTMLElement>(strip.querySelectorAll(".pc"))
			: [];
		if (!cards.length) {
			onDone();
			return;
		}
		const n = cards.length;
		const tl = gsap.timeline({ onComplete: onDone });
		cards.forEach((card, i) => {
			const media = card.querySelector(".pc-media");
			const inner = card.querySelector(".pc-media-inner");
			const copy = card.querySelectorAll(".pc-copy");
			const t = (n - 1 - i) * 0.045;
			tl.to(media, { clipPath: CLIP_EXIT, duration: 0.5, ease: "power3.in" }, t)
				.to(inner, { scale: 1.12, duration: 0.5, ease: "power3.in" }, t)
				.to(
					copy,
					{ y: -14, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
					t,
				);
		});
	}, []);

	const preHideCards = useCallback(() => {
		const strip = stripRef.current;
		if (!strip) return;
		gsap.utils
			.toArray<HTMLElement>(strip.querySelectorAll(".pc"))
			.forEach((card) => {
				gsap.set(card.querySelector(".pc-media"), { clipPath: CLIP_HIDDEN });
				gsap.set(card.querySelector(".pc-media-inner"), { scale: 1.28 });
				gsap.set(card.querySelectorAll(".pc-copy"), { y: 18, autoAlpha: 0 });
			});
	}, []);

	const revealGrid = useCallback(() => {
		if (!stripRef.current?.querySelector(".pc")) return;
		revealed.current = true;
		animateCardsIn();
		if (countRef.current) {
			gsap.fromTo(
				countRef.current,
				{ opacity: 0, y: 6 },
				{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.15 },
			);
		}
	}, [animateCardsIn]);

	const scrollToGrid = useCallback((onComplete?: () => void) => {
		const target = gridRef.current;
		if (!target) {
			onComplete?.();
			return;
		}
		const lenis = getLenis();
		if (lenis) {
			lenis.scrollTo(target, {
				duration: 1.2,
				lock: true,
				easing: (x: number) => 1 - Math.pow(1 - x, 3),
				onComplete,
			});
		} else {
			target.scrollIntoView({ behavior: "smooth" });
			window.setTimeout(() => onComplete?.(), 800);
		}
	}, []);

	const gridInView = useCallback(() => {
		const r = gridRef.current?.getBoundingClientRect();
		return r ? r.top < window.innerHeight * 0.5 : false;
	}, []);

	const handleCategoryClick = useCallback(
		(cat: ProjectCategory) => {
			if (busy.current) return;
			const changing = cat !== active;
			busy.current = true;

			if (changing && revealed.current && gridInView()) {
				animateCardsOut(() => {
					setActive(cat);
					requestAnimationFrame(() => {
						revealGrid();
						busy.current = false;
					});
				});
				return;
			}

			if (changing) {
				revealed.current = false;
				setActive(cat);
			}

			requestAnimationFrame(() => {
				if (gridInView()) {
					if (!revealed.current) revealGrid();
					busy.current = false;
				} else {
					scrollToGrid(() => {
						if (!revealed.current) revealGrid();
						busy.current = false;
					});
				}
			});
		},
		[active, animateCardsOut, revealGrid, scrollToGrid, gridInView],
	);

	useLayoutEffect(() => {
		if (!introDone.current) return;
		preHideCards();
	}, [active, preHideCards]);

	useEffect(() => {
		if (!started) return;

		const cleanupSnap = enableSectionSnapAnchors(() => {
			const grid = gridRef.current;
			const cur =
				window.scrollY || document.documentElement.scrollTop || 0;
			const gridTop = grid
				? Math.round(grid.getBoundingClientRect().top + cur)
				: window.innerHeight;
			return [0, gridTop];
		});
		requestAnimationFrame(() => window.dispatchEvent(new Event("scroll")));

		let removeResize = () => {};

		const ctx = gsap.context(() => {
			const words = allTitleWords();
			const eyebrow = eyebrowRef.current;
			const pill = pillWrapRef.current;

			gsap.set(words, HIDDEN_WORD_3D);
			gsap.set(eyebrow, { y: 16, autoAlpha: 0 });
			preHideCards();

			const isMobile = window.innerWidth < 768;
			const gap = isMobile ? 40 : 56;
			const computeHeroY = () => {
				const t = titleRef.current;
				if (!t) return window.innerHeight * 0.66;
				const rect = t.getBoundingClientRect();
				return rect.bottom + window.scrollY + gap;
			};
			let heroY = computeHeroY();
			gsap.set(pill, { xPercent: -50, y: heroY, autoAlpha: 0 });

			const revealWords = () => {
				words.forEach((el) => {
					el.style.visibility = "visible";
				});
			};

			const slotDocTop = () => {
				const s = pillSlotRef.current;
				const cur = window.scrollY || 0;
				return s
					? s.getBoundingClientRect().top + cur
					: window.innerHeight + 100;
			};

			const playIn = () => {
				revealWords();
				heroY = computeHeroY();
				let heroH = heroRef.current?.offsetHeight || window.innerHeight;
				let dst = slotDocTop();
				gsap.set(pill, { y: heroY });

				ScrollTrigger.create({
					trigger: wrapperRef.current,
					start: "top top",
					end: "bottom top",
					scrub: true,
					onUpdate: (self) => {
						const s = self.scroll();
						const y =
							s <= heroH
								? gsap.utils.interpolate(heroY, dst - heroH, s / heroH)
								: dst - s;
						gsap.set(pill, { y });
					},
				});

				ScrollTrigger.create({
					trigger: gridRef.current,
					start: "top 78%",
					onEnter: () => {
						if (
							!revealed.current &&
							!busy.current &&
							stripRef.current?.querySelector(".pc")
						) {
							revealGrid();
						}
					},
				});

				ScrollTrigger.create({
					trigger: gridRef.current,
					start: "top bottom",
					onLeaveBack: () => {
						setActive(null);
						revealed.current = false;
					},
				});

				const onResize = () => {
					heroY = computeHeroY();
					heroH = heroRef.current?.offsetHeight || window.innerHeight;
					dst = slotDocTop();
					ScrollTrigger.refresh();
				};
				window.addEventListener("resize", onResize);
				removeResize = () => window.removeEventListener("resize", onResize);

				const tl = gsap.timeline({ delay: 0.85 });
				tl.addLabel("eyebrow", 0)
					.to(eyebrow, {
						y: 0,
						autoAlpha: 1,
						duration: 0.8,
						ease: "power3.out",
					})
					.addLabel("title", 0.25)
					.to(
						words,
						{
							rotateX: 0,
							y: 0,
							opacity: 1,
							filter: "blur(0px)",
							duration: 1.1,
							ease: "power4.out",
							stagger: 0.028,
							onComplete: () => {
								words.forEach((el) => {
									el.style.willChange = "auto";
								});
							},
						},
						"title",
					)
					.addLabel("pills", "title+=0.55")
					.to(
						pill,
						{ autoAlpha: 1, duration: 0.85, ease: "power3.out" },
						"pills",
					)
					.add(() => {
						introDone.current = true;
					}, "pills+=0.2");
			};

			if (typeof document !== "undefined" && document.fonts?.load) {
				Promise.all([
					document.fonts.load('italic 1em "bdScript"'),
					document.fonts.ready,
				])
					.then(playIn)
					.catch(playIn);
			} else {
				playIn();
			}
		}, wrapperRef);

		return () => {
			removeResize();
			cleanupSnap();
			introDone.current = false;
			revealed.current = false;
			ctx.revert();
		};
	}, [started, allTitleWords, revealGrid, preHideCards]);

	return (
		<section ref={wrapperRef} className="relative overflow-hidden">
			<div ref={heroRef}>
				<ProjectsHeroAct
					eyebrowRef={eyebrowRef}
					titleRef={titleRef}
					title1Ref={title1Ref}
					title2Ref={title2Ref}
					title3Ref={title3Ref}
				/>
			</div>

			<div ref={gridRef}>
				<ProjectsGridAct
					countRef={countRef}
					stripRef={stripRef}
					slotRef={pillSlotRef}
					projects={filtered}
					onOpen={openDetail}
				/>
			</div>

			<div
				ref={pillWrapRef}
				className="fixed top-0 left-1/2 z-50 will-change-transform"
				style={{ opacity: 0 }}>
				<CategoryPills
					categories={cats}
					active={active}
					onSelect={handleCategoryClick}
				/>
			</div>

			{detailProject && (
				<ProjectDetail
					project={detailProject}
					index={detailIndex}
					total={filtered.length}
					onClose={() => setDetail(null)}
					onPrev={() => navDetail(-1)}
					onNext={() => navDetail(1)}
				/>
			)}
		</section>
	);
}
