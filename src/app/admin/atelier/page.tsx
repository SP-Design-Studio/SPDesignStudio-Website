import { requireRole } from "@/lib/auth";
import { getAtelierImages } from "@/lib/atelier";
import { AtelierManager } from "./AtelierManager";

export const metadata = { title: "Atelier" };

export default async function AdminAtelierPage() {
	await requireRole("editor");
	const images = await getAtelierImages();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<h1 className="mb-2 font-serif font-light text-cream text-4xl md:text-5xl">
				Atelier
			</h1>
			<p className="mb-10 font-sans font-light text-cream/82 text-base">
				Behind-the-studio images shown on the public{" "}
				<span className="text-cream">/atelier</span> page. Upload, reorder, or
				remove.
			</p>
			<AtelierManager images={images} />
		</div>
	);
}
