import type { Metadata } from "next";
import AtelierClient from "@/components/atelier/AtelierClient";
import { getAtelierImages } from "@/lib/atelier";
import { SITE_NAME } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Atelier",
	description: `Behind the studio — moments, materials, and process from ${SITE_NAME}.`,
	alternates: { canonical: "/atelier" },
};

export default async function AtelierPage() {
	const images = await getAtelierImages();
	return <AtelierClient images={images} />;
}
