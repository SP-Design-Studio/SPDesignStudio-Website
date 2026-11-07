import { requireRole } from "@/lib/auth";
import { getDisciplines, getRecognition } from "@/lib/cms/queries";
import { DisciplinesManager } from "./DisciplinesManager";
import { RecognitionManager } from "./RecognitionManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Homepage" };

export default async function AdminHomePage() {
	await requireRole("editor");
	const [disciplines, recognition] = await Promise.all([
		getDisciplines(),
		getRecognition(),
	]);

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Homepage" title="Hero &amp; disciplines" draft={{ page: "home", keys: ["disciplines", "recognition"] }} reorder />

			<div className="mb-16">
				<div className="font-sans font-light uppercase tracking-[0.32em] text-gold text-tiny mb-6">
					Hero recognition
				</div>
				<RecognitionManager initial={recognition} />
			</div>

			<div className="border-t border-cream/10 pt-10">
				<div className="font-sans font-light uppercase tracking-[0.32em] text-gold text-tiny mb-6">
					Disciplines grid
				</div>
				<DisciplinesManager initial={disciplines} />
				<PendingDeletes page="home" tables={["home_disciplines", "home_recognition"]} />
			</div>
		</div>
	);
}
