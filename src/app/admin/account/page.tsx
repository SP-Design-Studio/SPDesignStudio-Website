import { requireRole, mfaRequired } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfileName } from "./ProfileName";
import { MfaPanel, MfaSetupFlow } from "./MfaPanel";
import { AuthScreen } from "@/components/admin/AuthScreen";
import { signOut } from "../auth-actions";
import SignOutButton from "../_components/SignOutButton";

export const metadata = { title: "Account" };

export default async function AccountRoute() {
	const profile = await requireRole("editor", { allowSetup: true });

	if (profile.mfa === "enroll") {
		return (
			<AuthScreen title="Secure your account">
				<div className="flex flex-col gap-7">
					<p className="font-sans font-light text-cream/90 text-base leading-relaxed">
						Your role needs two-step sign-in. Set it up once with an
						authenticator app, and you&rsquo;re in.
					</p>
					<MfaSetupFlow />
					<form action={signOut}>
						<SignOutButton />
					</form>
				</div>
			</AuthScreen>
		);
	}

	const supabase = await createClient();
	const { data } = await supabase.auth.mfa.listFactors();
	const factorId = data?.totp?.[0]?.id ?? null;

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<div className="mb-10">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-tiny mb-3">
					Account
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Your account
				</h1>
				<p className="mt-3 font-sans font-light text-cream/80 text-base">
					Signed in as {profile.email} ({profile.role}). Set the name shown in
					your greeting and manage two-step sign-in.
				</p>
			</div>
			<div className="flex flex-col gap-12">
				<ProfileName initial={profile.full_name ?? ""} />
				<MfaPanel factorId={factorId} required={mfaRequired(profile.role)} />
			</div>
		</div>
	);
}
