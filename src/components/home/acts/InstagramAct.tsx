"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaInstagram, FaPlay } from "react-icons/fa";
import { Words } from "@/components/shared/Words";
import type { InstaItem } from "@/lib/instagram";
import { STUDIO } from "@/lib/studio";

interface Props {
  wrapRef: React.RefObject<HTMLDivElement | null>;
  ruleRef: React.RefObject<HTMLDivElement | null>;
  titleWordsRef: React.RefObject<(HTMLSpanElement | null)[]>;
  itemsRef: React.RefObject<(HTMLElement | null)[]>;
  postsHeadRef: React.RefObject<HTMLDivElement | null>;
  reelsHeadRef: React.RefObject<HTMLDivElement | null>;
  taglineRef: React.RefObject<HTMLParagraphElement | null>;
  ctaRef: React.RefObject<HTMLDivElement | null>;
  media: InstaItem[];
}

const ROW_FRAME = "w-full max-w-5xl xl:max-w-6xl mx-auto px-6 sm:px-10";
const ROW_VIEWPORT =
  "relative overflow-x-auto md:overflow-hidden snap-x snap-mandatory md:snap-none scrollbar-none [&::-webkit-scrollbar]:hidden";
const ROW_TRACK = "flex w-max gap-3 md:gap-5 md:will-change-transform";
const FADE_L =
  "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 md:w-28 bg-gradient-to-r from-plum-dark to-transparent";
const FADE_R =
  "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 md:w-28 bg-gradient-to-l from-plum-dark to-transparent";

function Tile({
  m,
  kind,
  refCb,
  duplicate,
}: {
  m: InstaItem;
  kind: "post" | "reel";
  refCb?: (el: HTMLAnchorElement | null) => void;
  duplicate?: boolean;
}) {
  const isReel = kind === "reel";
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <a
      ref={refCb}
      href={m.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      className={`group relative shrink-0 overflow-hidden bg-plum border border-gold/15 ${
        duplicate ? "hidden md:block" : "snap-start"
      } ${
        isReel
          ? "h-[clamp(150px,22vh,200px)] md:h-[clamp(190px,26vh,300px)] aspect-9/16"
          : "h-[clamp(108px,15vh,150px)] md:h-[clamp(150px,18vh,210px)] aspect-square"
      }`}
    >
      <img
        src={m.image}
        alt={isReel ? "Studio reel" : "Studio post"}
        loading="lazy"
        onError={() => setBroken(true)}
        className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-plum-dark/55 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
        <span className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500 text-[0.6rem] uppercase tracking-[0.3em] text-gold">
          {isReel ? "Play" : "View"}
        </span>
      </div>
      {isReel && (
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-plum-dark/50 backdrop-blur-md flex items-center justify-center text-cream shadow-xl">
          <FaPlay size={8} className="ml-0.5" />
        </div>
      )}
      <span className="absolute top-0 left-0 w-0 group-hover:w-full h-px bg-gold/80 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]" />
    </a>
  );
}

function RowHeader({
  label,
  headRef,
}: {
  label: string;
  headRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={headRef} className="flex items-center justify-center gap-3">
      <div className="w-6 md:w-8 h-px bg-gold/60" />
      <span className="font-sans uppercase tracking-[0.3em] md:tracking-[0.35em] text-gold text-[0.7rem]">
        {label}
      </span>
      <div className="w-6 md:w-8 h-px bg-gold/60" />
    </div>
  );
}

const SECS_PER_ITEM = 3.4;

