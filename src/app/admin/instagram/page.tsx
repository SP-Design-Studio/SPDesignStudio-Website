import { requireRole } from "@/lib/auth";
import { getInstagramPosts } from "@/lib/cms/queries";
import { InstagramManager } from "./InstagramManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Instagram" };

export default async function AdminInstagramPage() {
	await requireRole("editor");
	const posts = await getInstagramPosts();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Instagram" title="Studio feed" draft={{ page: "home", keys: ["instagram"] }} reorder />

			<InstagramManager posts={posts} />
			<PendingDeletes page="home" tables={["instagram_posts"]} />
		</div>
	);
}
