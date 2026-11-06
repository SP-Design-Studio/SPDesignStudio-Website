import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "founder" | "admin" | "editor";

export type MfaState = "ok" | "verify" | "enroll";

export interface Profile {
  id: string;
  email: string;
  role: Role;
  full_name: string | null;
  mfa: MfaState;
}

const MFA_REQUIRED_ROLES = new Set<Role>(["founder", "admin"]);
const MFA_SWITCHED_ON = process.env.ADMIN_MFA !== "off";

export function mfaRequired(role: Role): boolean {
  return MFA_SWITCHED_ON && MFA_REQUIRED_ROLES.has(role);
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

async function mfaState(role: Role): Promise<MfaState> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || !data) return mfaRequired(role) ? "verify" : "ok";
  if (data.nextLevel === "aal2" && data.currentLevel !== "aal2") return "verify";
  if (data.nextLevel !== "aal2" && mfaRequired(role)) return "enroll";
  return "ok";
}

export async function getProfile(): Promise<Profile | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, role, full_name")
    .eq("id", user.id)
    .single();
  if (!data) return null;
  const base = data as Omit<Profile, "mfa">;
  return { ...base, mfa: await mfaState(base.role) };
}

const ROLE_RANK: Record<Role, number> = { editor: 1, admin: 2, founder: 3 };

export async function requireRole(
  min: Role,
  opts: { allowSetup?: boolean } = {},
): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect("/admin/login");
  if (profile.mfa === "verify") redirect("/admin/verify");
  if (profile.mfa === "enroll" && !opts.allowSetup) redirect("/admin/account");
  if (ROLE_RANK[profile.role] < ROLE_RANK[min]) redirect("/admin");
  return profile;
}
