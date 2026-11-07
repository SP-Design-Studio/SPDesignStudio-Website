import { requireRole } from "@/lib/auth";
import { getPageDrafts, PAGE_KEYS, type PageKey } from "@/lib/cms/pages";
import { PublishPanel } from "./PublishPanel";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "Publish" };

export default async function PublishRoute({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	await requireRole("admin");
	const { page } = await searchParams;
	const initial = PAGE_KEYS.includes(page as PageKey) ? (page as PageKey) : undefined;
	const drafts = await getPageDrafts();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Publish" title="Review &amp; publish">
				Nothing is live until you publish it here.
			</PageHeader>
			<PublishPanel pages={drafts} initial={initial} />
		</div>
	);
}
