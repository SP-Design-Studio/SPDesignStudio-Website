import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import ProcessClient from "@/components/process/ProcessClient";
import { getProcessData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = pageMeta("process");

export default async function ProcessPage() {
	const { steps } = await getProcessData();
	return (
		<>
			<JsonLd data={[breadcrumbLd("process"), webPageLd("process")]} />
			<ProcessClient steps={steps} />
		</>
	);
}
