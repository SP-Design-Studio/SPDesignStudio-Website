"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { InstagramPost } from "@/lib/cms/types";
import { createPost, updatePost, deletePost, reorderPosts } from "./actions";
import { ui } from "@/lib/admin/ui";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { useFlash } from "@/lib/admin/useFlash";
import { EmptyState } from "@/components/admin/EmptyState";
import { SearchBox } from "@/components/admin/SearchBox";
import { DragHandle } from "@/components/admin/DragHandle";
import { useSearch } from "@/lib/admin/useSearch";
import { useDragReorder } from "@/lib/admin/useDragReorder";

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

function PostCard({
	item,
	index,
	total,
	onMove,
	reorderable = true,
}: {
	item: InstagramPost;
	index: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
	reorderable?: boolean;
}) {
	const router = useRouter();
	const [image, setImage] = useState<string | null>(item.image);
	const [permalink, setPermalink] = useState(item.permalink);
	const [caption, setCaption] = useState(item.caption);
	const [isReel, setIsReel] = useState(item.is_reel);
	const [pending, start] = useSaving();
	const [msg, flash] = useFlash();

	const save = () =>
		start(async () => {
			const res = await updatePost(item.id, {
				image,
				permalink,
				caption,
				is_reel: isReel,
			});
			flash(res.error ?? "Saved");
			router.refresh();
		});
	const remove = () =>
		start(async () => {
			await deletePost(item.id);
			router.refresh();
		});

	return (
		<div data-busy={pending || undefined} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 rounded-sm border border-cream/10 bg-plum/20 p-4 transition-colors hover:border-cream/25">
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
						className={`flex-1 cursor-pointer border px-3 py-1.5 font-sans font-light uppercase tracking-[0.2em] text-micro transition-colors ${
							!isReel
								? "border-gold bg-gold/10 text-gold"
								: "border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
						}`}>
						Post
					</button>
					<button
						type="button"
						onClick={() => setIsReel(true)}
						className={`flex-1 cursor-pointer border px-3 py-1.5 font-sans font-light uppercase tracking-[0.2em] text-micro transition-colors ${
							isReel
								? "border-gold bg-gold/10 text-gold"
								: "border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
						}`}>
						Reel
					</button>
				</div>
				<label>
					<div className={ui.label}>Link to post</div>
					<input
						className={ui.input}
						value={permalink}
						placeholder="https://www.instagram.com/p/…"
						onChange={(e) => setPermalink(e.target.value)}
					/>
				</label>
				<label>
					<div className={ui.label}>Caption (optional)</div>
					<input
						className={ui.input}
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
					/>
				</label>
				<div className="mt-auto flex items-center justify-between">
					<MoveButtons
						index={index}
						total={total}
						onMove={onMove}
						reorderable={reorderable}
						label="post"
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

export function InstagramManager({ posts }: { posts: InstagramPost[] }) {
	const router = useRouter();
	const [list, setList] = useState(posts);
	const [pending, start] = useSaving();

	useEffect(() => {
		setList(posts);
	}, [posts]);

	const persist = (next: InstagramPost[]) => {
		setList(next);
		start(async () => {
			await reorderPosts(next.map((x) => x.id));
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

	const search = useSearch(list, (p) => [
		p.caption,
		p.permalink,
		p.is_reel ? "reel" : "post",
	]);
	const drag = useDragReorder(list, persist);

	return (
		<div>
			{list.length > 4 && (
				<SearchBox
					value={search.q}
					onChange={search.setQ}
					shown={search.shown.length}
					total={list.length}
					noun="posts"
					placeholder="Search caption, link, post/reel…"
				/>
			)}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{list.length === 0 && (
					<EmptyState
						title="No posts yet"
						body="The Studio on Instagram section on the home page. Add the posts and reels you want to feature."
					/>
				)}
				{search.active && search.shown.length === 0 && (
					<p className="rounded-sm border border-dashed border-cream/15 px-4 py-8 text-center font-sans font-light text-cream/80 text-tiny">
						No posts match &ldquo;{search.q.trim()}&rdquo;.
					</p>
				)}
				{search.shown.map((item, i) => (
					<div
						key={item.id}
						{...(search.active ? {} : drag.handlers(i))}
						className={search.active ? "" : drag.itemClass(i)}>
						<PostCard
							item={item}
							index={i}
							total={list.length}
							reorderable={!search.active}
							onMove={(dir) => move(i, dir)}
						/>
					</div>
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
				className="mt-5 w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60">
				{pending ? "Adding…" : "+ Add post"}
			</button>
		</div>
	);
}
