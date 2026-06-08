import CareersClient from "@/components/careers/CareersClient";
import { getCareersData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = { title: "Careers" };

export default async function CareersPage() {
	const { openings, settings } = await getCareersData();
	return <CareersClient openings={openings} settings={settings} />;
}
