import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export interface ActivityEntry {
	id: string;
	actor_email: string | null;
	actor_name: string | null;
	action: string;
	target: string | null;
	detail: string | null;
	created_at: string;
}

export const ACTION_LABELS: Record<string, string> = {
	edit: "Edited",
	publish: "Published",
	discard: "Reverted",
	create_user: "Added user",
	update_role: "Changed role",
	delete_user: "Removed user",
	reset_password: "Reset password",
};

export const ACTIVITY_FILTERS: Record<string, string[]> = {
	edits: ["edit"],
	publishes: ["publish", "discard"],
	team: ["create_user", "update_role", "delete_user", "reset_password"],
};

export async function logActivity(
	action: string,
	target?: string | null,
	detail?: string | null,
): Promise<void> {
	try {
		const profile = await getProfile();
		const supabase = await createClient();
		await supabase.from("activity_log").insert({
			actor_id: profile?.id ?? null,
			actor_email: profile?.email ?? null,
			actor_name: profile?.full_name ?? null,
			action,
			target: target ?? null,
			detail: detail ?? null,
		});
	} catch {
		return;
	}
}

export async function getRecentActivity(limit = 25): Promise<ActivityEntry[]> {
	const supabase = await createClient();
	const { data } = await supabase
		.from("activity_log")
		.select("id, actor_email, actor_name, action, target, detail, created_at")
		.order("created_at", { ascending: false })
		.limit(limit);
	return (data as ActivityEntry[]) ?? [];
}

export async function getActivityLog(
	filter?: string,
	limit = 200,
): Promise<ActivityEntry[]> {
	const supabase = await createClient();
	let query = supabase
		.from("activity_log")
		.select("id, actor_email, actor_name, action, target, detail, created_at")
		.order("created_at", { ascending: false })
		.limit(limit);
	if (filter && ACTIVITY_FILTERS[filter])
		query = query.in("action", ACTIVITY_FILTERS[filter]);
	const { data } = await query;
	return (data as ActivityEntry[]) ?? [];
}

export async function getProfiles() {
	const supabase = await createClient();
	const { data } = await supabase
		.from("profiles")
		.select("id, email, role, full_name, created_at")
		.order("created_at", { ascending: true });
	return data ?? [];
}
