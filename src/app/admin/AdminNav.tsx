"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminNav({ canManage }: { canManage: boolean }) {
	const path = usePathname();
	const [navTo, setNavTo] = useState<string | null>(null);

	useEffect(() => {
		setNavTo(null);
	}, [path]);

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
			{links.map((l) => {
				const loading = navTo === l.href;
				return (
					<Link
						key={l.href}
						href={l.href}
						onClick={() => {
							if (!active(l.href)) setNavTo(l.href);
						}}
						className={`inline-flex items-center gap-1.5 font-sans font-light uppercase tracking-[0.24em] text-[0.708rem] transition-colors ${
							active(l.href) ? "text-gold" : "text-cream/82 hover:text-gold"
						}`}>
						{l.label}
						{loading && (
							<span
								aria-hidden
								className="inline-block h-2.5 w-2.5 animate-spin rounded-full border border-gold/40 border-t-gold"
							/>
						)}
					</Link>
				);
			})}
		</nav>
	);
}
