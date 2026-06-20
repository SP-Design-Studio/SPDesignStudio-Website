"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishPage, publishAll, discardPage } from "./publish-actions";
import type { PageKey, PageStatus } from "@/lib/cms/pages";

type Row = {
	key: PageKey;
	label: string;
	path: string;
	publishedAt: string | null;
	status: PageStatus;
	changes: string[];
};

function StatusChip({ status, count }: { status: PageStatus; count: number }) {
	if (status === "dirty")
		return (
			<span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-sans font-light uppercase tracking-[0.18em] text-gold text-[0.59rem]">
				{count} unpublished change{count === 1 ? "" : "s"}
			</span>
		);
	if (status === "unpublished")
		return (
			<span className="rounded-full border border-cream/20 px-2.5 py-0.5 font-sans font-light uppercase tracking-[0.18em] text-cream/82 text-[0.59rem]">
				Not published
			</span>
		);
	return (
		<span className="rounded-full border border-cream/10 px-2.5 py-0.5 font-sans font-light uppercase tracking-[0.18em] text-cream/30 text-[0.59rem]">
			Up to date
		</span>
	);
}

function Item({ row }: { row: Row }) {
	const router = useRouter();
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");
	const [open, setOpen] = useState(false);

	const when = row.publishedAt
		? `Published ${new Date(row.publishedAt).toLocaleString()}`
		: "Not published yet — nothing live";

	return (
		<div className="border-b border-cream/10 py-4 last:border-b-0">
			<div className="flex items-center justify-between gap-4">
				<div className="min-w-0">
					<div className="flex items-center gap-3">
						<span className="font-serif font-light text-cream text-xl">
							{row.label}
						</span>
						<StatusChip status={row.status} count={row.changes.length} />
					</div>
					<div className="mt-0.5 font-sans font-light text-cream/82 text-[0.732rem]">
						{msg || when}
					</div>
				</div>
				<div className="flex items-center gap-4">
					{row.status === "dirty" && (
						<>
							<button
								type="button"
								onClick={() => setOpen((v) => !v)}
								className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-gold text-[0.649rem] transition-colors hover:text-gold">
								{open ? "Hide" : "Review"}
							</button>
							<button
								type="button"
								disabled={pending}
								onClick={() => {
									if (
										!window.confirm(
											`Discard all unpublished changes to ${row.label}? This restores the live published version and cannot be undone.`,
										)
									)
										return;
									start(async () => {
										setMsg("");
										const res = await discardPage(row.key);
										setMsg(res.error ? res.error : "Draft discarded");
										setOpen(false);
										router.refresh();
									});
								}}
								className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/82 text-[0.649rem] transition-colors hover:text-gold disabled:opacity-50">
								Discard
							</button>
						</>
					)}
					{row.status !== "clean" && (
						<a
							href={`/preview/${row.key}`}
							target="_blank"
							rel="noopener noreferrer"
							className="font-sans font-light uppercase tracking-[0.2em] text-gold text-[0.649rem] transition-colors hover:text-gold">
							Preview draft ↗
						</a>
					)}
					<a
						href={row.path}
						target="_blank"
						rel="noopener noreferrer"
						className="font-sans font-light uppercase tracking-[0.2em] text-cream/82 text-[0.649rem] transition-colors hover:text-gold">
						View live ↗
					</a>
					<button
						type="button"
						disabled={pending || row.status === "clean"}
						onClick={() =>
							start(async () => {
								setMsg("");
								const res = await publishPage(row.key);
								setMsg(res.error ? res.error : "Published");
								setOpen(false);
								router.refresh();
							})
						}
						className="cta-gold cursor-pointer bg-gold px-6 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-[0.708rem] disabled:cursor-not-allowed disabled:opacity-40">
						{pending ? "Publishing…" : "Publish"}
					</button>
				</div>
			</div>
			{open && row.changes.length > 0 && (
				<ul className="mt-3 space-y-1 rounded-sm border border-cream/10 bg-plum/40 px-4 py-3">
					{row.changes.map((c, i) => (
						<li
							key={i}
							className="font-sans font-light text-cream/82 text-[0.826rem] leading-relaxed">
							{c}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export function PublishPanel({ pages }: { pages: Row[] }) {
	const router = useRouter();
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");
	const dirty = pages.filter((p) => p.status !== "clean").length;

	return (
		<div className="flex flex-col">
			{pages.map((row) => (
				<Item key={row.key} row={row} />
			))}
			<div className="mt-5 flex items-center gap-4">
				<button
					type="button"
					disabled={pending || dirty === 0}
					onClick={() =>
						start(async () => {
							setMsg("");
							const res = await publishAll();
							setMsg(res.error ? res.error : "All pages published");
							router.refresh();
						})
					}
					className="cursor-pointer border border-gold/40 px-6 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.708rem] transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40">
					{pending ? "Publishing all…" : "Publish all pages"}
				</button>
				{msg && (
					<span className="font-sans font-light text-cream/80 text-sm">
						{msg}
					</span>
				)}
			</div>
		</div>
	);
}
