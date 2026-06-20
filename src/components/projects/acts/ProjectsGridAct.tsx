import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/lib/data/projects";

type IndexedProject = Project & { _i: number };

interface Props {
  countRef: React.RefObject<HTMLDivElement | null>;
  stripRef: React.RefObject<HTMLDivElement | null>;
  slotRef: React.RefObject<HTMLDivElement | null>;
  projects: IndexedProject[];
  onOpen: (id: string) => void;
}

export function ProjectsGridAct({
  countRef,
  stripRef,
  slotRef,
  projects,
  onOpen,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;

      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative min-h-dvh flex flex-col">
      <div className="h-24 md:h-28 shrink-0" />
      <div ref={slotRef} className="h-12 shrink-0" />
      <div className="flex-1 flex flex-col justify-start md:justify-center pb-12 md:pb-16">
        <div
          ref={countRef}
          className="px-6 md:px-14 mb-5 md:mb-7 flex items-center justify-between text-cream/90 font-sans font-normal text-[0.72rem] md:text-[0.78rem] uppercase tracking-[0.3em] will-change-transform"
        >
          <span>{projects.length.toString().padStart(2, "0")} Projects</span>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-1 hover:text-gold transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-gold"
              aria-label="Scroll left"
            >
              &larr;
            </button>
            <span>Scroll horizontally</span>
            <button
              onClick={() => scroll("right")}
              className="p-1 hover:text-gold transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-gold"
              aria-label="Scroll right"
            >
              &rarr;
            </button>
          </div>

          <span className="md:hidden">Selected</span>
        </div>

        <div
          ref={scrollContainerRef}
          className="no-scrollbar overflow-visible px-6 md:overflow-x-auto md:px-14"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            ref={stripRef}
            className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 md:flex md:w-max md:gap-7 md:gap-y-0 pb-2"
          >
            {projects.map((project) => (
              <article
                key={project.id}
                data-pid={project.id}
                onClick={() => onOpen(project.id)}
                className="pc group relative w-full md:shrink-0 md:w-60 lg:w-75 cursor-pointer"
              >
                <div className="pc-copy flex items-center justify-between mb-3 md:mb-4 font-sans font-normal uppercase tracking-[0.32em] text-[0.72rem] md:text-[0.78rem] will-change-transform">
                  <span className="text-cream/85">{project.type}</span>
                </div>

                <div
                  className="pc-media relative w-full h-[34vh] sm:h-[38vh] md:h-[clamp(200px,42vh,420px)] overflow-hidden rounded-sm will-change-[clip-path]"
                  style={{ clipPath: "inset(0% 0% 0% 0% round 0.125rem)" }}
                >
                  <div className="pc-media-inner absolute inset-0 will-change-transform">
                    {project.img && (
                      <Image
                        src={project.img}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, (max-width: 1024px) 240px, 300px"
                        className="object-cover transition-transform duration-1100 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-plum-dark/65 via-plum-dark/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute top-3 left-3 z-10 w-fit rounded-[3px] bg-plum-dark/55 backdrop-blur-sm px-2.5 py-1 font-sans font-normal uppercase tracking-[0.3em] text-gold text-[0.6rem]">
                    {project.delivery === "renovation" ? "Renovation" : "Turnkey"}
                  </span>
                </div>

                <div className="pc-copy mt-4 md:mt-5 will-change-transform">
                  <div className="flex items-center gap-2 font-serif font-light text-cream text-xl md:text-2xl leading-tight tracking-[-0.01em] transition-colors duration-500 group-hover:text-gold">
                    {project.title}
                    <span className="text-gold opacity-0 -translate-x-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0">
                      &#8599;
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="h-px w-5 bg-cream/20 transition-all duration-500 group-hover:w-10 group-hover:bg-gold" />
                    <span className="font-sans font-normal text-cream/85 text-[0.76rem] md:text-[0.8rem] uppercase tracking-[0.22em] truncate">
                      {project.location}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
