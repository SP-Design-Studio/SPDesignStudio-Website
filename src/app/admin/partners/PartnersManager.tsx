"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Partner, PartnerCategory } from "@/lib/cms/types";
import {
	createPartner,
	updatePartner,
	deletePartner,
	reorderPartners,
	createCategory,
	updateCategory,
	deleteCategory,
	reorderCategories,
} from "./actions";
import { ui } from "@/lib/admin/ui";
import { SearchBox } from "@/components/admin/SearchBox";
import { DragHandle } from "@/components/admin/DragHandle";
import { useSearch } from "@/lib/admin/useSearch";
import { useDragReorder } from "@/lib/admin/useDragReorder";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { useFlash } from "@/lib/admin/useFlash";

function MoveButtons({
	index,
	total,
	onMove,
	reorderable = true,
	label,
}: {
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
	reorderable?: boolean;
	label: string;
}) {
	return (
		<div className="flex items-center gap-1">
			{reorderable && <DragHandle label={label} />}
			<button
				aria-label="Move up"
				type="button"
				disabled={index === 0 || !reorderable}
				onClick={() => onMove(-1)}
				className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
				↑
			</button>
			<button
				aria-label="Move down"
				type="button"
				disabled={index === total - 1 || !reorderable}
				onClick={() => onMove(1)}
				className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
				↓
			</button>
		</div>
	);
}

