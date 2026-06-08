import { NextResponse } from "next/server";
import { STUDIO } from "@/lib/studio";
import { getSiteSettings } from "@/lib/cms/queries";
import { inquiryNotification, acknowledgement } from "@/lib/email/templates";

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
  const html = inquiryNotification(label, {
    Name: name,
    Email: email,
    ...rest,
    Message: message,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  let to = process.env.CONTACT_TO;
  if (!to) {
    const settings = await getSiteSettings();
    to = settings?.email || STUDIO.email;
  }

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
    const { error: sendError } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      html,
    });
    if (sendError) {
      console.error("[contact] resend rejected the send:", sendError);
      return NextResponse.json(
        { ok: false, error: sendError.message ?? "Email send failed." },
        { status: 502 },
      );
    }

    const { error: ackError } = await resend.emails.send({
      from,
      to: email,
      subject: `We received your ${label.toLowerCase()} — ${STUDIO.name}`,
      html: acknowledgement(name, label),
    });
    if (ackError)
      console.warn("[contact] acknowledgement not sent:", ackError);

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
