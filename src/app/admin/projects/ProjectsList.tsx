"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { CmsProject } from "@/lib/cms/types";
import { createProject, deleteProject, reorderProjects } from "./actions";

export function ProjectsList({ initial }: { initial: CmsProject[] }) {
	const router = useRouter();
	const [list, setList] = useState(initial);
	const [pending, start] = useTransition();

	useEffect(() => {
		setList(initial);
	}, [initial]);

	const move = (i: number, dir: -1 | 1) => {
		const next = [...list];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		setList(next);
		start(async () => {
			await reorderProjects(next.map((x) => x.id));
			router.refresh();
		});
	};

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
		<div className="flex flex-col gap-3">
			{list.map((p, i) => (
				<div
					key={p.id}
					className="flex items-center gap-4 border border-cream/10 p-3">
					<div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-plum-dark">
						{p.img && (
							<Image src={p.img} alt="" fill sizes="96px" className="object-cover" />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<div className="font-serif font-light text-cream text-xl leading-tight">
							{p.title}
						</div>
						<div className="font-sans font-light text-cream/40 text-[0.732rem] uppercase tracking-[0.2em]">
							{p.category} · /{p.slug}
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							disabled={i === 0}
							onClick={() => move(i, -1)}
							className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/60 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
							↑
						</button>
						<button
							type="button"
							disabled={i === list.length - 1}
							onClick={() => move(i, 1)}
							className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/60 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
							↓
						</button>
						<button
							type="button"
							onClick={() => remove(p.id)}
							disabled={pending}
							className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/45 text-[0.649rem] hover:text-gold">
							Delete
						</button>
						<Link
							href={`/admin/projects/${p.id}`}
							className="cta-gold bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-[0.708rem]">
							Edit
						</Link>
					</div>
				</div>
			))}
			<button
				type="button"
				disabled={pending}
				onClick={add}
				className="mt-2 w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.732rem] hover:bg-gold/10 disabled:opacity-60">
				+ Add project
			</button>
		</div>
	);
}
