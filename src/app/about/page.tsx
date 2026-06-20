import { pageMeta, breadcrumbLd, webPageLd, founderLd } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import AboutClient from "@/components/about/AboutClient";
import { getAboutData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = pageMeta("about");

export default async function AboutPage() {
	const { team, timeline, honours } = await getAboutData();
	return (
		<>
			<JsonLd
				data={[
					breadcrumbLd("about"),
					webPageLd("about", "AboutPage"),
					founderLd(),
				]}
			/>
			<AboutClient team={team} timeline={timeline} honours={honours} />
		</>
	);
}
