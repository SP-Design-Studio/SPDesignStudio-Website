import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getPartners, getPartnerCategories } from "@/lib/cms/queries";
import { PartnersManager } from "./PartnersManager";

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
			<Link
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/45 text-[0.6rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</Link>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.6rem] mb-3">
					Partners
				</div>
				<h1 className="font-serif font-light text-cream text-3xl md:text-4xl">
					Logos & directory
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-sm">
					The rotating logo reel and the &ldquo;View All Partners&rdquo;
					directory on the home page. Use transparent PNG/SVG logos for the
					reel (they&rsquo;re tinted gold).
				</p>
			</div>

			<PartnersManager logos={logos} categories={categories} />
		</div>
	);
}
