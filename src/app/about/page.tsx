import { pageMeta } from "@/lib/seo";
import AboutClient from "@/components/about/AboutClient";
import { getAboutData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = pageMeta("about");

export default async function AboutPage() {
	const { team, timeline, honours } = await getAboutData();
	return <AboutClient team={team} timeline={timeline} honours={honours} />;
}
