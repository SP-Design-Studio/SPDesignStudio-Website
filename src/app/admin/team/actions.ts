"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type ActionResult = { ok?: boolean; error?: string };

async function reval() {
	revalidatePath("/admin/team");
	await logActivity("edit", "The Collection");
}

const MemberSchema = z.object({
	name: z.string().min(1, "Name is required."),
	role: z.string().nullable().optional(),
	note: z.string().nullable().optional(),
	img: z.string().nullable().optional(),
});

export async function createMember(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("team_members")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const { error } = await supabase
		.from("team_members")
		.insert({ name: "New Member", sort: (top?.sort ?? -1) + 1 });
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function updateMember(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = MemberSchema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("team_members")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function deleteMember(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase.from("team_members").delete().eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderMembers(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("team_members").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}
