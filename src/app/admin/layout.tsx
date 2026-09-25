import type { Metadata } from "next";
import { getProfile } from "@/lib/auth";
import { AdminShell } from "./_components/AdminShell";
import { SavingOverlay } from "@/lib/admin/saving";

export const metadata: Metadata = {
	title: { template: "%s · Studio CMS", default: "Studio CMS" },
};

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const profile = await getProfile();

	if (!profile)
		return (
			<div className="min-h-dvh bg-plum-dark text-cream">
				{children}
				<SavingOverlay />
			</div>
		);

	return (
		<>
			<AdminShell
				email={profile.email}
				role={profile.role}
				canManage={profile.role === "founder" || profile.role === "admin"}>
				{children}
			</AdminShell>
			<SavingOverlay />
		</>
	);
}
