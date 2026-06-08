import ContactClient from "@/components/contact/ContactClient";
import { getContactData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = { title: "Contact" };

export default async function ContactPage() {
	const { settings } = await getContactData();
	return <ContactClient settings={settings} />;
}
