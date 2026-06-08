import { requireRole } from "@/lib/auth";
import { getProfiles } from "@/lib/cms/activity";
import { TeamManager } from "../TeamManager";
import { AdminInvite } from "../AdminInvite";

export const metadata = { title: "Users" };

export default async function UsersRoute() {
	const profile = await requireRole("admin");
	const members = await getProfiles();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<div className="mb-10">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.6rem] mb-3">
					Users
				</div>
				<h1 className="font-serif font-light text-cream text-3xl md:text-4xl">
					Team access
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-sm">
					Manage who can sign in. Change roles, reset passwords, or remove
					accounts.
				</p>
			</div>
			<TeamManager
				members={members}
				currentUserId={profile.id}
				currentRole={profile.role}
			/>
			<div className="mt-12 border-t border-cream/10 pt-10">
				<div className="font-sans font-light uppercase tracking-[0.32em] text-gold text-[0.58rem] mb-2">
					Add a team member
				</div>
				<p className="mb-6 font-sans font-light text-cream/45 text-sm">
					They sign in with the email and password you set here.
				</p>
				<AdminInvite />
			</div>
		</div>
	);
}
