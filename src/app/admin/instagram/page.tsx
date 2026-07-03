import { NavLink } from "../_components/NavLink";
import { requireRole } from "@/lib/auth";
import { getInstagramPosts } from "@/lib/cms/queries";
import { InstagramManager } from "./InstagramManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Instagram" };

export default async function AdminInstagramPage() {
	await requireRole("editor");
	const posts = await getInstagramPosts();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<NavLink
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/80 text-[0.708rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</NavLink>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Instagram
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Studio feed
				</h1>
				<p className="mt-3 max-w-2xl font-sans font-light text-cream/80 text-base">
					The &ldquo;Studio on Instagram&rdquo; section on the home page. Add the
					posts and reels you want to feature &mdash; each is an image, a link to
					the real Instagram post, and a Post/Reel type. Posts show as squares,
					reels as tall tiles. Changes appear on the home page immediately.
				</p>
			</div>

			<InstagramManager posts={posts} />
		</div>
	);
}
