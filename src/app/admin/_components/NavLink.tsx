"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";

export function LinkSpinner({ className = "ml-1.5" }: { className?: string }) {
	const { pending } = useLinkStatus();
	if (!pending) return null;
	return (
		<span
			aria-hidden
			className={`inline-block h-2.5 w-2.5 animate-spin rounded-full border border-gold/40 border-t-gold align-middle ${className}`}
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
			<LinkSpinner />
		</Link>
	);
}
