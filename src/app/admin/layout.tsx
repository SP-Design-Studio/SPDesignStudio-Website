import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { signOut } from "./auth-actions";
import { AdminNav } from "./_components/AdminNav";
import SignOutButton from "./_components/SignOutButton";
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

	return (
		<div className="min-h-dvh bg-plum-dark text-cream">
			{profile && (
				<header className="sticky top-0 z-30 flex items-center justify-between border-b border-cream/10 bg-plum-dark/90 px-6 py-5 backdrop-blur md:px-10">
					<div className="flex items-center gap-8">
						<Link
							href="/admin"
							className="font-sans font-light uppercase tracking-[0.32em] text-gold text-[0.732rem]">
							SP · Studio CMS
						</Link>
						<AdminNav
							canManage={
								profile.role === "founder" || profile.role === "admin"
							}
						/>
					</div>
					<div className="flex items-center gap-5">
						<a
							href="/"
							target="_blank"
							rel="noopener noreferrer"
							className="group inline-flex items-center gap-1.5 font-sans font-light uppercase tracking-[0.24em] text-cream/82 text-[0.708rem] transition-colors hover:text-gold">
							View site
							<span className="transition-transform duration-300 group-hover:translate-x-0.5">
								↗
							</span>
						</a>
						<span className="hidden font-sans font-light text-cream/80 text-[0.732rem] sm:inline">
							{profile.email}
						</span>
						<span className="rounded-full border border-gold/30 px-3 py-1 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.614rem]">
							{profile.role}
						</span>
						<form action={signOut}>
							<SignOutButton />
						</form>
					</div>
				</header>
			)}
			<main>{children}</main>
			<SavingOverlay />
		</div>
	);
}
