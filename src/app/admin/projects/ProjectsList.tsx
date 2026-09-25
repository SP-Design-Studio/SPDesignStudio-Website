"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { CmsProject } from "@/lib/cms/types";
import { createProject, deleteProject, reorderProjects } from "./actions";
import { ui } from "@/lib/admin/ui";
import { SearchBox } from "@/components/admin/SearchBox";
import { DragHandle } from "@/components/admin/DragHandle";
import { useSearch } from "@/lib/admin/useSearch";
import { useDragReorder } from "@/lib/admin/useDragReorder";

export function ProjectsList({ initial }: { initial: CmsProject[] }) {
	const router = useRouter();
	const [list, setList] = useState(initial);
	const [pending, start] = useSaving();
	const search = useSearch(list, (p) => [p.title, p.location, p.type, p.category]);
	const term = search.active ? search.q : "";
	const shown = search.shown;

	useEffect(() => {
		setList(initial);
	}, [initial]);

	const persist = (next: CmsProject[]) => {
		setList(next);
		start(async () => {
			await reorderProjects(next.map((x) => x.id));
			router.refresh();
		});
	};

	const move = (i: number, dir: -1 | 1) => {
		const next = [...list];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		persist(next);
	};

	const drag = useDragReorder(list, persist);

	const add = () =>
		start(async () => {
			const res = await createProject();
			if (res.id) router.push(`/admin/projects/${res.id}`);
			else router.refresh();
		});

	const remove = (id: string) =>
		start(async () => {
			if (!confirm("Delete this project and its facts/gallery?")) return;
			await deleteProject(id);
			router.refresh();
		});

	return (
		<div data-busy={pending || undefined} className="flex flex-col gap-3">
			{list.length > 4 && (
				<SearchBox
					value={search.q}
					onChange={search.setQ}
					shown={shown.length}
					total={list.length}
					noun="projects"
					placeholder="Search title, location, type…"
				/>
			)}
			{term && shown.length === 0 && (
				<p className="rounded-sm border border-dashed border-cream/15 px-4 py-8 text-center font-sans font-light text-cream/80 text-tiny">
					No projects match &ldquo;{search.q.trim()}&rdquo;.
				</p>
			)}
			{shown.map((p, i) => (
				<div
					key={p.id}
					{...(term ? {} : drag.handlers(i))}
					className={`flex items-center gap-4 rounded-sm border border-cream/10 bg-plum/20 p-3 transition-colors hover:border-cream/25 ${term ? "" : drag.itemClass(i)}`}>
					<div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-plum-dark">
						{p.img && (
							<Image src={p.img} alt="" fill sizes="96px" className="object-cover" />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<div className="font-serif font-light text-cream text-xl leading-tight">
							{p.title}
						</div>
						<div className="font-sans font-light text-cream/82 text-tiny uppercase tracking-[0.2em]">
							{p.category} / {p.slug}
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							aria-label="Move up"
							type="button"
							disabled={i === 0 || !!term}
							onClick={() => move(i, -1)}
							className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
							↑
						</button>
						<button
							aria-label="Move down"
							type="button"
							disabled={i === list.length - 1 || !!term}
							onClick={() => move(i, 1)}
							className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
							↓
						</button>
						<button
							type="button"
							onClick={() => remove(p.id)}
							disabled={pending}
							className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-tiny hover:text-gold">
							Delete
						</button>
						<Link
							href={`/admin/projects/${p.id}`}
							className="cta-gold bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-tiny">
							Edit
						</Link>
					</div>
				</div>
			))}
			<button
				type="button"
				disabled={pending}
				onClick={add}
				className="mt-2 w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60">
				{pending ? "Adding…" : "+ Add project"}
			</button>
		</div>
	);
}
