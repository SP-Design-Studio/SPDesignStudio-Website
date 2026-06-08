import HomeClient from "@/components/home/HomeClient";
import { getHomeData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = { title: { absolute: "Home · SP Design Studio" } };

export default async function Home() {
	const data = await getHomeData();
	return (
		<HomeClient
			disciplines={data.disciplines}
			partners={data.partners}
			partnerCategories={data.partnerCategories}
			testimonials={data.testimonials}
			recognition={data.recognition}
		/>
	);
}
