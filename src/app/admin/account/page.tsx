import { requireRole } from "@/lib/auth";
import { ProfileName } from "./ProfileName";

export const metadata = { title: "Account" };

export default async function AccountRoute() {
	const profile = await requireRole("editor");

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<div className="mb-10">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Account
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Your account
				</h1>
				<p className="mt-3 font-sans font-light text-cream/80 text-base">
					Signed in as {profile.email} ({profile.role}). Set the name shown in
					your greeting.
				</p>
			</div>
			<ProfileName initial={profile.full_name ?? ""} />
		</div>
	);
}
