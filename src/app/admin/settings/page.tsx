import { requireRole } from "@/lib/auth";
import { getInstagramSettings } from "@/lib/instagram";
import { getGrainSettings } from "@/lib/config";
import { InstagramSettings } from "./InstagramSettings";
import { GrainToggle } from "./GrainToggle";

export const metadata = { title: "Settings" };

const sectionLabel =
	"font-sans font-light uppercase tracking-[0.32em] text-gold text-[0.684rem] mb-2";

export default async function SettingsPage() {
	await requireRole("admin");
	const [ig, grain] = await Promise.all([
		getInstagramSettings(),
		getGrainSettings(),
	]);

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<h1 className="mb-12 font-serif font-light text-cream text-4xl md:text-5xl">
				Settings
			</h1>

			<section>
				<div className={sectionLabel}>Appearance</div>
				<p className="mb-6 font-sans font-light text-cream/82 text-base">
					Toggle the subtle film-grain texture overlay shown across the public
					site.
				</p>
				<GrainToggle enabled={grain.enabled} intensity={grain.intensity} />
			</section>

			<section className="mt-14 border-t border-cream/10 pt-10">
				<div className={sectionLabel}>Instagram</div>
				<p className="mb-6 font-sans font-light text-cream/82 text-base">
					The &ldquo;Studio on Instagram&rdquo; section on the home page. Set how
					many reels and posts to pull, and the access token.
				</p>
				<InstagramSettings
					enabled={ig.enabled}
					reelsCount={ig.reelsCount}
					postsCount={ig.postsCount}
					hasToken={ig.hasToken}
				/>
			</section>
		</div>
	);
}
