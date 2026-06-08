import { STUDIO } from "@/lib/studio";

const C = {
	pageBg: "#241a1e",
	cardBg: "#2e1f24",
	border: "#3f2a31",
	cream: "#fcfbf7",
	creamSoft: "#d8d0d3",
	creamMuted: "#8a7a80",
	gold: "#bfa15f",
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

function wrap(inner: string): string {
	const year = new Date().getFullYear();
	return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${C.pageBg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.pageBg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:${C.cardBg};border:1px solid ${C.border};border-radius:4px;overflow:hidden;">
        <tr><td style="padding:26px 36px;border-bottom:1px solid ${C.border};">
          <div style="font-family:${SANS};color:${C.gold};letter-spacing:4px;text-transform:uppercase;font-size:11px;">SP Design Studio</div>
        </td></tr>
        <tr><td style="padding:36px;">
          ${inner}
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid ${C.border};">
          <div style="font-family:${SANS};color:${C.creamMuted};font-size:11px;letter-spacing:0.04em;">&copy; ${year} ${STUDIO.name} &middot; ${STUDIO.location}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function heading(text: string): string {
	return `<h1 style="margin:0;font-family:${SERIF};font-weight:400;color:${C.cream};font-size:24px;line-height:1.2;">${text}</h1>
  <div style="height:1px;width:40px;background:${C.gold};margin:16px 0 24px;"></div>`;
}

function esc(v: string): string {
	return String(v)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

export function inquiryNotification(
	label: string,
	fields: Record<string, string>,
): string {
	const rows = Object.entries(fields)
		.filter(([, v]) => v != null && String(v).trim() !== "")
		.map(
			([k, v]) =>
				`<div style="margin:0 0 16px;">
          <div style="font-family:${SANS};text-transform:uppercase;letter-spacing:0.16em;font-size:10px;color:${C.gold};margin-bottom:4px;">${esc(k)}</div>
          <div style="font-family:${SANS};color:${C.cream};font-size:14px;line-height:1.55;">${esc(v).replace(/\n/g, "<br/>")}</div>
        </div>`,
		)
		.join("");
	return wrap(`${heading(`${esc(label)} Inquiry`)}${rows}`);
}

export function acknowledgement(name: string, label: string): string {
	const kind = label.toLowerCase();
	return wrap(
		`${heading(`Thank you, ${esc(name)}.`)}
    <p style="margin:0 0 18px;font-family:${SERIF};font-style:italic;color:${C.creamSoft};font-size:16px;line-height:1.65;">
      We&rsquo;ve received your ${esc(kind)} and will be in touch within two working days.
    </p>
    <p style="margin:0;font-family:${SANS};color:${C.creamMuted};font-size:12px;letter-spacing:0.04em;">
      &mdash; ${STUDIO.name}
    </p>`,
	);
}
