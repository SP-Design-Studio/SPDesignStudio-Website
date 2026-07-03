import { NextResponse } from "next/server";
import { STUDIO } from "@/lib/studio";
import { getSiteSettings } from "@/lib/cms/queries";
import { inquiryNotification, acknowledgement } from "@/lib/email/templates";
import { scanFile } from "@/lib/security/virusScan";

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB per file
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]; // "%PDF"

type UploadField = { name: string; content: string };

function decodeFile(raw: unknown): { name: string; bytes: Buffer } | null {
  if (!raw || typeof raw !== "object") return null;
  const f = raw as Partial<UploadField>;
  if (typeof f.name !== "string" || typeof f.content !== "string") return null;
  const b64 = f.content.includes(",")
    ? (f.content.split(",").pop() ?? "")
    : f.content;
  try {
    return { name: f.name, bytes: Buffer.from(b64, "base64") };
  } catch {
    return null;
  }
}

async function prepareAttachment(
  raw: unknown,
  label: string,
): Promise<
  | { skip: true }
  | { error: string }
  | { filename: string; content: string }
> {
  if (!raw) return { skip: true };
  const file = decodeFile(raw);
  if (!file) return { error: `${label}: invalid file.` };
  if (file.bytes.length > MAX_FILE_BYTES)
    return { error: `${label}: file exceeds 4 MB.` };
  const isPdf = PDF_MAGIC.every((b, i) => file.bytes[i] === b);
  if (!isPdf) return { error: `${label}: only PDF files are allowed.` };

  const scan = await scanFile(new Uint8Array(file.bytes), file.name);
  if (!scan.clean)
    return { error: `${label}: failed the security scan (${scan.reason}).` };

  const filename = file.name.toLowerCase().endsWith(".pdf")
    ? file.name
    : `${file.name}.pdf`;
  return { filename, content: file.bytes.toString("base64") };
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const {
    kind,
    name,
    email,
    message,
    portfolioFile,
    resumeFile,
    portfolioLink,
    ...restRaw
  } = data;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name ||
    !email ||
    !message
  ) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields." },
      { status: 400 },
    );
  }
  const rest = restRaw as Record<string, string>;
  const portfolioLinkStr =
    typeof portfolioLink === "string" ? portfolioLink.trim() : "";

  if (kind === "career") {
    if (!resumeFile)
      return NextResponse.json(
        { ok: false, error: "Resume (PDF) is required." },
        { status: 422 },
      );
    if (!portfolioFile && !portfolioLinkStr)
      return NextResponse.json(
        {
          ok: false,
          error: "Attach a portfolio PDF or provide a portfolio link.",
        },
        { status: 422 },
      );
    if (portfolioLinkStr) {
      try {
        new URL(portfolioLinkStr);
      } catch {
        return NextResponse.json(
          {
            ok: false,
            error: "Portfolio link must be a valid URL (include https://).",
          },
          { status: 422 },
        );
      }
      rest["Portfolio link"] = portfolioLinkStr;
    }
  }

  // Validate + virus-scan uploaded PDFs before attaching.
  const attachments: { filename: string; content: string }[] = [];
  for (const [raw, label] of [
    [portfolioFile, "Portfolio"],
    [resumeFile, "Resume"],
  ] as const) {
    const result = await prepareAttachment(raw, label);
    if ("error" in result)
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 422 },
      );
    if ("filename" in result) {
      attachments.push(result);
      rest[`${label} (PDF)`] = "attached · virus-scanned";
    }
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
      name,
      email,
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
      attachments: attachments.length ? attachments : undefined,
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
