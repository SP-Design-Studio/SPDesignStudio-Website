"use client";
import { useSaving } from "@/lib/admin/saving";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { CmsProject, ProjectCategoryRow } from "@/lib/cms/types";
import {
	updateProject,
	addFact,
	updateFact,
	deleteFact,
	addGalleryImage,
	updateGalleryImage,
	deleteGalleryImage,
	reorderGallery,
} from "../actions";
import { useDirty } from "@/lib/admin/useDirty";
import { ratioLabel } from "@/lib/aspect";

const inputCls =
	"w-full border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold";
const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
const labelCls =
	"font-sans font-light uppercase tracking-[0.26em] text-gold text-[0.614rem] mb-1.5";
const sectionCls =
	"font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-[0.684rem] mb-5";


export function ProjectEditor({
	project,
	categories,
}: {
	project: CmsProject;
	categories: ProjectCategoryRow[];
}) {
	const router = useRouter();
	const [pending, start] = useSaving();

	const [form, setForm] = useState({
		slug: project.slug,
		title: project.title,
		location: project.location ?? "",
		type: project.type ?? "",
		category: project.category,
		delivery: project.delivery,
		year: project.year ?? "",
		blurb: project.blurb ?? "",
		img: project.img,
	});
	const [msg, setMsg] = useState("");
	const { dirty, markSaved } = useDirty(form);
	const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
		setForm((f) => ({ ...f, [k]: v }));

	const facts = project.facts ?? [];
	const gallery = project.gallery ?? [];

	const moveGallery = (i: number, dir: -1 | 1) => {
		const next = [...gallery];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j]!, next[i]!];
		start(async () => {
			await reorderGallery(
				project.id,
				next.map((g) => g.id),
			);
			router.refresh();
		});
	};

	const saveMain = () =>
		start(async () => {
			const res = await updateProject(project.id, {
				...form,
				location: form.location || null,
				type: form.type || null,
				year: form.year || null,
				blurb: form.blurb || null,
			});
			setMsg(res.error ?? "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});

	return (
		<div className="flex flex-col gap-14">
			<section>
				<div className={sectionCls}>Details</div>
				<div className="grid grid-cols-1 gap-5 md:grid-cols-[200px_1fr]">
					<ImageUploader
						value={form.img}
						onChange={(url) => set("img", url)}
						folder="projects"
						aspect="aspect-[3/4]"
					/>
					<div className="flex flex-col gap-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<label>
								<div className={labelCls}>Title</div>
								<input
									className={inputCls}
									value={form.title}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											title: e.target.value,
											slug: slugify(e.target.value),
										}))
									}
								/>
							</label>
							<label>
								<div className={labelCls}>Slug (URL)</div>
								<input
									className={`${inputCls} cursor-not-allowed text-cream/80`}
									value={form.slug}
									disabled
									aria-readonly="true"
								/>
								<span className="mt-1 block font-sans font-light text-cream/80 text-[0.684rem]">
									Auto-generated from the title.
								</span>
							</label>
							<label>
								<div className={labelCls}>Location</div>
								<input
									className={inputCls}
									value={form.location}
									onChange={(e) => set("location", e.target.value)}
								/>
							</label>
							<label>
								<div className={labelCls}>Type label</div>
								<input
									className={inputCls}
									value={form.type}
									placeholder="Residential / Studio / …"
									onChange={(e) => set("type", e.target.value)}
								/>
							</label>
							<label>
								<div className={labelCls}>Category</div>
								<select
									className={`${inputCls} cursor-pointer`}
									value={form.category}
									onChange={(e) =>
										set("category", e.target.value)
									}>
									{categories.length === 0 && (
										<option value={form.category} className="bg-plum-dark">
											{form.category || "—"}
										</option>
									)}
									{categories.map((c) => (
										<option
											key={c.id}
											value={c.slug}
											className="bg-plum-dark">
											{c.label}
										</option>
									))}
								</select>
							</label>
							<label>
								<div className={labelCls}>Delivery</div>
								<select
									className={`${inputCls} cursor-pointer`}
									value={form.delivery}
									onChange={(e) =>
										set("delivery", e.target.value as typeof form.delivery)
									}>
									<option value="turnkey" className="bg-plum-dark">
										Turnkey
									</option>
									<option value="renovation" className="bg-plum-dark">
										Renovation
									</option>
									<option value="design-consultation" className="bg-plum-dark">
										Design consultation
									</option>
								</select>
							</label>
							<label>
								<div className={labelCls}>Year</div>
								<input
									className={inputCls}
									value={form.year}
									onChange={(e) => set("year", e.target.value)}
								/>
							</label>
						</div>
						<label>
							<div className={labelCls}>Blurb</div>
							<textarea
								rows={3}
								className={`${inputCls} resize-none`}
								value={form.blurb}
								onChange={(e) => set("blurb", e.target.value)}
							/>
						</label>
						<div className="flex items-center gap-4">
							<button
								type="button"
								onClick={saveMain}
								disabled={pending || !dirty}
								className="cta-gold cursor-pointer bg-gold px-7 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-[0.732rem] disabled:opacity-60">
								{pending ? "Saving…" : "Save details"}
							</button>
							{msg && (
								<span className="font-sans font-light text-cream/80 text-base">
									{msg}
								</span>
							)}
						</div>
					</div>
				</div>
			</section>

			<section>
				<div className={sectionCls}>Key facts</div>
				<div className="flex flex-col gap-3">
					{facts.map((f) => (
						<FactRow key={f.id} projectId={project.id} id={f.id} label={f.label} value={f.value} />
					))}
				</div>
				<button
					type="button"
					disabled={pending}
					onClick={() =>
						start(async () => {
							await addFact(project.id);
							router.refresh();
						})
					}
					className="mt-4 w-fit cursor-pointer border border-gold/40 px-6 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.708rem] hover:bg-gold/10 disabled:opacity-60">
					{pending ? "Adding…" : "+ Add fact"}
				</button>
			</section>

			<section>
				<div className={sectionCls}>Gallery</div>
				<p className="mb-4 max-w-2xl font-sans font-light text-cream/80 text-[0.732rem]">
					Each image keeps its own crop ratio — pick 4:3, 16:9, 21:10 or any
					other when cropping, and the project page lays the gallery out to
					match. Hover an image to crop, replace, or remove it.
				</p>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
					{gallery.map((g, i) => (
						<div key={g.id} className="flex flex-col gap-2">
							<ImageUploader
								value={g.url}
								onChange={(url, meta) =>
									start(async () => {
										if (url)
											await updateGalleryImage(
												g.id,
												project.id,
												url,
												meta?.aspect,
											);
										else await deleteGalleryImage(g.id, project.id);
										router.refresh();
									})
								}
								folder="projects"
								aspect={g.aspect ?? 4 / 3}
							/>
							<div className="flex items-center justify-between">
								<span className="font-sans font-light text-cream/60 text-[0.62rem]">
									{ratioLabel(g.aspect)}
								</span>
								<div className="flex gap-1">
									<button
										type="button"
										disabled={i === 0 || pending}
										onClick={() => moveGallery(i, -1)}
										className="cursor-pointer border border-cream/20 px-1.5 py-0.5 text-cream/82 text-[0.7rem] disabled:opacity-30 hover:border-gold hover:text-gold">
										←
									</button>
									<button
										type="button"
										disabled={i === gallery.length - 1 || pending}
										onClick={() => moveGallery(i, 1)}
										className="cursor-pointer border border-cream/20 px-1.5 py-0.5 text-cream/82 text-[0.7rem] disabled:opacity-30 hover:border-gold hover:text-gold">
										→
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="mt-4 max-w-xs">
					<ImageUploader
						value={null}
						onChange={(url, meta) => {
							if (!url) return;
							start(async () => {
								await addGalleryImage(project.id, url, meta?.aspect);
								router.refresh();
							});
						}}
						folder="projects"
						aspect="aspect-[4/3]"
					/>
					<p className="mt-2 font-sans font-light text-cream/80 text-[0.732rem]">
						Upload to add a gallery image.
					</p>
				</div>
			</section>
		</div>
	);
}

function FactRow({
	projectId,
	id,
	label,
	value,
}: {
	projectId: string;
	id: string;
	label: string;
	value: string;
}) {
	const router = useRouter();
	const [l, setL] = useState(label);
	const [v, setV] = useState(value);
	const [pending, start] = useSaving();

	return (
		<div className="flex items-end gap-3">
			<label className="flex-1">
				<div className={labelCls}>Label</div>
				<input className={inputCls} value={l} onChange={(e) => setL(e.target.value)} />
			</label>
			<label className="flex-1">
				<div className={labelCls}>Value</div>
				<input className={inputCls} value={v} onChange={(e) => setV(e.target.value)} />
			</label>
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						await updateFact(id, projectId, { label: l, value: v });
						router.refresh();
					})
				}
				className="cta-gold cursor-pointer bg-gold px-4 py-2 font-sans font-light uppercase tracking-[0.2em] text-plum-dark text-[0.649rem] disabled:opacity-60">
				Save
			</button>
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						await deleteFact(id, projectId);
						router.refresh();
					})
				}
				className="cursor-pointer border border-cream/20 px-3 py-2 text-cream/82 text-sm hover:border-gold hover:text-gold">
				×
			</button>
		</div>
	);
}
