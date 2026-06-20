import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import CareersClient from "@/components/careers/CareersClient";
import { getCareersData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = pageMeta("careers");

export default async function CareersPage() {
	const { openings, settings } = await getCareersData();
	return (
		<>
			<JsonLd data={[breadcrumbLd("careers"), webPageLd("careers")]} />
			<CareersClient openings={openings} settings={settings} />
		</>
	);
}
