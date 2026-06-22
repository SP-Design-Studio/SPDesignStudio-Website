export interface ScanResult {
	clean: boolean;
	reason?: string;
}

export async function scanFile(
	bytes: Uint8Array,
	filename: string,
): Promise<ScanResult> {
	const key = process.env.CLOUDMERSIVE_API_KEY;
	if (!key) {
		console.warn(
			"[virus-scan] CLOUDMERSIVE_API_KEY not set — skipping scan for",
			filename,
		);
		return { clean: true, reason: "skipped" };
	}

	try {
		const form = new FormData();
		form.append(
			"inputFile",
			new Blob([bytes as BlobPart], { type: "application/pdf" }),
			filename,
		);
		const res = await fetch("https://api.cloudmersive.com/virus/scan/file", {
			method: "POST",
			headers: { Apikey: key },
			body: form,
			cache: "no-store",
		});
		if (!res.ok) {
			console.error("[virus-scan] API error", res.status);
			return { clean: false, reason: "scan-failed" };
		}
		const data = (await res.json()) as {
			CleanResult?: boolean;
			FoundViruses?: { VirusName?: string }[] | null;
		};
		if (data.CleanResult === true) return { clean: true };
		const virus = data.FoundViruses?.[0]?.VirusName;
		return { clean: false, reason: virus ?? "infected" };
	} catch (e) {
		console.error("[virus-scan] request failed:", e);
		return { clean: false, reason: "scan-error" };
	}
}
