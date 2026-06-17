"use client";

import { useEffect, useState, useTransition } from "react";
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

const inputCls =
	"w-full border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold";
const labelCls =
	"font-sans font-light uppercase tracking-[0.26em] text-gold/80 text-[0.614rem] mb-1.5";

function MoveButtons({
	index,
	total,
	onMove,
}: {
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
}) {
	return (
		<div className="flex gap-1">
			<button
				type="button"
				disabled={index === 0}
				onClick={() => onMove(-1)}
				className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/60 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
				↑
			</button>
			<button
				type="button"
				disabled={index === total - 1}
				onClick={() => onMove(1)}
				className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/60 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
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
}: {
	item: Partner;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
}) {
	const router = useRouter();
	const [name, setName] = useState(item.name);
	const [logo, setLogo] = useState<string | null>(item.logo);
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");

	const save = () =>
		start(async () => {
			const res = await updatePartner(item.id, { name, logo });
			setMsg(res.error ?? "Saved");
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deletePartner(item.id);
			router.refresh();
		});

	return (
		<div className="grid grid-cols-[120px_1fr] gap-4 border border-cream/10 p-4">
			<ImageUploader
				value={logo}
				onChange={setLogo}
				folder="partners"
				aspect="aspect-square"
			/>
			<div className="flex flex-col gap-3">
				<label>
					<div className={labelCls}>Name</div>
					<input
						className={inputCls}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</label>
				<div className="mt-auto flex items-center justify-between">
					<MoveButtons index={index} total={total} onMove={onMove} />
					<div className="flex items-center gap-3">
						{msg && (
							<span className="font-sans font-light text-cream/50 text-sm">
								{msg}
							</span>
						)}
						<button
							type="button"
							onClick={remove}
							disabled={pending}
							className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/45 text-[0.649rem] hover:text-gold">
							Delete
						</button>
						<button
							type="button"
							onClick={save}
							disabled={pending}
							className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-[0.708rem] disabled:opacity-60">
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
}: {
	item: PartnerCategory;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
}) {
	const router = useRouter();
	const [category, setCategory] = useState(item.category);
	const [brandsText, setBrandsText] = useState(item.brands.join("\n"));
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");

	const save = () =>
		start(async () => {
			const brands = brandsText
				.split("\n")
				.map((b) => b.trim())
				.filter(Boolean);
			const res = await updateCategory(item.id, { category, brands });
			setMsg(res.error ?? "Saved");
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deleteCategory(item.id);
			router.refresh();
		});

	return (
		<div className="flex flex-col gap-3 border border-cream/10 p-4">
			<label>
				<div className={labelCls}>Category</div>
				<input
					className={inputCls}
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				/>
			</label>
			<label>
				<div className={labelCls}>Brands (one per line)</div>
				<textarea
					rows={4}
					className={`${inputCls} resize-none`}
					value={brandsText}
					onChange={(e) => setBrandsText(e.target.value)}
				/>
			</label>
			<div className="flex items-center justify-between">
				<MoveButtons index={index} total={total} onMove={onMove} />
				<div className="flex items-center gap-3">
					{msg && (
						<span className="font-sans font-light text-cream/50 text-sm">
							{msg}
						</span>
					)}
					<button
						type="button"
						onClick={remove}
						disabled={pending}
						className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/45 text-[0.649rem] hover:text-gold">
						Delete
					</button>
					<button
						type="button"
						onClick={save}
						disabled={pending}
						className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-[0.708rem] disabled:opacity-60">
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
	const [pending, start] = useTransition();

	useEffect(() => {
		setLogoList(logos);
	}, [logos]);
	useEffect(() => {
		setCatList(categories);
	}, [categories]);

	const moveLogo = (i: number, dir: -1 | 1) => {
		const next = [...logoList];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		setLogoList(next);
		start(async () => {
			await reorderPartners(next.map((x) => x.id));
			router.refresh();
		});
	};

	const moveCat = (i: number, dir: -1 | 1) => {
		const next = [...catList];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		setCatList(next);
		start(async () => {
			await reorderCategories(next.map((x) => x.id));
			router.refresh();
		});
	};

	return (
		<div className="flex flex-col gap-14">
			<section>
				<div className="mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/45 text-[0.684rem]">
					Brand logos
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{logoList.map((item, i) => (
						<LogoCard
							key={item.id}
							item={item}
							index={i}
							total={logoList.length}
							onMove={(dir) => moveLogo(i, dir)}
						/>
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
					className="mt-5 w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.732rem] hover:bg-gold/10 disabled:opacity-60">
					{pending ? "Adding…" : "+ Add logo"}
				</button>
			</section>

			<section>
				<div className="mb-5 font-sans font-light uppercase tracking-[0.32em] text-cream/45 text-[0.684rem]">
					Directory (categories)
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{catList.map((item, i) => (
						<CategoryCard
							key={item.id}
							item={item}
							index={i}
							total={catList.length}
							onMove={(dir) => moveCat(i, dir)}
						/>
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
					className="mt-5 w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.732rem] hover:bg-gold/10 disabled:opacity-60">
					{pending ? "Adding…" : "+ Add category"}
				</button>
			</section>
		</div>
	);
}
