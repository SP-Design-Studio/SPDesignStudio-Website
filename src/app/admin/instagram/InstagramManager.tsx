"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { InstagramPost } from "@/lib/cms/types";
import { createPost, updatePost, deletePost, reorderPosts } from "./actions";

const inputCls =
	"w-full border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold";
const labelCls =
	"font-sans font-light uppercase tracking-[0.26em] text-gold text-[0.614rem] mb-1.5";

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
				className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
				↑
			</button>
			<button
				type="button"
				disabled={index === total - 1}
				onClick={() => onMove(1)}
				className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold">
				↓
			</button>
		</div>
	);
}

function PostCard({
	item,
	index,
	total,
	onMove,
}: {
	item: InstagramPost;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
}) {
	const router = useRouter();
	const [image, setImage] = useState<string | null>(item.image);
	const [permalink, setPermalink] = useState(item.permalink);
	const [caption, setCaption] = useState(item.caption);
	const [isReel, setIsReel] = useState(item.is_reel);
	const [pending, start] = useSaving();
	const [msg, setMsg] = useState("");

	const save = () =>
		start(async () => {
			const res = await updatePost(item.id, {
				image,
				permalink,
				caption,
				is_reel: isReel,
			});
			setMsg(res.error ?? "Saved");
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deletePost(item.id);
			router.refresh();
		});

	return (
		<div className="grid grid-cols-[130px_1fr] gap-4 border border-cream/10 p-4">
			<ImageUploader
				value={image}
				onChange={setImage}
				folder="instagram"
				aspect={isReel ? "aspect-[9/16]" : "aspect-square"}
			/>
			<div className="flex flex-col gap-3">
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setIsReel(false)}
						className={`flex-1 cursor-pointer border px-3 py-1.5 font-sans font-light uppercase tracking-[0.2em] text-[0.6rem] transition-colors ${
							!isReel
								? "border-gold bg-gold/10 text-gold"
								: "border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
						}`}>
						Post
					</button>
					<button
						type="button"
						onClick={() => setIsReel(true)}
						className={`flex-1 cursor-pointer border px-3 py-1.5 font-sans font-light uppercase tracking-[0.2em] text-[0.6rem] transition-colors ${
							isReel
								? "border-gold bg-gold/10 text-gold"
								: "border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
						}`}>
						Reel
					</button>
				</div>
				<label>
					<div className={labelCls}>Link to post</div>
					<input
						className={inputCls}
						value={permalink}
						placeholder="https://www.instagram.com/p/…"
						onChange={(e) => setPermalink(e.target.value)}
					/>
				</label>
				<label>
					<div className={labelCls}>Caption (optional)</div>
					<input
						className={inputCls}
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
					/>
				</label>
				<div className="mt-auto flex items-center justify-between">
					<MoveButtons index={index} total={total} onMove={onMove} />
					<div className="flex items-center gap-3">
						{msg && (
							<span className="font-sans font-light text-cream/80 text-sm">
								{msg}
							</span>
						)}
						<button
							type="button"
							onClick={remove}
							disabled={pending}
							className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-[0.649rem] hover:text-gold">
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

export function InstagramManager({ posts }: { posts: InstagramPost[] }) {
	const router = useRouter();
	const [list, setList] = useState(posts);
	const [pending, start] = useSaving();

	useEffect(() => {
		setList(posts);
	}, [posts]);

	const move = (i: number, dir: -1 | 1) => {
		const next = [...list];
		const j = i + dir;
		if (j < 0 || j >= next.length) return;
		[next[i], next[j]] = [next[j], next[i]];
		setList(next);
		start(async () => {
			await reorderPosts(next.map((x) => x.id));
			router.refresh();
		});
	};

	return (
		<div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{list.map((item, i) => (
					<PostCard
						key={item.id}
						item={item}
						index={i}
						total={list.length}
						onMove={(dir) => move(i, dir)}
					/>
				))}
			</div>
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						await createPost();
						router.refresh();
					})
				}
				className="mt-5 w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.732rem] hover:bg-gold/10 disabled:opacity-60">
				{pending ? "Adding…" : "+ Add post"}
			</button>
		</div>
	);
}
