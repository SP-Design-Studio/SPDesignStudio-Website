"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSaving } from "@/lib/admin/saving";
import { useFlash } from "@/lib/admin/useFlash";
import { ui } from "@/lib/admin/ui";
import { publishPage, publishAll, discardPage } from "./actions";
import type { PageKey, PageStatus } from "@/lib/cms/pages";
import type { Change } from "@/lib/cms/diff";
import { DiffViewer } from "./DiffViewer";

type Row = {
	key: PageKey;
	label: string;
	path: string;
	publishedAt: string | null;
	status: PageStatus;
	changes: Change[];
};

const DOT: Record<PageStatus, string> = {
	dirty: "bg-gold",
	unpublished: "bg-cream/70",
	clean: "bg-cream/20",
};

function Tab({
	row,
	active,
	onSelect,
}: {
	row: Row;
	active: boolean;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 font-sans font-light text-tiny transition-colors ${
				active
					? "border-gold/60 bg-gold/10 text-gold"
					: "border-cream/15 text-cream/82 hover:border-cream/40 hover:text-cream active:border-gold/50 active:text-gold"
			}`}>
			<span
				className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT[row.status]} ${
					row.status === "dirty"
						? "[animation:admin-pulse_1.6s_ease-in-out_infinite]"
						: ""
				}`}
			/>
			{row.label}
			{row.status === "dirty" && (
				<span className="tabular-nums text-micro opacity-80">
					{row.changes.length}
				</span>
			)}
			{row.status === "unpublished" && (
				<span className="text-micro opacity-70">new</span>
			)}
		</button>
	);
}

export function PublishPanel({ pages }: { pages: Row[] }) {
	const router = useRouter();
	const [pending, start] = useSaving("Publishing");
	const [msg, flash] = useFlash();

	const firstInteresting =
		pages.find((p) => p.status === "dirty") ??
		pages.find((p) => p.status === "unpublished") ??
		pages[0];
	const [selected, setSelected] = useState<PageKey | undefined>(
		firstInteresting?.key,
	);

	useEffect(() => {
		if (!pages.some((p) => p.key === selected))
			setSelected(firstInteresting?.key);
	}, [pages, selected, firstInteresting]);

	const row = useMemo(
		() => pages.find((p) => p.key === selected),
		[pages, selected],
	);
	const dirty = pages.filter((p) => p.status !== "clean").length;

	if (!row) return null;

	const when = row.publishedAt
		? `Published ${new Date(row.publishedAt).toLocaleString()}`
		: "Never published — nothing is live yet";

	const publish = () =>
		start(async () => {
			const res = await publishPage(row.key);
			flash(res.error ? res.error : "Published");
			router.refresh();
		});

	const discard = () => {
		if (
			!window.confirm(
				`Discard all unpublished changes to ${row.label}? This restores the live published version and cannot be undone.`,
			)
		)
			return;
		start(async () => {
			const res = await discardPage(row.key);
			flash(res.error ? res.error : "Draft discarded");
			router.refresh();
		});
	};

	return (
		<div className="flex flex-col">
			<div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
				{pages.map((p) => (
					<Tab
						key={p.key}
						row={p}
						active={p.key === selected}
						onSelect={() => setSelected(p.key)}
					/>
				))}
			</div>

			<div
				data-busy={pending || undefined}
				className="mt-6 rounded-sm border border-cream/10 bg-plum/15">
				<div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-cream/10 px-4 py-3.5">
					<div className="min-w-0">
						<div className="flex items-baseline gap-2.5">
							<span className="font-serif font-light text-cream text-xl">
								{row.label}
							</span>
							<span className="font-sans font-light text-cream/80 text-tiny">
								{row.status === "dirty"
									? `${row.changes.length} unpublished change${row.changes.length === 1 ? "" : "s"}`
									: row.status === "unpublished"
										? "Not published"
										: "Up to date"}
							</span>
						</div>
						<div className="mt-0.5 font-sans font-light text-cream/80 text-micro">
							{msg || when}
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-4">
						{row.status !== "clean" && (
							<a
								href={`/preview/${row.key}`}
								target="_blank"
								rel="noopener noreferrer"
								className="font-sans font-light uppercase tracking-[0.2em] text-cream/70 text-tiny transition-colors hover:text-gold">
								Preview ↗
							</a>
						)}
						<a
							href={row.path}
							target="_blank"
							rel="noopener noreferrer"
							className="font-sans font-light uppercase tracking-[0.2em] text-cream/70 text-tiny transition-colors hover:text-gold">
							Live ↗
						</a>
						{row.status === "dirty" && (
							<button
								type="button"
								disabled={pending}
								onClick={discard}
								className={ui.btnDanger}>
								Discard
							</button>
						)}
						<button
							type="button"
							disabled={pending || row.status === "clean"}
							onClick={publish}
							className={`${ui.btnPrimary} disabled:cursor-not-allowed disabled:opacity-40`}>
							{pending ? "Publishing…" : "Publish"}
						</button>
					</div>
				</div>

				{row.changes.length > 0 ? (
					<DiffViewer changes={row.changes} />
				) : (
					<div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
						<span className="h-1.5 w-1.5 rounded-full bg-cream/25" />
						<p className="font-sans font-light text-cream/82 text-sm">
							{row.status === "unpublished"
								? "This page has never been published — publish to put it live."
								: "No unpublished changes on this page."}
						</p>
					</div>
				)}
			</div>

			<div className="mt-5 flex flex-wrap items-center gap-4">
				<button
					type="button"
					disabled={pending || dirty === 0}
					onClick={() =>
						start(async () => {
							const res = await publishAll();
							flash(res.error ? res.error : "All pages published");
							router.refresh();
						})
					}
					className={`${ui.btnGhost} border-gold/40 text-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40`}>
					{pending
						? "Publishing all…"
						: `Publish all${dirty ? ` (${dirty})` : ""}`}
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
