import Image from "next/image";
import { getPendingDeletes } from "@/lib/cms/pending";
import type { PageKey } from "@/lib/cms/pages";
import { RestoreButton } from "./RestoreButton";

export async function PendingDeletes({
	page,
	tables,
}: {
	page: PageKey;
	tables: string[];
}) {
	const items = await getPendingDeletes(page, tables);
	if (items.length === 0) return null;

	return (
		<section className="mt-14 border-t border-warn/25 pt-8">
			<div className="mb-2 flex items-baseline gap-3">
				<h2 className="font-sans font-light uppercase tracking-[0.32em] text-warn text-tiny">
					Pending deletion
				</h2>
				<span className="font-sans font-light tabular-nums text-warn/80 text-tiny">
					{items.length}
				</span>
			</div>
			<p className="mb-5 max-w-xl font-sans font-light text-cream/80 text-tiny">
				Removed from the draft. These come off the live site when you publish.
				Restore one to keep it.
			</p>
			<ul className="flex flex-col">
				{items.map((it) => (
					<li
						key={`${it.table}-${it.id}`}
						className="flex flex-wrap items-center gap-4 border-b border-cream/5 py-3 last:border-b-0">
						{it.image && (
							<span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm border border-warn/30 bg-plum-dark opacity-70">
								<Image
									src={it.image}
									alt=""
									fill
									sizes="64px"
									className="object-cover"
								/>
							</span>
						)}
						<span className="min-w-0 flex-1 font-serif font-light text-cream/70 text-lg line-through decoration-warn/50">
							{it.label}
						</span>
						<RestoreButton table={it.table} id={it.id} />
					</li>
				))}
			</ul>
		</section>
	);
}
