"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

const HourSchema = z.object({ days: z.string(), time: z.string() });

const SettingsSchema = z.object({
	name: z.string().nullable().optional(),
	founder: z.string().nullable().optional(),
	founded: z.string().nullable().optional(),
	email: z.string().email().or(z.literal("")).nullable().optional(),
	phone: z.string().nullable().optional(),
	whatsapp: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	maps_url: z.string().nullable().optional(),
	instagram: z.string().nullable().optional(),
	linkedin: z.string().nullable().optional(),
	hours: z.array(HourSchema),
});

export type ContactState = { ok?: boolean; error?: string };

export async function saveSiteSettings(
	input: unknown,
): Promise<ContactState> {
	await requireRole("editor");
	const parsed = SettingsSchema.safeParse(input);
	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
	}
	const supabase = await createClient();
	const { error } = await supabase
		.from("site_settings")
		.upsert({ id: "main", ...parsed.data }, { onConflict: "id" });
	if (error) return { error: error.message };

	revalidatePath("/admin/contact");
	await logActivity("edit", "Contact");
	return { ok: true };
}
