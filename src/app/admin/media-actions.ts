"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export type UploadState = { url?: string; error?: string };

export async function uploadImage(formData: FormData): Promise<UploadState> {
	await requireRole("editor");

	const file = formData.get("file") as File | null;
	const folder = String(formData.get("folder") || "misc").replace(
		/[^a-z0-9/_-]/gi,
		"",
	);

	if (!file || file.size === 0) return { error: "No file selected." };
	if (!TYPES.includes(file.type))
		return { error: "Use a JPG, PNG, WebP, or AVIF image." };
	if (file.size > MAX_BYTES) return { error: "Image must be under 8MB." };

	const supabase = await createClient();
	const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
	const path = `${folder}/${crypto.randomUUID()}.${ext}`;

	const { error } = await supabase.storage
		.from("media")
		.upload(path, file, { contentType: file.type, upsert: false });
	if (error) return { error: error.message };

	const { data } = supabase.storage.from("media").getPublicUrl(path);
	return { url: data.publicUrl };
}

export async function deleteImage(url: string): Promise<{ error?: string }> {
	await requireRole("editor");
	const marker = "/media/";
	const idx = url.indexOf(marker);
	if (idx === -1) return {};
	const path = url.slice(idx + marker.length);
	const supabase = await createClient();
	const { error } = await supabase.storage.from("media").remove([path]);
	return error ? { error: error.message } : {};
}
