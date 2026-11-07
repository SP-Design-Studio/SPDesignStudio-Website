import { NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getPageDrafts } from "@/lib/cms/pages";

export const dynamic = "force-dynamic";

export async function GET() {
	const profile = await getProfile();
	if (!profile || profile.mfa !== "ok")
		return new NextResponse("Unauthorized", { status: 401 });

	const drafts = await getPageDrafts();
	const pages = Object.fromEntries(
		drafts.map((d) => [d.key, { status: d.status, dirtyKeys: d.dirtyKeys }]),
	);
	return NextResponse.json(
		{ pages },
		{ headers: { "Cache-Control": "no-store" } },
	);
}
