"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroAct } from "./acts/HeroAct";
import { PhilosophyAct } from "./acts/PhilosophyAct";
import { DisciplinesAct } from "./acts/DisciplinesAct";
import { PartnersAct } from "./acts/PartnersAct";
import { VoicesAct } from "./acts/VoicesAct";
import { InvitationAct } from "./acts/InvitationAct";
import { enableSectionSnap } from "@/lib/sectionSnap";

gsap.registerPlugin(ScrollTrigger);

import type {
	Discipline,
	Partner,
	PartnerCategory,
	Testimonial,
} from "@/lib/cms/types";

interface Props {
	started: boolean;
	onNavVisibleAction: (v: boolean) => void;
	disciplines: Discipline[];
	partners: Partner[];
	partnerCategories: PartnerCategory[];
	testimonials: Testimonial[];
	recognition: string[];
}

export default function PinnedScroll({
	started,
	onNavVisibleAction,
	disciplines,
	partners,
	partnerCategories,
	testimonials,
	recognition,
}: Props) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const onNavVisibleRef = useRef(onNavVisibleAction);
	useEffect(() => {
		onNavVisibleRef.current = onNavVisibleAction;
	});

	const bg2 = useRef<HTMLDivElement>(null);
	const bg3 = useRef<HTMLDivElement>(null);
	const bg6 = useRef<HTMLDivElement>(null);

	const a1Wrap = useRef<HTMLDivElement>(null);
	const a1BgVideo = useRef<HTMLDivElement>(null);
	const a1Line1Chars = useRef<(HTMLSpanElement | null)[]>([]);
	const a1Line2Chars = useRef<(HTMLSpanElement | null)[]>([]);
	const a1Quote = useRef<HTMLParagraphElement>(null);
	const a1Sub = useRef<HTMLDivElement>(null);
	const a1Cta = useRef<HTMLDivElement>(null);
	const a1Proof = useRef<HTMLDivElement>(null);
	const a1Hint = useRef<HTMLDivElement>(null);

	const a2Wrap = useRef<HTMLDivElement>(null);
	const a2Eyebrow = useRef<HTMLDivElement>(null);
	const a2Rule = useRef<HTMLDivElement>(null);
	const a2Words = useRef<(HTMLSpanElement | null)[]>([]);
	const a2Body = useRef<HTMLParagraphElement>(null);

	const a3Wrap = useRef<HTMLDivElement>(null);
	const a3Rule = useRef<HTMLDivElement>(null);
	const a3TitleChars = useRef<(HTMLSpanElement | null)[]>([]);
	const a3Items = useRef<(HTMLDivElement | null)[]>([]);

	const a5Wrap = useRef<HTMLDivElement>(null);
	const a5Eyebrow = useRef<HTMLDivElement>(null);
	const a5Rule = useRef<HTMLDivElement>(null);
	const a5TitleWords = useRef<(HTMLSpanElement | null)[]>([]);
	const a5Tagline = useRef<HTMLParagraphElement>(null);
	const a5Cta = useRef<HTMLDivElement>(null);
	const a5Showcase = useRef<HTMLDivElement>(null);

	const avWrap = useRef<HTMLDivElement>(null);
	const avRule = useRef<HTMLDivElement>(null);
	const avTitleWords = useRef<(HTMLSpanElement | null)[]>([]);
	const avItems = useRef<(HTMLDivElement | null)[]>([]);

	const a6Wrap = useRef<HTMLDivElement>(null);
	const a6Line1Chars = useRef<(HTMLSpanElement | null)[]>([]);
	const a6Line2Chars = useRef<(HTMLSpanElement | null)[]>([]);
	const a6Details = useRef<HTMLDivElement>(null);
	const a6Social = useRef<HTMLDivElement>(null);
	const a6CtaWrap = useRef<HTMLDivElement>(null);
	const a6Cta = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		if (!started) return;

		let cleanupSnap: () => void = () => {};
		const ctx = gsap.context(() => {
			const VH = window.innerHeight;

			gsap.set(bg2.current, { clipPath: "inset(0 100% 0 0)" });
			gsap.set(bg3.current, { clipPath: "inset(0 0 0 100%)" });
			gsap.set(bg6.current, { clipPath: "inset(0 0 100% 0)" });

			const HIDDEN_CHAR_3D = {
				rotateX: -88,
				y: 70,
				opacity: 0,
				filter: "blur(6px)",
				transformPerspective: 1200,
			};
			const HIDDEN_WORD_3D = {
				rotateX: 55,
				y: 50,
				opacity: 0,
				filter: "blur(5px)",
				transformPerspective: 1200,
			};
			const HIDDEN_CHAR_SKEW = (skew: number) => ({
				skewX: skew,
				y: 80,
				opacity: 0,
				filter: "blur(4px)",
				transformPerspective: 1200,
			});

			gsap.set(a1BgVideo.current, { scale: 1.12, autoAlpha: 0 });
			gsap.set(a1Line1Chars.current, HIDDEN_CHAR_3D);
			gsap.set(a1Line2Chars.current, HIDDEN_CHAR_3D);
			gsap.set(a1Quote.current, { y: 22, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a1Sub.current, { y: 16, autoAlpha: 0 });
			gsap.set(a1Cta.current, { y: 14, autoAlpha: 0 });
			gsap.set(a1Proof.current, { y: 14, autoAlpha: 0 });
			gsap.set(a1Hint.current, { autoAlpha: 0 });

			gsap.set(
				[
					a2Wrap.current,
					a3Wrap.current,
					a5Wrap.current,
					avWrap.current,
					a6Wrap.current,
				],
				{ autoAlpha: 0 },
			);

			gsap.set(a2Eyebrow.current, { y: 18, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a2Rule.current, { scaleX: 0, transformOrigin: "center" });
			gsap.set(a2Words.current, HIDDEN_WORD_3D);
			gsap.set(a2Body.current, { y: 22, autoAlpha: 0, filter: "blur(4px)" });

			gsap.set(a3Rule.current, { scaleX: 0, transformOrigin: "center" });
			gsap.set(a3TitleChars.current, HIDDEN_CHAR_SKEW(14));
			gsap.set(a3Items.current.filter(Boolean), {
				x: 70,
				y: 24,
				autoAlpha: 0,
				rotateX: -32,
				transformPerspective: 1000,
				transformOrigin: "50% 0%",
			});

			gsap.set(a5Eyebrow.current, { y: 18, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a5Rule.current, { scaleX: 0, transformOrigin: "left" });
			gsap.set(a5TitleWords.current, HIDDEN_WORD_3D);
			gsap.set(a5Tagline.current, { y: 22, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a5Cta.current, { y: 18, autoAlpha: 0 });
			gsap.set(a5Showcase.current, { autoAlpha: 0, y: 30, filter: "blur(6px)" });

			gsap.set(avRule.current, { scaleX: 0, transformOrigin: "center" });
			gsap.set(avTitleWords.current, HIDDEN_WORD_3D);
			gsap.set(avItems.current.filter(Boolean), {
				y: 30,
				autoAlpha: 0,
				rotateX: -28,
				transformPerspective: 1000,
				transformOrigin: "50% 0%",
			});

			gsap.set(a6Line1Chars.current, HIDDEN_CHAR_3D);
			gsap.set(a6Line2Chars.current, HIDDEN_CHAR_3D);
			gsap.set(a6Details.current, { y: 26, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(a6Social.current, { y: 20, autoAlpha: 0 });
			gsap.set(a6CtaWrap.current, { y: 16, autoAlpha: 0 });

			const heroExit = gsap.timeline({ paused: true });
			heroExit
				.to(
					a1BgVideo.current,
					{ scale: 1.06, autoAlpha: 0, duration: 0.55, ease: "power2.in" },
					0,
				)
				.to(
					a1Hint.current,
					{ autoAlpha: 0, duration: 0.3, ease: "power2.in" },
					0,
				)
				.to(
					[a1Quote.current, a1Sub.current, a1Cta.current, a1Proof.current],
					{
						y: -28,
						autoAlpha: 0,
						filter: "blur(4px)",
						duration: 0.42,
						stagger: 0.05,
						ease: "power2.in",
					},
					0,
				)
				.to(
					a1Line2Chars.current,
					{
						rotateX: 65,
						y: -65,
						opacity: 0,
						filter: "blur(5px)",
						duration: 0.6,
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
						duration: 0.6,
						ease: "power3.in",
						stagger: { each: 0.024, from: "end" },
					},
					0.1,
				);

			const heroIn = gsap.timeline({
				delay: 0.5,
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
			heroIn.call(() => onNavVisibleRef.current(true), [], 0.45);
			heroIn
				.to(
					a1BgVideo.current,
					{ scale: 1, autoAlpha: 1, duration: 1.6, ease: "expo.out" },
					0,
				)
				.to(a1Line1Chars.current, {
					rotateX: 0,
					y: 0,
					opacity: 1,
					filter: "blur(0px)",
					duration: 1.1,
					ease: "power4.out",
					stagger: 0.024,
				}, "-=1.3")
				.to(
					a1Line2Chars.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.1,
						ease: "power4.out",
						stagger: 0.024,
					},
					"-=0.78",
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
				.to(
					a1Sub.current,
					{ y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
					"-=0.45",
				)
				.to(
					a1Cta.current,
					{ y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" },
					"-=0.38",
				)
				.to(
					a1Proof.current,
					{ y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" },
					"-=0.32",
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
							revealChars();
							heroIn.progress(1);
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
				0.6,
			)
				.to(a1Wrap.current, { autoAlpha: 0, duration: 0.01 }, 1.05)

				.to(a2Wrap.current, { autoAlpha: 1, duration: 0.01 }, 0.98)
				.to(
					a2Eyebrow.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.5,
						ease: "expo.out",
					},
					1.02,
				)
				.to(
					a2Rule.current,
					{ scaleX: 1, duration: 0.55, ease: "expo.out" },
					1.18,
				)
				.to(
					a2Words.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.0,
						ease: "power4.out",
						stagger: 0.075,
					},
					1.28,
				)
				.to(
					a2Body.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.65,
						ease: "power3.out",
					},
					2.0,
				)

				.to(
					a2Words.current,
					{
						rotateX: -55,
						y: -50,
						opacity: 0,
						filter: "blur(5px)",
						duration: 0.5,
						ease: "power3.in",
						stagger: { each: 0.035, from: "end" },
					},
					2.85,
				)
				.to(
					[a2Eyebrow.current, a2Rule.current, a2Body.current],
					{
						autoAlpha: 0,
						y: -22,
						filter: "blur(4px)",
						duration: 0.36,
						stagger: 0.04,
						ease: "power2.in",
					},
					2.82,
				)

				.to(
					bg3.current,
					{ clipPath: "inset(0 0 0 0%)", duration: 0.68, ease: "power4.inOut" },
					2.9,
				)
				.to(a2Wrap.current, { autoAlpha: 0, duration: 0.01 }, 3.34)

				.to(a3Wrap.current, { autoAlpha: 1, duration: 0.01 }, 3.22)
				.to(
					a3Rule.current,
					{ scaleX: 1, duration: 0.55, ease: "expo.out" },
					3.42,
				)
				.to(
					a3TitleChars.current,
					{
						skewX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 0.9,
						ease: "power4.out",
						stagger: 0.028,
					},
					3.32,
				)
				.to(
					a3Items.current.filter(Boolean),
					{
						x: 0,
						y: 0,
						autoAlpha: 1,
						rotateX: 0,
						duration: 0.75,
						ease: "expo.out",
						stagger: 0.075,
					},
					3.5,
				)

				.to(
					a3Items.current.filter(Boolean),
					{
						y: -40,
						autoAlpha: 0,
						scale: 0.94,
						filter: "blur(6px)",
						stagger: 0.055,
						duration: 0.55,
						ease: "power3.in",
					},
					4.78,
				)
				.to(
					a3TitleChars.current,
					{
						skewX: -14,
						y: -70,
						opacity: 0,
						filter: "blur(4px)",
						duration: 0.42,
						ease: "power3.in",
						stagger: { each: 0.022, from: "end" },
					},
					4.78,
				)
				.to(
					a3Rule.current,
					{ autoAlpha: 0, y: -16, duration: 0.3, ease: "power2.in" },
					4.82,
				)

				.to(a3Wrap.current, { autoAlpha: 0, duration: 0.01 }, 5.26)

				.to(a5Wrap.current, { autoAlpha: 1, duration: 0.01 }, 5.0)
				.to(
					a5Eyebrow.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.5,
						ease: "expo.out",
					},
					5.04,
				)
				.to(
					a5Rule.current,
					{ scaleX: 1, duration: 0.55, ease: "expo.out" },
					5.18,
				)
				.to(
					a5TitleWords.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.0,
						ease: "power4.out",
						stagger: 0.08,
					},
					5.12,
				)
				.to(
					a5Tagline.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.65,
						ease: "power3.out",
					},
					5.55,
				)
				.to(
					a5Showcase.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 1.0,
						ease: "expo.out",
					},
					5.55,
				)
				.to(
					a5Cta.current,
					{ y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" },
					5.82,
				)
				.to(
					[a5Tagline.current, a5Eyebrow.current, a5Rule.current, a5Cta.current],
					{
						autoAlpha: 0,
						y: -22,
						filter: "blur(4px)",
						duration: 0.34,
						stagger: 0.04,
						ease: "power2.in",
					},
					6.4,
				)
				.to(
					a5TitleWords.current,
					{
						rotateX: -55,
						y: -50,
						opacity: 0,
						filter: "blur(5px)",
						duration: 0.5,
						ease: "power3.in",
						stagger: { each: 0.04, from: "end" },
					},
					6.4,
				)
				.to(
					a5Showcase.current,
					{
						y: -40,
						autoAlpha: 0,
						filter: "blur(5px)",
						duration: 0.5,
						ease: "power3.in",
					},
					6.42,
				)

				.to(
					bg6.current,
					{ clipPath: "inset(0 0 0% 0)", duration: 0.68, ease: "power4.inOut" },
					6.5,
				)
				.to(a5Wrap.current, { autoAlpha: 0, duration: 0.01 }, 6.88)

				.to(avWrap.current, { autoAlpha: 1, duration: 0.01 }, 6.85)
				.to(
					avRule.current,
					{ scaleX: 1, duration: 0.55, ease: "expo.out" },
					7.04,
				)
				.to(
					avTitleWords.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.0,
						ease: "power4.out",
						stagger: 0.08,
					},
					6.98,
				)
				.to(
					avItems.current.filter(Boolean),
					{
						y: 0,
						autoAlpha: 1,
						rotateX: 0,
						duration: 0.8,
						ease: "expo.out",
						stagger: 0.12,
					},
					7.2,
				)
				.to(
					avItems.current.filter(Boolean),
					{
						y: -40,
						autoAlpha: 0,
						scale: 0.94,
						filter: "blur(6px)",
						duration: 0.55,
						ease: "power3.in",
						stagger: 0.06,
					},
					8.7,
				)
				.to(
					avTitleWords.current,
					{
						rotateX: -55,
						y: -50,
						opacity: 0,
						filter: "blur(5px)",
						duration: 0.5,
						ease: "power3.in",
						stagger: { each: 0.04, from: "end" },
					},
					8.7,
				)
				.to(
					avRule.current,
					{ autoAlpha: 0, y: -16, duration: 0.3, ease: "power2.in" },
					8.74,
				)
				.to(avWrap.current, { autoAlpha: 0, duration: 0.01 }, 9.18)

				.to(a6Wrap.current, { autoAlpha: 1, duration: 0.01 }, 9.4)
				.to(
					a6Line1Chars.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.05,
						ease: "power4.out",
						stagger: 0.024,
					},
					9.45,
				)
				.to(
					a6Line2Chars.current,
					{
						rotateX: 0,
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.05,
						ease: "power4.out",
						stagger: 0.024,
					},
					9.6,
				)
				.to(
					a6Details.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.6,
						ease: "power3.out",
					},
					9.85,
				)
				.to(
					a6Social.current,
					{ y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" },
					9.95,
				)
				.to(
					a6CtaWrap.current,
					{ y: 0, autoAlpha: 1, duration: 0.52, ease: "power3.out" },
					10.03,
				);

			tl.addLabel("s-hero", 0)
				.addLabel("s-philosophy", 2.72)
				.addLabel("s-disciplines", 4.6)
				.addLabel("s-partners", 6.38)
				.addLabel("s-voices", 8.4)
				.addLabel("s-invitation", tl.duration());
			cleanupSnap = enableSectionSnap(tl);

			const ctaEl = a6Cta.current;
			if (ctaEl) {
				let hovering = false;
				const onEnter = () => {
					hovering = true;
				};
				const onMove = (e: MouseEvent) => {
					if (!hovering) return;
					const r = ctaEl.getBoundingClientRect();
					const dx = e.clientX - r.left - r.width / 2;
					const dy = e.clientY - r.top - r.height / 2;
					gsap.to(ctaEl, {
						x: dx * 0.28,
						y: dy * 0.4,
						duration: 0.45,
						ease: "power3.out",
					});
				};
				const onLeave = () => {
					hovering = false;
					gsap.to(ctaEl, {
						x: 0,
						y: 0,
						duration: 0.8,
						ease: "elastic.out(1.1, 0.45)",
					});
				};
				ctaEl.addEventListener("mouseenter", onEnter);
				ctaEl.addEventListener("mousemove", onMove);
				ctaEl.addEventListener("mouseleave", onLeave);
			}
		}, wrapperRef);

		return () => {
			cleanupSnap();
			ctx.revert();
		};
	}, [started]);

	return (
		<div ref={wrapperRef} className="relative w-full h-dvh">
			<div className="absolute inset-0 z-1 bg-plum-dark" />
			<div ref={bg2} className="absolute inset-0 z-2 bg-cream" />
			<div ref={bg3} className="absolute inset-0 z-3 bg-plum" />
			<div ref={bg6} className="absolute inset-0 z-4 bg-plum-dark" />

			<HeroAct
				wrapRef={a1Wrap}
				bgVideoRef={a1BgVideo}
				line1CharsRef={a1Line1Chars}
				line2CharsRef={a1Line2Chars}
				quoteRef={a1Quote}
				subRef={a1Sub}
				ctaRef={a1Cta}
				proofRef={a1Proof}
				hintRef={a1Hint}
				recognitionItems={recognition}
			/>

			<PhilosophyAct
				wrapRef={a2Wrap}
				eyebrowRef={a2Eyebrow}
				ruleRef={a2Rule}
				wordsRef={a2Words}
				bodyRef={a2Body}
			/>

			<DisciplinesAct
					wrapRef={a3Wrap}
					ruleRef={a3Rule}
					titleCharsRef={a3TitleChars}
					itemsRef={a3Items}
					disciplines={disciplines}
			/>

			<PartnersAct
				wrapRef={a5Wrap}
				eyebrowRef={a5Eyebrow}
				ruleRef={a5Rule}
				titleWordsRef={a5TitleWords}
				taglineRef={a5Tagline}
				ctaRef={a5Cta}
				showcaseRef={a5Showcase}
				partners={partners}
				partnerCategories={partnerCategories}
			/>

			<VoicesAct
				wrapRef={avWrap}
				ruleRef={avRule}
				titleWordsRef={avTitleWords}
				itemsRef={avItems}
				testimonials={testimonials}
			/>

			<InvitationAct
				wrapRef={a6Wrap}
				line1CharsRef={a6Line1Chars}
				line2CharsRef={a6Line2Chars}
				detailsRef={a6Details}
				socialRef={a6Social}
				ctaWrapRef={a6CtaWrap}
				ctaRef={a6Cta}
			/>
		</div>
	);
}
