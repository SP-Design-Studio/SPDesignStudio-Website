import { DraftStatus } from "./DraftStatus";
import { ReorderToggle } from "./ReorderToggle";
import type { PageKey } from "@/lib/cms/pages";

export function PageHeader({
	eyebrow,
	title,
	children,
	draft,
	reorder,
}: {
	eyebrow: React.ReactNode;
	title: React.ReactNode;
	children?: React.ReactNode;
	draft?: { page: PageKey; keys?: string[] };
	reorder?: boolean;
}) {
	return (
		<header className="mb-14">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
				<div className="font-sans font-light uppercase tracking-[0.42em] text-gold text-tiny">
					{eyebrow}
				</div>
				{(draft || reorder) && (
					<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
						{draft && <DraftStatus page={draft.page} keys={draft.keys} />}
						{reorder && <ReorderToggle />}
					</div>
				)}
			</div>
			<h1 className="font-bdscript text-cream leading-[1] text-5xl sm:text-6xl md:text-7xl">
				{title}
			</h1>
			<span className="mt-6 block h-px w-16 bg-gold/50" />
			{children && (
				<p className="mt-6 max-w-2xl font-serif italic font-light text-cream/90 text-lg leading-[1.6] md:text-xl">
					{children}
				</p>
			)}
		</header>
	);
}
