import HomeClient from "@/components/home/HomeClient";
import { pageMeta } from "@/lib/seo";
import { getHomeData } from "@/lib/cms/pages";
import { getInstagramMedia } from "@/lib/instagram";

export const revalidate = 60;
export const metadata = pageMeta("home");

export default async function Home() {
	const [data, instagram] = await Promise.all([
		getHomeData(),
		getInstagramMedia(),
	]);
	return (
		<HomeClient
			disciplines={data.disciplines}
			partners={data.partners}
			partnerCategories={data.partnerCategories}
			testimonials={data.testimonials}
			recognition={data.recognition}
			instagram={instagram}
		/>
	);
}
