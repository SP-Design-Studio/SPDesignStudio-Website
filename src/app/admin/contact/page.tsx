import { requireRole } from "@/lib/auth";
import { getSiteSettings } from "@/lib/cms/queries";
import { ContactManager } from "./ContactManager";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };

export default async function AdminContactPage() {
	await requireRole("editor");
	const settings = await getSiteSettings();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Contact" title="Studio details" draft={{ page: "contact" }} />

			<ContactManager initial={settings} />
		</div>
	);
}
