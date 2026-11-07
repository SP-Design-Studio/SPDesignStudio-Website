"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { storageErrorMessage, validateImageFile } from "@/lib/admin/imageFile";

export type UploadState = { url?: string; error?: string; detail?: string };

export async function uploadImage(formData: FormData): Promise<UploadState> {
	await requireRole("editor");

	const file = formData.get("file") as File | null;
	const folder = String(formData.get("folder") || "misc").replace(
		/[^a-z0-9/_-]/gi,
		"",
	);

	if (!file) return { error: "No image was received. Pick a file and retry." };

	const problem = validateImageFile({
		name: file.name,
		type: file.type,
		size: file.size,
	});
	if (problem) return { error: problem };

	const supabase = await createClient();
	const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
	const path = `${folder}/${crypto.randomUUID()}.${ext}`;

	try {
		const { error } = await supabase.storage.from("media").upload(path, file, {
			contentType: file.type,
			upsert: false,
			cacheControl: "31536000",
		});
		if (error) {
			console.error("[upload] storage rejected:", error.message);
			const friendly = storageErrorMessage(error.message);
			return { error: friendly.message, detail: friendly.detail };
		}
	} catch (e) {
		console.error("[upload] request failed:", e);
		const friendly = storageErrorMessage(
			e instanceof Error ? e.message : String(e),
		);
		return { error: friendly.message, detail: friendly.detail };
	}

	const { data } = supabase.storage.from("media").getPublicUrl(path);
	return { url: data.publicUrl };
}