export function InstagramAct({
  wrapRef,
  ruleRef,
  titleWordsRef,
  itemsRef,
  postsHeadRef,
  reelsHeadRef,
  taglineRef,
  ctaRef,
  media,
}: Props) {
  const posts = media.filter((m) => !m.isReel);
  const reels = media.filter((m) => m.isReel);
  const isEmpty = media.length === 0;

  const postsTrack = useRef<HTMLDivElement>(null);
  const reelsTrack = useRef<HTMLDivElement>(null);
  const postsTween = useRef<gsap.core.Tween | null>(null);
  const reelsTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    let ctx: gsap.Context | null = null;

    const kill = () => {
      ctx?.revert();
      ctx = null;
      postsTween.current = null;
      reelsTween.current = null;
    };

    const build = () => {
      kill();
      if (!mq.matches) return;
      ctx = gsap.context(() => {
        if (postsTrack.current && posts.length) {
          postsTween.current = gsap.fromTo(
            postsTrack.current,
            { xPercent: 0 },
            {
              xPercent: -50,
              ease: "none",
              duration: Math.max(posts.length, 1) * SECS_PER_ITEM,
              repeat: -1,
            },
          );
        }
        if (reelsTrack.current && reels.length) {
          reelsTween.current = gsap.fromTo(
            reelsTrack.current,
            { xPercent: -50 },
            {
              xPercent: 0,
              ease: "none",
              duration: Math.max(reels.length, 1) * SECS_PER_ITEM,
              repeat: -1,
            },
          );
        }
      });
    };

    build();
    mq.addEventListener("change", build);
    return () => {
      mq.removeEventListener("change", build);
      kill();
    };
  }, [posts.length, reels.length]);

  const slow = (t: React.RefObject<gsap.core.Tween | null>) => {
    if (t.current) gsap.to(t.current, { timeScale: 0, duration: 0.5, ease: "power2.out" });
  };
  const resume = (t: React.RefObject<gsap.core.Tween | null>) => {
    if (t.current) gsap.to(t.current, { timeScale: 1, duration: 0.6, ease: "power2.out" });
  };

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-10 invisible overflow-hidden bg-plum-dark text-cream"
    >
      <div className="h-full w-full flex flex-col justify-center gap-5 md:gap-9 py-8 md:py-12">
        <div className="px-6 sm:px-10 flex flex-col items-center">
          <div
            className="font-bdscript text-gold tracking-[-0.005em] text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-center leading-[1.05]"
            style={{ perspective: "1200px" }}
          >
            <Words
              words={["Studio", "on", "Instagram"]}
              refStore={titleWordsRef}
              spacing="0.2em"
            />
          </div>
          <div ref={ruleRef} className="mt-4 h-px w-16 bg-gold/50" />
        </div>

        {isEmpty && (
          <p
            ref={taglineRef}
            className="px-8 mx-auto max-w-md text-center font-sans italic text-cream/88 leading-relaxed text-sm md:text-base"
          >
            Follow along for our latest projects, process, and moments from
            the studio.
          </p>
        )}

        {posts.length > 0 && (
          <section className="w-full flex flex-col gap-3">
            <RowHeader label="Posts" headRef={postsHeadRef} />
            <div className={ROW_FRAME}>
              <div
                className={ROW_VIEWPORT}
                onMouseEnter={() => slow(postsTween)}
                onMouseLeave={() => resume(postsTween)}
              >
                <div className={FADE_L} />
                <div className={FADE_R} />
                <div ref={postsTrack} className={ROW_TRACK}>
                  {posts.map((m, i) => (
                    <Tile
                      key={m.id}
                      m={m}
                      kind="post"
                      refCb={(el) => {
                        itemsRef.current[i] = el;
                      }}
                    />
                  ))}
                  {posts.map((m) => (
                    <Tile key={`dup-${m.id}`} m={m} kind="post" duplicate />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {reels.length > 0 && (
          <section className="w-full flex flex-col gap-3">
            <RowHeader label="Reels" headRef={reelsHeadRef} />
            <div className={ROW_FRAME}>
              <div
                className={ROW_VIEWPORT}
                onMouseEnter={() => slow(reelsTween)}
                onMouseLeave={() => resume(reelsTween)}
              >
                <div className={FADE_L} />
                <div className={FADE_R} />
                <div ref={reelsTrack} className={ROW_TRACK}>
                  {reels.map((m, i) => (
                    <Tile
                      key={m.id}
                      m={m}
                      kind="reel"
                      refCb={(el) => {
                        itemsRef.current[posts.length + i] = el;
                      }}
                    />
                  ))}
                  {reels.map((m) => (
                    <Tile key={`dup-${m.id}`} m={m} kind="reel" duplicate />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <div ref={ctaRef} className="flex items-center justify-center">
          <a
            href={STUDIO.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-3 ${
              isEmpty
                ? "border border-gold/40 hover:border-gold/80 rounded-full px-6 py-3 transition-colors duration-500"
                : ""
            }`}
          >
            <FaInstagram
              className="text-gold group-hover:-translate-y-0.5 transition-transform duration-500"
              size={18}
            />
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-cream font-light group-hover:text-gold transition-colors">
              @spdesigns_official
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
