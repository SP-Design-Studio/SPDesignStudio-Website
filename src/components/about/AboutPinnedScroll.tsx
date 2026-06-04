"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutHeroAct } from "./acts/AboutHeroAct";
import { VisionaryAct } from "./acts/VisionaryAct";
import { CollectionAct } from "./acts/CollectionAct";
import { TimelineAct } from "./acts/TimelineAct";
import { AchievementsAct } from "./acts/AchievementsAct";
import { ConnectAct } from "./acts/ConnectAct";
import { enableSectionSnap } from "@/lib/sectionSnap";
import { getLenis } from "@/lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

interface Props {
	started: boolean;
}

export default function AboutPinnedScroll({ started }: Props) {
	const wrapperRef = useRef<HTMLDivElement>(null);

	const bg2 = useRef<HTMLDivElement>(null);
	const bg3 = useRef<HTMLDivElement>(null);
	const bg4 = useRef<HTMLDivElement>(null);
	const bg5 = useRef<HTMLDivElement>(null);
	const bg6 = useRef<HTMLDivElement>(null);

	const a1Wrap = useRef<HTMLDivElement>(null);
	const a1BgImg = useRef<HTMLDivElement>(null);
	const a1Eyebrow = useRef<HTMLDivElement>(null);
	const a1Line1Chars = useRef<(HTMLSpanElement | null)[]>([]);
	const a1Line2Chars = useRef<(HTMLSpanElement | null)[]>([]);
	const a1Quote = useRef<HTMLParagraphElement>(null);
	const a1Hint = useRef<HTMLDivElement>(null);

	const a3Wrap = useRef<HTMLDivElement>(null);
	const a3Eyebrow = useRef<HTMLDivElement>(null);
	const a3Title = useRef<HTMLDivElement>(null);
	const a3Subtitle = useRef<HTMLDivElement>(null);
	const a3Body1 = useRef<HTMLParagraphElement>(null);
	const a3Body2 = useRef<HTMLParagraphElement>(null);
	const a3Quote = useRef<HTMLDivElement>(null);
	const a3Attrib = useRef<HTMLDivElement>(null);
	const a3Image = useRef<HTMLDivElement>(null);

	const a4Wrap = useRef<HTMLDivElement>(null);
	const a4Eyebrow = useRef<HTMLDivElement>(null);
	const a4TitleChars = useRef<(HTMLSpanElement | null)[]>([]);
	const a4Body = useRef<HTMLParagraphElement>(null);
	const a4Members = useRef<(HTMLDivElement | null)[]>([]);
	const a4MembersMobile = useRef<(HTMLDivElement | null)[]>([]);
	const a4MembersMobileWrap = useRef<HTMLDivElement>(null);

	const a5Wrap = useRef<HTMLDivElement>(null);
	const a5Eyebrow = useRef<HTMLDivElement>(null);
	const a5TitleChars = useRef<(HTMLSpanElement | null)[]>([]);
	const a5LineDesktop = useRef<SVGPathElement>(null);
	const a5Dots = useRef<(HTMLSpanElement | null)[]>([]);
	const a5Years = useRef<(HTMLSpanElement | null)[]>([]);
	const a5Entries = useRef<(HTMLDivElement | null)[]>([]);
	const a5EntriesMobile = useRef<(HTMLDivElement | null)[]>([]);
	const a5EntriesMobileWrap = useRef<HTMLDivElement>(null);

	const aAchWrap = useRef<HTMLDivElement>(null);

	const a6Wrap = useRef<HTMLDivElement>(null);
	const a6Line1Chars = useRef<(HTMLSpanElement | null)[]>([]);
	const a6Line2Chars = useRef<(HTMLSpanElement | null)[]>([]);
	const a6Body = useRef<HTMLParagraphElement>(null);
	const a6Cta = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		if (!started) return;

		let cleanupSnap: () => void = () => {};
		let jumpRaf = 0;
		const ctx = gsap.context(() => {
			const VH = window.innerHeight;

			gsap.set(bg2.current, { clipPath: "inset(0 100% 0 0)" });
			gsap.set(bg3.current, { clipPath: "inset(0 0 0 100%)" });
			gsap.set(bg4.current, { clipPath: "inset(100% 0 0 0)" });
			gsap.set(bg5.current, { clipPath: "inset(0 100% 0 0)" });
			gsap.set(bg6.current, { clipPath: "inset(0 0 100% 0)" });

			const HIDDEN_CHAR_3D = {
				rotateX: -88,
				y: 70,
				opacity: 0,
				filter: "blur(6px)",
				transformPerspective: 1200,
			};
			const HIDDEN_CHAR_SKEW = (skew: number) => ({
				skewX: skew,
				y: 80,
				opacity: 0,
				filter: "blur(4px)",
				transformPerspective: 1200,
			});

			gsap.set(a1BgImg.current, { scale: 1.15, autoAlpha: 0 });
			gsap.set(a1Line1Chars.current, HIDDEN_CHAR_3D);
			gsap.set(a1Line2Chars.current, HIDDEN_CHAR_3D);
			gsap.set(a1Eyebrow.current, { y: 16, autoAlpha: 0 });
			gsap.set(a1Quote.current, { y: 22, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a1Hint.current, { autoAlpha: 0 });

			gsap.set(
				[
					a3Wrap.current,
					a4Wrap.current,
					a5Wrap.current,
					aAchWrap.current,
					a6Wrap.current,
				],
				{ autoAlpha: 0 },
			);

			const achEls = aAchWrap.current
				? gsap.utils.toArray<HTMLElement>(
						aAchWrap.current.querySelectorAll(".ach-reveal"),
					)
				: [];
			gsap.set(achEls, { y: 28, autoAlpha: 0, filter: "blur(5px)" });

			const achRows = aAchWrap.current
				? gsap.utils.toArray<HTMLElement>(
						aAchWrap.current.querySelectorAll(".ach-row"),
					)
				: [];
			gsap.set(achRows, {
				x: -40,
				autoAlpha: 0,
				filter: "blur(4px)",
				transformOrigin: "0% 50%",
			});

			gsap.set(a3Eyebrow.current, { y: 16, autoAlpha: 0 });
			gsap.set(a3Title.current, { y: 32, autoAlpha: 0, filter: "blur(6px)" });
			gsap.set(a3Subtitle.current, { y: 18, autoAlpha: 0 });
			gsap.set(a3Body1.current, { y: 22, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a3Body2.current, { y: 22, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a3Quote.current, { y: 24, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a3Attrib.current, { y: 16, autoAlpha: 0 });
			gsap.set(a3Image.current, {
				clipPath: "inset(100% 0 0 0)",
				scale: 1.15,
				autoAlpha: 0,
			});

			gsap.set(a4Eyebrow.current, { y: 14, autoAlpha: 0 });
			gsap.set(a4TitleChars.current, HIDDEN_CHAR_SKEW(-14));
			gsap.set(a4Body.current, { y: 22, autoAlpha: 0, filter: "blur(4px)" });

			const isMobile =
				typeof window !== "undefined" &&
				window.matchMedia("(max-width: 767px)").matches;
			const teamTargets = isMobile
				? [a4MembersMobileWrap.current].filter(Boolean)
				: a4Members.current.filter(Boolean);

			gsap.set(
				teamTargets,
				isMobile
					? {
							y: 40,
							autoAlpha: 0,
						}
					: {
							y: 120,
							scale: 0.92,
							autoAlpha: 0,
							rotateX: -30,
							transformPerspective: 1100,
							transformOrigin: "50% 100%",
						},
			);

			gsap.set(a5Eyebrow.current, { y: 14, autoAlpha: 0 });
			gsap.set(a5TitleChars.current, HIDDEN_CHAR_SKEW(12));
			const a5PathD = a5LineDesktop.current;
			const a5LenD = a5PathD ? a5PathD.getTotalLength() : 0;
			if (a5PathD) gsap.set(a5PathD, { strokeDasharray: a5LenD, strokeDashoffset: a5LenD });
			gsap.set(a5Dots.current.filter(Boolean), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" });
			gsap.set(a5Years.current.filter(Boolean), { y: 10, autoAlpha: 0 });
			const a5Targets = isMobile
				? [a5EntriesMobileWrap.current].filter(Boolean)
				: a5Entries.current.filter(Boolean);
			gsap.set(
				a5Targets,
				isMobile
					? {
							y: 40,
							autoAlpha: 0,
						}
					: {
							rotateY: -78,
							y: 30,
							autoAlpha: 0,
							filter: "blur(6px)",
							transformPerspective: 1000,
							transformOrigin: "50% 50%",
						},
			);

			gsap.set(a6Line1Chars.current, HIDDEN_CHAR_3D);
			gsap.set(a6Line2Chars.current, HIDDEN_CHAR_3D);
			gsap.set(a6Body.current, { y: 22, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a6Cta.current, { y: 16, autoAlpha: 0 });

			const heroExit = gsap.timeline({ paused: true });
			heroExit
				.to(
					a1Eyebrow.current,
					{
						y: -30,
						autoAlpha: 0,
						filter: "blur(4px)",
						duration: 0.4,
						ease: "power2.in",
					},
					0,
				)
				.to(
					a1Quote.current,
					{
						y: -28,
						autoAlpha: 0,
						filter: "blur(4px)",
						duration: 0.4,
						ease: "power2.in",
					},
					0,
				)
				.to(
					a1BgImg.current,
					{ scale: 1.08, autoAlpha: 0, duration: 0.55, ease: "power2.in" },
					0,
				)
				.to(
					a1Hint.current,
					{ autoAlpha: 0, duration: 0.3, ease: "power2.in" },
					0,
				)
				.to(
					a1Line2Chars.current,
					{
						rotateX: 65,
						y: -65,
						opacity: 0,
						filter: "blur(5px)",
						duration: 0.55,
						ease: "power3.in",
						stagger: { each: 0.024, from: "end" },
					},
					0.04,
				)
				.to(
					a1Line1Chars.current,
					{
						rotateX: 65,
						y: -65,
						opacity: 0,
						filter: "blur(5px)",
						duration: 0.55,
						ease: "power3.in",
						stagger: { each: 0.024, from: "end" },
					},
					0.1,
				);

			const heroIn = gsap.timeline({
				delay: 1.1,
				paused: true,
				onComplete: () => {
					[
						...(a1Line1Chars.current ?? []),
						...(a1Line2Chars.current ?? []),
					].forEach((el) => {
						if (el) el.style.willChange = "auto";
					});
				},
			});
			heroIn
				.to(
					a1BgImg.current,
					{ scale: 1, autoAlpha: 1, duration: 1.6, ease: "expo.out" },
					0,
				)
				.to(
					a1Eyebrow.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.8,
						ease: "power3.out",
					},
					0.2,
				)
				.to(
					a1Line1Chars.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.05,
						ease: "power4.out",
						stagger: 0.024,
					},
					"-=0.55",
				)
				.to(
					a1Line2Chars.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.05,
						ease: "power4.out",
						stagger: 0.024,
					},
					"-=0.82",
				)
				.to(
					a1Quote.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.75,
						ease: "power3.out",
					},
					"-=0.55",
				)
				.to(a1Hint.current, { autoAlpha: 1, duration: 0.45 }, "-=0.22");

			const revealChars = () => {
				[
					...(a1Line1Chars.current ?? []),
					...(a1Line2Chars.current ?? []),
				].forEach((el) => {
					if (el) el.style.visibility = "visible";
				});
			};

			const playReveal = () => {
				revealChars();
				heroIn.play();
			};
			if (typeof document !== "undefined" && document.fonts?.load) {
				Promise.all([
					document.fonts.load('italic 1em "bdScript"'),
					document.fonts.ready,
				])
					.then(playReveal)
					.catch(playReveal);
			} else {
				playReveal();
			}

			let heroExitFired = false;
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: wrapperRef.current,
					start: "top top",
					end: `+=${VH * 16}`,
					pin: true,
					scrub: 1.8,
					anticipatePin: 1,
					onUpdate: (self) => {
						if (!heroExitFired && self.progress > 0.035) {
							heroExitFired = true;
							heroExit.play();
						} else if (heroExitFired && self.progress < 0.015) {
							heroExitFired = false;
							heroExit.reverse();
						}
					},
				},
			});

			tl.to(
				bg2.current,
				{ clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power4.inOut" },
				0.5,
			)
				.to(a1Wrap.current, { autoAlpha: 0, duration: 0.01 }, 1.0)

				.to(a3Wrap.current, { autoAlpha: 1, duration: 0.01 }, 1.0)
				.to(
					a3Eyebrow.current,
					{ y: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out" },
					1.04,
				)
				.to(
					a3Image.current,
					{
						clipPath: "inset(0% 0 0 0)",
						scale: 1,
						autoAlpha: 1,
						duration: 1.2,
						ease: "expo.out",
					},
					1.08,
				)
				.to(
					a3Title.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.85,
						ease: "expo.out",
					},
					1.16,
				)
				.to(
					a3Subtitle.current,
					{ y: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out" },
					1.42,
				)
				.to(
					a3Body1.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.6,
						ease: "power3.out",
					},
					1.58,
				)
				.to(
					a3Body2.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.6,
						ease: "power3.out",
					},
					1.74,
				)
				.to(
					a3Quote.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.7,
						ease: "power3.out",
					},
					1.92,
				)
				.to(
					a3Attrib.current,
					{ y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
					2.18,
				)

				.to(
					[
						a3Title.current,
						a3Subtitle.current,
						a3Body1.current,
						a3Body2.current,
						a3Quote.current,
						a3Attrib.current,
						a3Eyebrow.current,
					],
					{
						autoAlpha: 0,
						y: -24,
						filter: "blur(4px)",
						duration: 0.36,
						stagger: 0.035,
						ease: "power2.in",
					},
					3.4,
				)
				.to(
					a3Image.current,
					{
						clipPath: "inset(0 0 100% 0)",
						scale: 1.05,
						autoAlpha: 0,
						duration: 0.55,
						ease: "power3.in",
					},
					3.4,
				)

				.to(
					bg4.current,
					{ clipPath: "inset(0% 0 0 0)", duration: 0.65, ease: "power4.inOut" },
					3.5,
				)
				.to(a3Wrap.current, { autoAlpha: 0, duration: 0.01 }, 3.92)

				.to(a4Wrap.current, { autoAlpha: 1, duration: 0.01 }, 3.82)
				.to(
					a4Eyebrow.current,
					{ y: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out" },
					3.86,
				)
				.to(
					a4TitleChars.current,
					{
						skewX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 0.9,
						ease: "power4.out",
						stagger: 0.028,
					},
					3.92,
				)
				.to(
					a4Body.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.6,
						ease: "power3.out",
					},
					4.12,
				)
				.to(
					teamTargets,
					{
						y: 0,
						scale: 1,
						autoAlpha: 1,
						rotateX: 0,
						duration: isMobile ? 0.85 : 0.7,
						ease: "expo.out",
						stagger: isMobile ? 0.42 : 0.38,
					},
					4.28,
				)

				.to(
					teamTargets,
					{
						y: isMobile ? -56 : -60,
						scale: 0.94,
						autoAlpha: 0,
						rotateX: isMobile ? -15 : 25,
						stagger: isMobile ? 0.06 : 0.05,
						duration: 0.5,
						ease: "power3.in",
					},
					6.55,
				)
				.to(
					a4Body.current,
					{
						y: -22,
						autoAlpha: 0,
						filter: "blur(4px)",
						duration: 0.32,
						ease: "power2.in",
					},
					6.55,
				)
				.to(
					a4TitleChars.current,
					{
						skewX: 14,
						y: -70,
						opacity: 0,
						filter: "blur(4px)",
						duration: 0.42,
						ease: "power3.in",
						stagger: { each: 0.022, from: "end" },
					},
					6.55,
				)
				.to(
					a4Eyebrow.current,
					{ autoAlpha: 0, y: -14, duration: 0.3, ease: "power2.in" },
					6.58,
				)

				.to(
					bg5.current,
					{ clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: "power4.inOut" },
					6.65,
				)
				.to(a4Wrap.current, { autoAlpha: 0, duration: 0.01 }, 7.05)

				.to(a5Wrap.current, { autoAlpha: 1, duration: 0.01 }, 6.96)
				.to(
					a5Eyebrow.current,
					{ y: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out" },
					7.0,
				)
				.to(
					a5TitleChars.current,
					{
						skewX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 0.9,
						ease: "power4.out",
						stagger: 0.028,
					},
					7.06,
				)
				.to(
					a5LineDesktop.current,
					{ strokeDashoffset: 0, duration: 2.0, ease: "power1.inOut" },
					7.3,
				)
				.to(
					a5Dots.current.filter(Boolean),
					{
						scale: 1,
						autoAlpha: 1,
						duration: 0.4,
						ease: "back.out(2.4)",
						stagger: 0.34,
					},
					7.6,
				)
				.to(
						a5Years.current.filter(Boolean),
						{ y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", stagger: 0.34 },
						7.7,
					)
				.to(
					a5Targets,
					isMobile
						? {
								y: 0,
								scale: 1,
								rotateX: 0,
								autoAlpha: 1,
								duration: 0.85,
								ease: "expo.out",
								stagger: 0.36,
							}
						: {
								rotateY: 0,
								y: 0,
								autoAlpha: 1,
								filter: "blur(0px)",
								duration: 0.85,
								ease: "power3.out",
								stagger: 0.34,
							},
					7.8,
				)

				.to(
					a5Targets,
					isMobile
						? {
								y: -56,
								scale: 0.9,
								rotateX: -14,
								autoAlpha: 0,
								duration: 0.55,
								ease: "power2.in",
								stagger: { each: 0.07, from: "end" },
							}
						: {
								rotateY: 65,
								y: -24,
								autoAlpha: 0,
								filter: "blur(5px)",
								stagger: { each: 0.08, from: "end" },
								duration: 0.55,
								ease: "power2.in",
							},
					11.4,
				)
				.to(
					a5Dots.current.filter(Boolean),
					{ scale: 0, autoAlpha: 0, duration: 0.32, stagger: { each: 0.05, from: "end" }, ease: "power2.in" },
					11.45,
				)
				.to(
					a5Years.current.filter(Boolean),
					{ y: 10, autoAlpha: 0, duration: 0.32, stagger: { each: 0.05, from: "end" }, ease: "power2.in" },
					11.45,
				)
				.to(
					a5LineDesktop.current,
					{ strokeDashoffset: () => (a5PathD ? a5PathD.getTotalLength() : 0), duration: 0.7, ease: "power3.in" },
					11.5,
				)
				.to(
					a5TitleChars.current,
					{
						skewX: -12,
						y: -70,
						opacity: 0,
						filter: "blur(4px)",
						duration: 0.4,
						ease: "power3.in",
						stagger: { each: 0.02, from: "end" },
					},
					11.4,
				)
				.to(
					a5Eyebrow.current,
					{ autoAlpha: 0, y: -14, duration: 0.28, ease: "power2.in" },
					11.43,
				)

				.to(
					bg6.current,
					{ clipPath: "inset(0 0 0% 0)", duration: 0.68, ease: "power4.inOut" },
					11.95,
				)
				.to(a5Wrap.current, { autoAlpha: 0, duration: 0.01 }, 12.3)

				.to(aAchWrap.current, { autoAlpha: 1, duration: 0.01 }, 12.25)
				.to(
					achEls,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.7,
						ease: "power3.out",
						stagger: 0.05,
					},
					12.35,
				)
				.to(
					achRows,
					{
						x: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.7,
						ease: "expo.out",
						stagger: 0.08,
					},
					12.55,
				)
				.to(
					achRows,
					{
						x: 44,
						autoAlpha: 0,
						filter: "blur(4px)",
						duration: 0.45,
						ease: "power2.in",
						stagger: 0.05,
					},
					14.55,
				)
				.to(
					achEls,
					{
						y: -26,
						autoAlpha: 0,
						filter: "blur(5px)",
						duration: 0.5,
						ease: "power3.in",
						stagger: 0.03,
					},
					14.6,
				)
				.to(aAchWrap.current, { autoAlpha: 0, duration: 0.01 }, 15.05)

				.to(a6Wrap.current, { autoAlpha: 1, duration: 0.01 }, 15.0)
				.to(
					a6Line1Chars.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.0,
						ease: "power4.out",
						stagger: 0.024,
					},
					15.05,
				)
				.to(
					a6Line2Chars.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.0,
						ease: "power4.out",
						stagger: 0.024,
					},
					15.18,
				)
				.to(
					a6Body.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.6,
						ease: "power3.out",
					},
					15.43,
				)
				.to(
					a6Cta.current,
					{ y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
					15.53,
				);

			tl.addLabel("s-hero", 0)
				.addLabel("s-visionary", 3.0)
				.addLabel("s-collection", 6.0)
				.addLabel("s-timeline", 10.6)
				.addLabel("s-achievements", 13.8)
				.addLabel("s-connect", tl.duration());
			cleanupSnap = enableSectionSnap(tl);

			if (
				typeof window !== "undefined" &&
				window.location.hash === "#honours"
			) {
				let tries = 0;
				let done = false;
				const tryJump = () => {
					if (done) return;
					const st = tl.scrollTrigger;
					const lenis = getLenis();
					const ready =
						st &&
						lenis &&
						document.documentElement.scrollHeight > window.innerHeight * 2;
					if (!ready) {
						if (tries++ < 90) jumpRaf = requestAnimationFrame(tryJump);
						return;
					}
					done = true;
					lenis.resize();
					const t = tl.labels["s-achievements"];
					const target =
						st.start + (t / tl.duration()) * (st.end - st.start);
					lenis.scrollTo(target, { duration: 1.1, force: true, lock: true });
					window.history.replaceState(null, "", window.location.pathname);
				};
				jumpRaf = requestAnimationFrame(tryJump);
			}
		}, wrapperRef);

		return () => {
			cancelAnimationFrame(jumpRaf);
			cleanupSnap();
			ctx.revert();
		};
	}, [started]);

	return (
		<div ref={wrapperRef} className="relative w-full h-dvh">
			<div className="absolute inset-0 z-1 bg-plum-dark" />
			<div ref={bg2} className="absolute inset-0 z-2 bg-cream" />
			<div ref={bg3} className="absolute inset-0 z-3 bg-cream" />
			<div ref={bg4} className="absolute inset-0 z-4 bg-plum-dark" />
			<div ref={bg5} className="absolute inset-0 z-5 bg-plum" />
			<div ref={bg6} className="absolute inset-0 z-6 bg-plum-dark" />

			<AboutHeroAct
				wrapRef={a1Wrap}
				bgImgRef={a1BgImg}
				eyebrowRef={a1Eyebrow}
				line1CharsRef={a1Line1Chars}
				line2CharsRef={a1Line2Chars}
				quoteRef={a1Quote}
				hintRef={a1Hint}
			/>

			<VisionaryAct
				wrapRef={a3Wrap}
				eyebrowRef={a3Eyebrow}
				titleRef={a3Title}
				subtitleRef={a3Subtitle}
				body1Ref={a3Body1}
				body2Ref={a3Body2}
				quoteRef={a3Quote}
				attribRef={a3Attrib}
				imageRef={a3Image}
			/>

			<CollectionAct
				wrapRef={a4Wrap}
				eyebrowRef={a4Eyebrow}
				titleCharsRef={a4TitleChars}
				bodyRef={a4Body}
				membersRef={a4Members}
				membersMobileRef={a4MembersMobile}
				membersMobileWrapRef={a4MembersMobileWrap}
			/>

			<TimelineAct
				wrapRef={a5Wrap}
				eyebrowRef={a5Eyebrow}
				titleCharsRef={a5TitleChars}
				lineDesktopRef={a5LineDesktop}
				dotsRef={a5Dots}
				yearsRef={a5Years}
				entriesRef={a5Entries}
				entriesMobileRef={a5EntriesMobile}
				entriesMobileWrapRef={a5EntriesMobileWrap}
			/>

			<AchievementsAct wrapRef={aAchWrap} />

			<ConnectAct
				wrapRef={a6Wrap}
				line1CharsRef={a6Line1Chars}
				line2CharsRef={a6Line2Chars}
				bodyRef={a6Body}
				ctaRef={a6Cta}
			/>
		</div>
	);
}
