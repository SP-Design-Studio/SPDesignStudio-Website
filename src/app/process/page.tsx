import { pageMeta } from "@/lib/seo";
import ProcessClient from "@/components/process/ProcessClient";
import { getProcessData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = pageMeta("process");

export default async function ProcessPage() {
	const { steps } = await getProcessData();
	return <ProcessClient steps={steps} />;
}