function LogoCard({
	item,
	index,
	total,
	onMove,
	reorderable = true,
}: {
	item: Partner;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
	reorderable?: boolean;
}) {
	const router = useRouter();
	const [name, setName] = useState(item.name);
	const [logo, setLogo] = useState<string | null>(item.logo);
	const [pending, start] = useSaving();
	const [msg, flash] = useFlash();

	const save = () =>
		start(async () => {
			const res = await updatePartner(item.id, { name, logo });
			flash(res.error ?? "Saved");
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deletePartner(item.id);
			router.refresh();
		});

	return (
		<div data-busy={pending || undefined} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 rounded-sm border border-cream/10 bg-plum/20 p-4 transition-colors hover:border-cream/25">
			<ImageUploader
				value={logo}
				onChange={setLogo}
				folder="partners"
				aspect="aspect-square"
			/>
			<div className="flex flex-col gap-3">
				<label>
					<div className={ui.label}>Name</div>
					<input
						className={ui.input}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</label>
				<div className="mt-auto flex items-center justify-between">
					<MoveButtons
						index={index}
						total={total}
						onMove={onMove}
						reorderable={reorderable}
						label="logo"
					/>
					<div className="flex items-center gap-3">
						{msg && (
							<span className="font-sans font-light text-cream/80 text-sm">
								{msg}
							</span>
						)}
						<ConfirmButton
							label="Delete"
							onConfirm={remove}
							disabled={pending}
						/>
						<button
							type="button"
							onClick={save}
							disabled={pending}
							className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-tiny disabled:opacity-60">
							{pending ? "…" : "Save"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function CategoryCard({
	item,
	index,
	total,
	onMove,
	reorderable = true,
}: {
	item: PartnerCategory;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
	reorderable?: boolean;
}) {
	const router = useRouter();
	const [category, setCategory] = useState(item.category);
	const [brandsText, setBrandsText] = useState(item.brands.join("\n"));
	const [pending, start] = useSaving();
	const [msg, flash] = useFlash();

	const save = () =>
		start(async () => {
			const brands = brandsText
				.split("\n")
				.map((b) => b.trim())
				.filter(Boolean);
			const res = await updateCategory(item.id, { category, brands });
			flash(res.error ?? "Saved");
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deleteCategory(item.id);
			router.refresh();
		});

	return (
		<div data-busy={pending || undefined} className="flex flex-col gap-3 rounded-sm border border-cream/10 bg-plum/20 p-4 transition-colors hover:border-cream/25">
			<label>
				<div className={ui.label}>Category</div>
				<input
					className={ui.input}
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				/>
			</label>
			<label>
				<div className={ui.label}>Brands (one per line)</div>
				<textarea
					rows={4}
					className={`${ui.input} resize-none`}
					value={brandsText}
					onChange={(e) => setBrandsText(e.target.value)}
				/>
			</label>
			<div className="flex items-center justify-between">
				<MoveButtons
					index={index}
					total={total}
					onMove={onMove}
					reorderable={reorderable}
					label="category"
				/>
				<div className="flex items-center gap-3">
					{msg && (
						<span className="font-sans font-light text-cream/80 text-sm">
							{msg}
						</span>
					)}
					<ConfirmButton
						label="Delete"
						onConfirm={remove}
						disabled={pending}
					/>
					<button
						type="button"
						onClick={save}
						disabled={pending}
						className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-tiny disabled:opacity-60">
						{pending ? "…" : "Save"}
					</button>
				</div>
			</div>
		</div>
	);
}

export function PartnersManager({
	logos,
	categories,
}: {
	logos: Partner[];
	categories: PartnerCategory[];
}) {
	const router = useRouter();
	const [logoList, setLogoList] = useState(logos);
	const [catList, setCatList] = useState(categories);
	const [pending, start] = useSaving();

	useEffect(() => {
		setLogoList(logos);
	}, [logos]);
	useEffect(() => {
		setCatList(categories);
	}, [categories]);

	const persistLogos = (next: Partner[]) => {
		setLogoList(next);
		start(async () => {
			await reorderPartners(next.map((x) => x.id));
			router.refresh();
		});
	};

	const moveLogo = (i: number, dir: -1 | 1) => {
		const next = [...logoList];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		persistLogos(next);
	};

	const logoSearch = useSearch(logoList, (l) => [l.name]);
	const logoDrag = useDragReorder(logoList, persistLogos);

	const persistCats = (next: PartnerCategory[]) => {
		setCatList(next);
		start(async () => {
			await reorderCategories(next.map((x) => x.id));
			router.refresh();
		});
	};

	const moveCat = (i: number, dir: -1 | 1) => {
		const next = [...catList];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		persistCats(next);
	};

	const catSearch = useSearch(catList, (c) => [c.category, ...c.brands]);
	const catDrag = useDragReorder(catList, persistCats);

	return (
		<div className="flex flex-col gap-14">
			<section>
				<div className="mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-tiny">
					Brand logos
				</div>
				{logoList.length > 4 && (
					<SearchBox
						value={logoSearch.q}
						onChange={logoSearch.setQ}
						shown={logoSearch.shown.length}
						total={logoList.length}
						noun="logos"
						placeholder="Search partner name…"
					/>
				)}
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{logoSearch.active && logoSearch.shown.length === 0 && (
						<p className="rounded-sm border border-dashed border-cream/15 px-4 py-8 text-center font-sans font-light text-cream/80 text-tiny">
							No logos match &ldquo;{logoSearch.q.trim()}&rdquo;.
						</p>
					)}
					{logoSearch.shown.map((item, i) => (
						<div
							key={item.id}
							{...(logoSearch.active ? {} : logoDrag.handlers(i))}
							className={logoSearch.active ? "" : logoDrag.itemClass(i)}>
							<LogoCard
								item={item}
								index={i}
								total={logoList.length}
								reorderable={!logoSearch.active}
								onMove={(dir) => moveLogo(i, dir)}
							/>
						</div>
					))}
				</div>
				<button
					type="button"
					disabled={pending}
					onClick={() =>
						start(async () => {
							await createPartner();
							router.refresh();
						})
					}
					className="mt-5 w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60">
					{pending ? "Adding…" : "+ Add logo"}
				</button>
			</section>

			<section>
				<div className="mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/80 text-tiny">
					Directory (categories)
				</div>
				{catList.length > 4 && (
					<SearchBox
						value={catSearch.q}
						onChange={catSearch.setQ}
						shown={catSearch.shown.length}
						total={catList.length}
						noun="categories"
						placeholder="Search category or brand…"
					/>
				)}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{catSearch.active && catSearch.shown.length === 0 && (
						<p className="rounded-sm border border-dashed border-cream/15 px-4 py-8 text-center font-sans font-light text-cream/80 text-tiny">
							No categories match &ldquo;{catSearch.q.trim()}&rdquo;.
						</p>
					)}
					{catSearch.shown.map((item, i) => (
						<div
							key={item.id}
							{...(catSearch.active ? {} : catDrag.handlers(i))}
							className={catSearch.active ? "" : catDrag.itemClass(i)}>
							<CategoryCard
								item={item}
								index={i}
								total={catList.length}
								reorderable={!catSearch.active}
								onMove={(dir) => moveCat(i, dir)}
							/>
						</div>
					))}
				</div>
				<button
					type="button"
					disabled={pending}
					onClick={() =>
						start(async () => {
							await createCategory();
							router.refresh();
						})
					}
					className="mt-5 w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60">
					{pending ? "Adding…" : "+ Add category"}
				</button>
			</section>
		</div>
	);
}
