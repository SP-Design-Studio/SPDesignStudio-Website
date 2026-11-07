import { requireRole } from "@/lib/auth";
import { getTestimonials } from "@/lib/cms/queries";
import { TestimonialsManager } from "./TestimonialsManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
	await requireRole("editor");
	const testimonials = await getTestimonials();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Testimonials" title="Client reflections" draft={{ page: "home", keys: ["testimonials"] }} reorder />

			<TestimonialsManager initial={testimonials} />
			<PendingDeletes page="home" tables={["testimonials"]} />
		</div>
	);
}
