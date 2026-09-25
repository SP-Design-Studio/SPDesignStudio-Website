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
import { SuggestInput } from "@/components/admin/SuggestInput";
import { ui } from "@/lib/admin/ui";
import { useFlash } from "@/lib/admin/useFlash";

const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

export function ProjectEditor({
	project,
	categories,
	suggestions,
}: {
	project: CmsProject;
	categories: ProjectCategoryRow[];
	suggestions: { types: string[]; locations: string[] };
}) {
	const router = useRouter();
	const [pending, start] = useSaving();
	const [savingMain, startSaveMain] = useSaving();

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
	const [msg, flash] = useFlash();
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
		startSaveMain(async () => {
			const res = await updateProject(project.id, {
				...form,
				location: form.location || null,
				type: form.type || null,
				year: form.year || null,
				blurb: form.blurb || null,
			});
			flash(res.error ?? "Saved");
			if (!res.error) markSaved();
			router.refresh();
		});

	return (
		<div className="flex flex-col gap-14">
			<section data-busy={savingMain || undefined}>
				<div className={ui.sectionTitle}>Details</div>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-[200px_1fr]">
					<ImageUploader
						value={form.img}
						onChange={(url) => set("img", url)}
						folder="projects"
						aspect="aspect-[3/4]"
					/>
					<div className="flex flex-col gap-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<label>
								<div className={ui.label}>Title</div>
								<input
									className={ui.input}
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
								<div className={ui.label}>Slug (URL)</div>
								<input
									className={`${ui.input} cursor-not-allowed text-cream/80`}
									value={form.slug}
									disabled
									aria-readonly="true"
								/>
								<span className="mt-1 block font-sans font-light text-cream/80 text-tiny">
									Auto-generated from the title.
								</span>
							</label>
							<label>
								<div className={ui.label}>Location</div>
								<SuggestInput
									value={form.location}
									onChange={(v) => set("location", v)}
									options={suggestions.locations}
									ariaLabel="Location"
								/>
							</label>
							<label>
								<div className={ui.label}>Type label</div>
								<SuggestInput
									value={form.type}
									onChange={(v) => set("type", v)}
									options={suggestions.types}
									ariaLabel="Type"
								/>
							</label>
							<label>
								<div className={ui.label}>Category</div>
								<select
									className={`${ui.input} cursor-pointer`}
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
								<div className={ui.label}>Delivery</div>
								<select
									className={`${ui.input} cursor-pointer`}
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
								<div className={ui.label}>Year</div>
								<input
									className={ui.input}
									value={form.year}
									onChange={(e) => set("year", e.target.value)}
								/>
							</label>
						</div>
						<label>
							<div className={ui.label}>Blurb</div>
							<textarea
								rows={3}
								className={`${ui.input} resize-none`}
								value={form.blurb}
								onChange={(e) => set("blurb", e.target.value)}
							/>
						</label>
						<div className="flex items-center gap-4">
							<button
								type="button"
								onClick={saveMain}
								disabled={pending || savingMain || !dirty}
								className="cta-gold cursor-pointer bg-gold px-7 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-tiny disabled:opacity-60">
								{savingMain ? "Saving…" : "Save details"}
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
				<div className={ui.sectionTitle}>Key facts</div>
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
					className="mt-4 w-fit cursor-pointer border border-gold/40 px-6 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60">
					{pending ? "Adding…" : "+ Add fact"}
				</button>
			</section>

			<section>
				<div className={ui.sectionTitle}>Gallery</div>
				<p className="mb-4 max-w-2xl font-sans font-light text-cream/80 text-tiny">
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
								<span className="font-sans font-light text-cream/60 text-micro">
									{ratioLabel(g.aspect)}
								</span>
								<div className="flex gap-1">
									<button
										aria-label="Move left"
										type="button"
										disabled={i === 0 || pending}
										onClick={() => moveGallery(i, -1)}
										className="cursor-pointer border border-cream/20 px-1.5 py-0.5 text-cream/82 text-tiny disabled:opacity-30 hover:border-gold hover:text-gold">
										←
									</button>
									<button
										aria-label="Move right"
										type="button"
										disabled={i === gallery.length - 1 || pending}
										onClick={() => moveGallery(i, 1)}
										className="cursor-pointer border border-cream/20 px-1.5 py-0.5 text-cream/82 text-tiny disabled:opacity-30 hover:border-gold hover:text-gold">
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
						multiple
					/>
					<p className="mt-2 font-sans font-light text-cream/80 text-tiny">
						Select several images at once — you&rsquo;ll crop each in turn.
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
		<div data-busy={pending || undefined} className="flex items-end gap-3">
			<label className="flex-1">
				<div className={ui.label}>Label</div>
				<input className={ui.input} value={l} onChange={(e) => setL(e.target.value)} />
			</label>
			<label className="flex-1">
				<div className={ui.label}>Value</div>
				<input className={ui.input} value={v} onChange={(e) => setV(e.target.value)} />
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
				className="cta-gold cursor-pointer bg-gold px-4 py-2 font-sans font-light uppercase tracking-[0.2em] text-plum-dark text-tiny disabled:opacity-60">
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
