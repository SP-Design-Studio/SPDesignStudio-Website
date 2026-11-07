import { requireRole } from "@/lib/auth";
import { getPartners, getPartnerCategories } from "@/lib/cms/queries";
import { PartnersManager } from "./PartnersManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Partners" };

export default async function AdminPartnersPage() {
	await requireRole("editor");
	const [logos, categories] = await Promise.all([
		getPartners(),
		getPartnerCategories(),
	]);

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Partners" title="Logos & directory" draft={{ page: "home", keys: ["partners", "partnerCategories"] }} reorder />

			<PartnersManager logos={logos} categories={categories} />
			<PendingDeletes page="home" tables={["partners", "partner_categories"]} />
		</div>
	);
}
