import { NextResponse } from "next/server";
import { refreshInstagramToken } from "@/lib/instagram";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	const secret = process.env.CRON_SECRET;
	if (secret) {
		const auth = req.headers.get("authorization");
		if (auth !== `Bearer ${secret}`)
			return NextResponse.json({ ok: false }, { status: 401 });
	}
	const res = await refreshInstagramToken();
	return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}
