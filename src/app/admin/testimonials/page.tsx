import { NavLink } from "../_components/NavLink";
import { requireRole } from "@/lib/auth";
import { getTestimonials } from "@/lib/cms/queries";
import { TestimonialsManager } from "./TestimonialsManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
	await requireRole("editor");
	const testimonials = await getTestimonials();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<NavLink
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/80 text-[0.708rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</NavLink>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Testimonials
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Client reflections
				</h1>
				<p className="mt-3 font-sans font-light text-cream/80 text-base">
					The rotating testimonials on the home page (and the &ldquo;Read all
					reflections&rdquo; overlay). Each has a quote, name, detail, and
					image.
				</p>
			</div>

			<TestimonialsManager initial={testimonials} />
		</div>
	);
}
