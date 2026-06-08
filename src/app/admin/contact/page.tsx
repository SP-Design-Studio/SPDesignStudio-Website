import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getSiteSettings } from "@/lib/cms/queries";
import { ContactManager } from "./ContactManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };

export default async function AdminContactPage() {
	await requireRole("editor");
	const settings = await getSiteSettings();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<Link
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/45 text-[0.708rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</Link>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Contact
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Studio details
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-base">
					Channels, address, hours, and socials shown on the Contact page.
				</p>
			</div>

			<ContactManager initial={settings} />
		</div>
	);
}
