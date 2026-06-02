"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS } from "@/lib/studio";
import { ProcessHeroAct } from "./acts/ProcessHeroAct";
import { ProcessStepsAct } from "./acts/ProcessStepsAct";
import { ProcessContactAct } from "./acts/ProcessContactAct";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessPinnedScroll({ started }: { started: boolean }) {
	const wrapperRef = useRef<HTMLDivElement>(null);

	const heroWrap = useRef<HTMLDivElement>(null);
	const heroEyebrow = useRef<HTMLDivElement>(null);
	const heroTitle = useRef<(HTMLSpanElement | null)[]>([]);
	const heroSub = useRef<HTMLParagraphElement>(null);
	const heroHint = useRef<HTMLDivElement>(null);

	const procWrap = useRef<HTMLDivElement>(null);
	const imgInner = useRef<(HTMLDivElement | null)[]>([]);
	const imgLine = useRef<(HTMLSpanElement | null)[]>([]);
	const textInner = useRef<(HTMLDivElement | null)[]>([]);
	const textLine = useRef<(HTMLSpanElement | null)[]>([]);

	const contactWrap = useRef<HTMLDivElement>(null);
	const contactInner = useRef<HTMLDivElement>(null);
	const contactLine = useRef<HTMLSpanElement>(null);
	const contactTitle = useRef<(HTMLSpanElement | null)[]>([]);

	useEffect(() => {
		if (!started) return;

		const ctx = gsap.context(() => {
			const VH = window.innerHeight;
			const steps = PROCESS.steps;
			const STEP = 1.3;
			const procStart = 0.3;
			const procEnd = procStart + steps.length * STEP;

			const HIDDEN_WORD = {
				rotateX: 58,
				y: 44,
				opacity: 0,
				filter: "blur(6px)",
				transformPerspective: 1000,
				transformOrigin: "50% 100%",
			};
			const SHOW_WORD = { rotateX: 0, y: 0, opacity: 1, filter: "blur(0px)" };
			const CLIPPED = "inset(0% 0% 100% 0%)";
			const OPEN = "inset(0% 0% 0% 0%)";

			gsap.set([procWrap.current, contactWrap.current], { autoAlpha: 0 });
			gsap.set(heroEyebrow.current, { y: 16, autoAlpha: 0 });
			gsap.set(heroTitle.current, HIDDEN_WORD);
			gsap.set(heroSub.current, { y: 18, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(heroHint.current, { autoAlpha: 0 });

			gsap.set(
				[
					...imgInner.current.filter(Boolean),
					...textInner.current.filter(Boolean),
					contactInner.current,
				],
				{ clipPath: CLIPPED },
			);
			gsap.set(
				[
					...imgLine.current.filter(Boolean),
					...textLine.current.filter(Boolean),
					contactLine.current,
				],
				{ top: "0%", autoAlpha: 0 },
			);

			const heroIn = gsap.timeline({ paused: true });
			heroIn
				.to(heroEyebrow.current, {
					y: 0,
					autoAlpha: 1,
					duration: 0.7,
					ease: "power3.out",
				})
				.to(
					heroTitle.current,
					{ ...SHOW_WORD, duration: 1, ease: "power4.out", stagger: 0.08 },
					"-=0.4",
				)
				.to(
					heroSub.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.7,
						ease: "power3.out",
					},
					"-=0.6",
				)
				.to(heroHint.current, { autoAlpha: 1, duration: 0.5 }, "-=0.3");

			if (typeof document !== "undefined" && document.fonts?.load) {
				Promise.all([
					document.fonts.load('italic 1em "bdScript"'),
					document.fonts.ready,
				])
					.then(() => heroIn.play())
					.catch(() => heroIn.play());
			} else {
				heroIn.play();
			}

			const heroExit = gsap.timeline({ paused: true });
			heroExit
				.to(
					heroTitle.current,
					{
						rotateX: -46,
						y: -54,
						opacity: 0,
						filter: "blur(6px)",
						duration: 0.6,
						ease: "power3.in",
						stagger: { each: 0.03, from: "end" },
					},
					0,
				)
				.to(
					[heroEyebrow.current, heroSub.current],
					{
						y: -30,
						autoAlpha: 0,
						filter: "blur(4px)",
						duration: 0.5,
						ease: "power2.in",
					},
					0,
				)
				.to(heroHint.current, { autoAlpha: 0, duration: 0.3 }, 0)
				.to(heroWrap.current, { autoAlpha: 0, duration: 0.01 }, 0.55);

			let heroGone = false;
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: wrapperRef.current,
					start: "top top",
					end: `+=${VH * 18}`,
					pin: true,
					scrub: 1.2,
					anticipatePin: 1,
					onUpdate: (self) => {
						if (!heroGone && self.progress > 0.03) {
							heroGone = true;
							heroExit.play();
						} else if (heroGone && self.progress < 0.012) {
							heroGone = false;
							heroExit.reverse();
						}
					},
				},
			});

			tl.to(procWrap.current, { autoAlpha: 1, duration: 0.01 }, 0.1);

			const wipe = (
				inner: HTMLDivElement | null,
				line: HTMLSpanElement | null,
				at: number,
			) => {
				tl.set(line, { autoAlpha: 1 }, at)
					.to(inner, { clipPath: OPEN, duration: 0.8, ease: "power2.inOut" }, at)
					.to(line, { top: "100%", duration: 0.8, ease: "power2.inOut" }, at)
					.to(line, { autoAlpha: 0, duration: 0.22 }, at + 0.62);
			};

			steps.forEach((_, i) => {
				const at = procStart + i * STEP;
				wipe(imgInner.current[i], imgLine.current[i], at);
				wipe(textInner.current[i], textLine.current[i], at);

				const inner = textInner.current[i];
				if (!inner) return;
				const tWords = inner.querySelectorAll<HTMLElement>(".p-tword");
				const eyebrow = inner.querySelector<HTMLElement>(".p-eyebrow");
				const desc = inner.querySelector<HTMLElement>(".p-desc");

				gsap.set(tWords, {
					rotateX: 55,
					y: 28,
					opacity: 0,
					filter: "blur(5px)",
					transformPerspective: 800,
					transformOrigin: "50% 100%",
				});
				gsap.set([eyebrow, desc], { y: 18, autoAlpha: 0, filter: "blur(4px)" });

				tl.to(
					eyebrow,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.5,
						ease: "power3.out",
					},
					at + 0.4,
				)
					.to(
						tWords,
						{
							rotateX: 0,
							y: 0,
							opacity: 1,
							filter: "blur(0px)",
							duration: 0.7,
							ease: "power4.out",
							stagger: 0.05,
						},
						at + 0.46,
					)
					.to(
						desc,
						{
							y: 0,
							autoAlpha: 1,
							filter: "blur(0px)",
							duration: 0.55,
							ease: "power3.out",
						},
						at + 0.72,
					);
			});

			tl.set(contactWrap.current, { autoAlpha: 1 }, procEnd - 0.05);
			wipe(contactInner.current, contactLine.current, procEnd);
		}, wrapperRef);

		return () => ctx.revert();
	}, [started]);

	return (
		<div
			ref={wrapperRef}
			className="relative h-screen w-full overflow-hidden bg-plum-dark text-cream">
			<ProcessHeroAct
				wrapRef={heroWrap}
				eyebrowRef={heroEyebrow}
				titleWordsRef={heroTitle}
				subRef={heroSub}
				hintRef={heroHint}
			/>
			<ProcessStepsAct
				wrapRef={procWrap}
				imgInnerRefs={imgInner}
				imgLineRefs={imgLine}
				textInnerRefs={textInner}
				textLineRefs={textLine}
			/>
			<ProcessContactAct
				wrapRef={contactWrap}
				innerRef={contactInner}
				lineRef={contactLine}
				titleWordsRef={contactTitle}
			/>
		</div>
	);
}
