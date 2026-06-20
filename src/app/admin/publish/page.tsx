import { requireRole } from "@/lib/auth";
import { getPageDrafts } from "@/lib/cms/pages";
import { PublishPanel } from "./PublishPanel";

export const metadata = { title: "Publish" };

export default async function PublishRoute() {
	await requireRole("admin");
	const drafts = await getPageDrafts();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<div className="mb-10">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Publish
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Review &amp; publish
				</h1>
				<p className="mt-3 font-sans font-light text-cream/80 text-base">
					Edits are saved as drafts. Review what changed, preview it, then
					publish to push a page live.
				</p>
			</div>
			<PublishPanel pages={drafts} />
		</div>
	);
}
