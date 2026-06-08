"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav({ canManage }: { canManage: boolean }) {
	const path = usePathname();
	const links = [
		{ href: "/admin", label: "Overview" },
		...(canManage
			? [
					{ href: "/admin/publish", label: "Publish" },
					{ href: "/admin/users", label: "Users" },
					{ href: "/admin/activity", label: "Activity" },
				]
			: []),
		{ href: "/admin/account", label: "Account" },
	];
	const active = (href: string) =>
		href === "/admin" ? path === "/admin" : path.startsWith(href);

	return (
		<nav className="flex items-center gap-5">
			{links.map((l) => (
				<Link
					key={l.href}
					href={l.href}
					className={`font-sans font-light uppercase tracking-[0.24em] text-[0.708rem] transition-colors ${
						active(l.href) ? "text-gold" : "text-cream/55 hover:text-gold"
					}`}>
					{l.label}
				</Link>
			))}
		</nav>
	);
}
