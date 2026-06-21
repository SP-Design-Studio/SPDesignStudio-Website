"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AtelierHeroAct } from "./acts/AtelierHeroAct";
import { AtelierGalleryAct } from "./acts/AtelierGalleryAct";
import { setSectionAnchors } from "@/lib/sectionNav";
import type { AtelierImage } from "@/lib/atelier";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN_WORD_3D = {
  rotateX: -88,
  y: 70,
  opacity: 0,
  filter: "blur(6px)",
  transformPerspective: 1200,
};

export default function AtelierScroll({ images }: { images: AtelierImage[] }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setSectionAnchors(() => {
      const anchors: number[] = [];
      const hero = document.getElementById("hero");
      const gallery = document.getElementById("gallery");

      if (hero) anchors.push(hero.offsetTop);
      if (gallery) anchors.push(gallery.offsetTop);

      return anchors;
    });

    return () => setSectionAnchors(null);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = titleWordsRef.current.filter(Boolean) as HTMLSpanElement[];
      gsap.set(words, HIDDEN_WORD_3D);
      gsap.set(taglineRef.current, {
        y: 18,
        autoAlpha: 0,
        filter: "blur(5px)",
      });

      const playIn = () => {
        words.forEach((el) => {
          el.style.visibility = "visible";
        });
        const tl = gsap.timeline({ delay: 0.4 });
        tl.to(words, {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.06,
          onComplete: () =>
            words.forEach((el) => {
              el.style.willChange = "auto";
            }),
        }).to(
          taglineRef.current,
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.55",
        );
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

      const tiles = itemsRef.current.filter(Boolean) as HTMLButtonElement[];
      if (tiles.length) {
        ScrollTrigger.batch(tiles, {
          start: "top 85%",
          onEnter: (els) => {
            els.forEach((el, i) => {
              const media = el.querySelector(".atelier-media");
              const inner = el.querySelector(".atelier-media-inner");

              if (!media || !inner) return;

              const tl = gsap.timeline();

              tl.fromTo(
                media,
                { clipPath: "inset(100% 0% 0% 0% round 0.125rem)" },
                {
                  clipPath: "inset(0% 0% 0% 0% round 0.125rem)",
                  duration: 1.05,
                  ease: "expo.out",
                },
                i * 0.085,
              ).fromTo(
                inner,
                { scale: 1.28 },
                { scale: 1, duration: 1.2, ease: "expo.out" },
                i * 0.085,
              );
            });
          },
          onLeaveBack: (els) => {
            els.forEach((el, i) => {
              const media = el.querySelector(".atelier-media");
              const inner = el.querySelector(".atelier-media-inner");
              if (!media || !inner) return;
              const tl = gsap.timeline();
              tl.to(
                media,
                {
                  clipPath: "inset(100% 0% 0% 0% round 0.125rem)",
                  duration: 0.7,
                  ease: "expo.in",
                },
                i * 0.06,
              ).to(
                inner,
                { scale: 1.28, duration: 0.8, ease: "expo.in" },
                i * 0.06,
              );
            });
          },
        });
      }
      ScrollTrigger.refresh();
    }, scopeRef);

    return () => ctx.revert();
  }, [images]);

  return (
    <div ref={scopeRef} className="bg-plum-dark">
      <AtelierHeroAct titleWordsRef={titleWordsRef} taglineRef={taglineRef} />
      <AtelierGalleryAct images={images} itemsRef={itemsRef} />
    </div>
  );
}
