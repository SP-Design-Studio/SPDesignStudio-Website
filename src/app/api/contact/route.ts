import { NextResponse } from "next/server";
import { STUDIO } from "@/lib/studio";

export async function POST(req: Request) {
	let data: Record<string, string>;
	try {
		data = await req.json();
	} catch {
		return NextResponse.json({ ok: false }, { status: 400 });
	}

	const { kind, name, email, message, ...rest } = data;
	if (!name || !email || !message) {
		return NextResponse.json(
			{ ok: false, error: "Missing required fields." },
			{ status: 400 },
		);
	}

	const label =
		kind === "partnership"
			? "Partnership"
			: kind === "career"
				? "Application"
				: "New Project";
	const subject = `${label} — ${name}`;
	const rows = Object.entries({ Name: name, Email: email, ...rest, Message: message })
		.map(
			([k, v]) =>
				`<p style="margin:0 0 10px"><strong style="text-transform:uppercase;letter-spacing:0.08em;font-size:11px;color:#674550">${k}</strong><br/>${String(
					v,
				).replace(/\n/g, "<br/>")}</p>`,
		)
		.join("");
	const html = `<div style="font-family:Helvetica,Arial,sans-serif;color:#3d242e;max-width:560px"><h2 style="font-weight:400">${label} Inquiry</h2>${rows}</div>`;

	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.RESEND_FROM;
	const to = process.env.CONTACT_TO || STUDIO.email;

	// Not configured yet — accept so the form works, and surface the payload in logs.
	if (!apiKey || !from) {
		console.warn("[contact] RESEND not configured; inquiry not emailed:", {
			kind,
			...data,
		});
		return NextResponse.json({ ok: true, delivered: false });
	}

	try {
		const { Resend } = await import("resend");
		const resend = new Resend(apiKey);
		await resend.emails.send({ from, to, replyTo: email, subject, html });
		return NextResponse.json({ ok: true, delivered: true });
	} catch (err) {
		console.error("[contact] send failed:", err);
		return NextResponse.json({ ok: false }, { status: 500 });
	}
}
