"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactHeroAct } from "./acts/ContactHeroAct";
import { ContactInquiryAct } from "./acts/ContactInquiryAct";
import { ContactInfoAct } from "./acts/ContactInfoAct";
import { enableSectionSnap } from "@/lib/sectionSnap";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPinnedScroll({ started }: { started: boolean }) {
	const wrapperRef = useRef<HTMLDivElement>(null);

	const heroWrap = useRef<HTMLDivElement>(null);
	const heroEyebrow = useRef<HTMLDivElement>(null);
	const heroTitle1 = useRef<(HTMLSpanElement | null)[]>([]);
	const heroTitle2 = useRef<(HTMLSpanElement | null)[]>([]);
	const heroSub = useRef<HTMLParagraphElement>(null);
	const heroHint = useRef<HTMLDivElement>(null);

	const inquiryWrap = useRef<HTMLDivElement>(null);
	const formWrap = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!started) return;

		let cleanupSnap: () => void = () => {};
		const ctx = gsap.context(() => {
			const VH = window.innerHeight;
			const HIDDEN_WORD = {
				rotateX: 58,
				y: 44,
				opacity: 0,
				filter: "blur(6px)",
				transformPerspective: 1000,
				transformOrigin: "50% 100%",
			};
			const SHOW_WORD = { rotateX: 0, y: 0, opacity: 1, filter: "blur(0px)" };

			const heroWords = [
				...heroTitle1.current.filter(Boolean),
				...heroTitle2.current.filter(Boolean),
			];
			const reveals = (el: HTMLDivElement | null) =>
				el ? gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".c-reveal")) : [];
			const inquiryEls = reveals(inquiryWrap.current);
			const formEls = reveals(formWrap.current);

			gsap.set([inquiryWrap.current, formWrap.current], { autoAlpha: 0 });
			gsap.set(heroEyebrow.current, { y: 16, autoAlpha: 0 });
			gsap.set(heroWords, HIDDEN_WORD);
			gsap.set(heroSub.current, { y: 18, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(heroHint.current, { autoAlpha: 0 });
			gsap.set([...inquiryEls, ...formEls], {
				y: 28,
				autoAlpha: 0,
				filter: "blur(5px)",
			});

			const heroIn = gsap.timeline({ paused: true });
			heroIn
				.to(heroEyebrow.current, {
					y: 0,
					autoAlpha: 1,
					duration: 0.7,
					ease: "power3.out",
				})
				.to(
					heroWords,
					{ ...SHOW_WORD, duration: 1, ease: "power4.out", stagger: 0.07 },
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
					heroWords,
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
					end: `+=${VH * 9}`,
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

			tl.to(inquiryWrap.current, { autoAlpha: 1, duration: 0.01 }, 0.35)
				.to(
					inquiryEls,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.6,
						ease: "power3.out",
						stagger: 0.06,
					},
					0.45,
				)
				.to(
					inquiryEls,
					{
						y: -26,
						autoAlpha: 0,
						filter: "blur(5px)",
						duration: 0.5,
						ease: "power3.in",
						stagger: 0.03,
					},
					2.85,
				)
				.to(inquiryWrap.current, { autoAlpha: 0, duration: 0.01 }, 3.25)

				.to(formWrap.current, { autoAlpha: 1, duration: 0.01 }, 3.2)
				.to(
					formEls,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.6,
						ease: "power3.out",
						stagger: 0.06,
					},
					3.35,
				);

			tl.addLabel("s-hero", 0)
				.addLabel("s-inquiry", 1.9)
				.addLabel("s-form", tl.duration());
			cleanupSnap = enableSectionSnap(tl);
		}, wrapperRef);

		return () => {
			cleanupSnap();
			ctx.revert();
		};
	}, [started]);

	return (
		<div
			ref={wrapperRef}
			className="relative h-screen w-full overflow-hidden bg-plum-dark text-cream">
			<ContactHeroAct
				wrapRef={heroWrap}
				eyebrowRef={heroEyebrow}
				title1Ref={heroTitle1}
				title2Ref={heroTitle2}
				subRef={heroSub}
				hintRef={heroHint}
			/>
			<ContactInquiryAct wrapRef={inquiryWrap} />
			<ContactInfoAct wrapRef={formWrap} />
		</div>
	);
}
