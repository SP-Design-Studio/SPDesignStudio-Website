import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	const secret = process.env.CRON_SECRET;
	if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`)
		return new NextResponse("Unauthorized", { status: 401 });

	try {
		const { error } = await createPublicClient()
			.from("partners")
			.select("id")
			.limit(1);
		if (error) return NextResponse.json({ ok: false }, { status: 502 });
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ ok: false }, { status: 502 });
	}
}
