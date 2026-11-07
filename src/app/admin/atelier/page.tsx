import { requireRole } from "@/lib/auth";
import { getAtelierImages } from "@/lib/atelier";
import { AtelierManager } from "./AtelierManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const metadata = { title: "Atelier" };

export default async function AdminAtelierPage() {
	await requireRole("editor");
	const images = await getAtelierImages();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader
				eyebrow="Behind the studio"
				title="Atelier"
				draft={{ page: "atelier" }} reorder />
			<AtelierManager images={images} />
			<PendingDeletes page="atelier" tables={["atelier_images"]} />
		</div>
	);
}
