import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import ContactClient from "@/components/contact/ContactClient";
import { getContactData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = pageMeta("contact");

export default async function ContactPage() {
	const { settings } = await getContactData();
	return (
		<>
			<JsonLd
				data={[
					breadcrumbLd("contact"),
					webPageLd("contact", "ContactPage"),
				]}
			/>
			<ContactClient settings={settings} />
		</>
	);
}
