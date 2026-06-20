"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type ActionResult = { ok?: boolean; error?: string; id?: string };

async function reval(id?: string) {
	revalidatePath("/admin/projects");
	await logActivity("edit", "Projects");
	if (id) revalidatePath(`/admin/projects/${id}`);
}

const ProjectSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug is required.")
		.regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only."),
	title: z.string().min(1, "Title is required."),
	location: z.string().nullable().optional(),
	type: z.string().nullable().optional(),
	category: z.enum(["residential", "commercial", "hospitality"]),
	delivery: z.enum(["turnkey", "renovation"]).optional(),
	img: z.string().nullable().optional(),
	year: z.string().nullable().optional(),
	blurb: z.string().nullable().optional(),
});

export async function createProject(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("projects")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const slug = `new-project-${Date.now().toString(36)}`;
	const { data, error } = await supabase
		.from("projects")
		.insert({
			slug,
			title: "New Project",
			category: "residential",
			sort: (top?.sort ?? -1) + 1,
		})
		.select("id")
		.single();
	if (error) return { error: error.message };
	await reval();
	return { ok: true, id: data.id };
}

export async function updateProject(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = ProjectSchema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("projects")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await reval(id);
	return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase.from("projects").delete().eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderProjects(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("projects").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}

// ---- Facts ----

export async function addFact(projectId: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("project_facts")
		.select("sort")
		.eq("project_id", projectId)
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const { error } = await supabase.from("project_facts").insert({
		project_id: projectId,
		label: "Label",
		value: "Value",
		sort: (top?.sort ?? -1) + 1,
	});
	if (error) return { error: error.message };
	await reval(projectId);
	return { ok: true };
}

export async function updateFact(
	id: string,
	projectId: string,
	input: { label: string; value: string },
): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("project_facts")
		.update({ label: input.label, value: input.value })
		.eq("id", id);
	if (error) return { error: error.message };
	await reval(projectId);
	return { ok: true };
}

export async function deleteFact(
	id: string,
	projectId: string,
): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase.from("project_facts").delete().eq("id", id);
	if (error) return { error: error.message };
	await reval(projectId);
	return { ok: true };
}

// ---- Gallery ----

export async function addGalleryImage(
	projectId: string,
	url: string,
): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("project_gallery")
		.select("sort")
		.eq("project_id", projectId)
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const { error } = await supabase.from("project_gallery").insert({
		project_id: projectId,
		url,
		sort: (top?.sort ?? -1) + 1,
	});
	if (error) return { error: error.message };
	await reval(projectId);
	return { ok: true };
}

export async function deleteGalleryImage(
	id: string,
	projectId: string,
): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase.from("project_gallery").delete().eq("id", id);
	if (error) return { error: error.message };
	await reval(projectId);
	return { ok: true };
}

export async function reorderGallery(
	projectId: string,
	ids: string[],
): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("project_gallery").update({ sort: i }).eq("id", id),
		),
	);
	await reval(projectId);
	return { ok: true };
}
