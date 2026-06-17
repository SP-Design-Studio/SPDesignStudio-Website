"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";

function Spinner() {
	const { pending } = useLinkStatus();
	if (!pending) return null;
	return (
		<span
			aria-hidden
			className="ml-1.5 inline-block h-2.5 w-2.5 animate-spin rounded-full border border-gold/40 border-t-gold align-middle"
		/>
	);
}

export function NavLink({
	href,
	className,
	children,
}: {
	href: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<Link href={href} className={className}>
			{children}
			<Spinner />
		</Link>
	);
}
