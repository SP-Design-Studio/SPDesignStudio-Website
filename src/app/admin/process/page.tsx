import { NavLink } from "../NavLink";
import { requireRole } from "@/lib/auth";
import { getProcessSteps } from "@/lib/cms/queries";
import { ProcessManager } from "./ProcessManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Process" };

export default async function AdminProcessPage() {
	await requireRole("editor");
	const steps = await getProcessSteps();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<NavLink
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/45 text-[0.708rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</NavLink>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Process
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Studio steps
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-base">
					The stages on the Process page. Edit the number, title, description,
					and upload each step&rsquo;s image.
				</p>
			</div>

			<ProcessManager initial={steps} />
		</div>
	);
}
