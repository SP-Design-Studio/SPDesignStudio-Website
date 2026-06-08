"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type TeamResult = { ok?: boolean; error?: string };

const ROLES = ["founder", "admin", "editor"] as const;
type ManagedRole = (typeof ROLES)[number];

export async function signOut() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/admin/login");
}

export async function updateProfileName(
	name: string,
): Promise<{ ok?: boolean; error?: string }> {
	const profile = await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("profiles")
		.update({ full_name: name.trim() || null })
		.eq("id", profile.id);
	if (error) return { error: error.message };
	revalidatePath("/admin");
	return { ok: true };
}

const CreateUserSchema = z.object({
	email: z.email(),
	role: z.enum(["admin", "editor"]),
	password: z.string().min(8, "Password must be at least 8 characters."),
	full_name: z.string().optional(),
});

export type CreateUserState = { error?: string; ok?: string };

export async function createUser(
	_prev: CreateUserState,
	formData: FormData,
): Promise<CreateUserState> {
	await requireRole("admin");

	const parsed = CreateUserSchema.safeParse({
		email: formData.get("email"),
		role: formData.get("role"),
		password: formData.get("password"),
		full_name: formData.get("full_name") ?? undefined,
	});
	if (!parsed.success) {
		return {
			error:
				parsed.error.issues[0]?.message ??
				"Enter a valid email, role, and password.",
		};
	}

	const admin = createAdminClient();
	const { data, error } = await admin.auth.admin.createUser({
		email: parsed.data.email,
		password: parsed.data.password,
		email_confirm: true,
	});
	if (error) return { error: error.message };

	if (data.user) {
		await admin
			.from("profiles")
			.upsert(
				{
					id: data.user.id,
					email: parsed.data.email,
					role: parsed.data.role,
					full_name: parsed.data.full_name?.trim() || null,
				},
				{ onConflict: "id" },
			);
	}

	await logActivity(
		"create_user",
		parsed.data.email,
		`Created ${parsed.data.role} account`,
	);

	return {
		ok: `Created ${parsed.data.email} as ${parsed.data.role}. They sign in with the password you set.`,
	};
}

async function loadTarget(id: string) {
	const admin = createAdminClient();
	const { data } = await admin
		.from("profiles")
		.select("id, email, role")
		.eq("id", id)
		.single();
	return data as { id: string; email: string; role: ManagedRole } | null;
}

async function founderCount(): Promise<number> {
	const admin = createAdminClient();
	const { count } = await admin
		.from("profiles")
		.select("id", { count: "exact", head: true })
		.eq("role", "founder");
	return count ?? 0;
}

export async function updateUserRole(
	id: string,
	role: string,
): Promise<TeamResult> {
	const actor = await requireRole("admin");
	if (!ROLES.includes(role as ManagedRole)) return { error: "Invalid role." };
	const next = role as ManagedRole;
	if (id === actor.id) return { error: "You can't change your own role." };

	const target = await loadTarget(id);
	if (!target) return { error: "User not found." };
	if (target.role === next) return { ok: true };

	if (next === "founder" && actor.role !== "founder")
		return { error: "Only a founder can grant the founder role." };
	if (target.role === "founder" && actor.role !== "founder")
		return { error: "Only a founder can change another founder." };
	if (target.role === "founder" && next !== "founder" && (await founderCount()) <= 1)
		return { error: "At least one founder is required." };

	const admin = createAdminClient();
	const { error } = await admin
		.from("profiles")
		.update({ role: next })
		.eq("id", id);
	if (error) return { error: error.message };
	await logActivity(
		"update_role",
		target.email,
		`Role ${target.role} → ${next}`,
	);
	revalidatePath("/admin");
	return { ok: true };
}

export async function deleteUser(id: string): Promise<TeamResult> {
	const actor = await requireRole("admin");
	if (id === actor.id) return { error: "You can't remove your own account." };

	const target = await loadTarget(id);
	if (!target) return { error: "User not found." };
	if (target.role === "founder" && actor.role !== "founder")
		return { error: "Only a founder can remove another founder." };
	if (target.role === "founder" && (await founderCount()) <= 1)
		return { error: "At least one founder is required." };

	const admin = createAdminClient();
	const { error } = await admin.auth.admin.deleteUser(id);
	if (error) return { error: error.message };
	await logActivity("delete_user", target.email, `Removed ${target.role} account`);
	revalidatePath("/admin");
	return { ok: true };
}

export async function resetUserPassword(
	id: string,
	password: string,
): Promise<TeamResult> {
	const actor = await requireRole("admin");
	if (!password || password.length < 8)
		return { error: "Password must be at least 8 characters." };

	const target = await loadTarget(id);
	if (!target) return { error: "User not found." };
	if (target.role === "founder" && actor.role !== "founder" && id !== actor.id)
		return { error: "Only a founder can reset another founder's password." };

	const admin = createAdminClient();
	const { error } = await admin.auth.admin.updateUserById(id, { password });
	if (error) return { error: error.message };
	await logActivity("reset_password", target.email, "Reset password");
	return { ok: true };
}
