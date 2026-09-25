"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { visibleGroups } from "@/lib/admin/sections";
import { hasUnsavedWork, subscribeDirty } from "@/lib/admin/useDirty";
import { signOut } from "../auth-actions";
import SignOutButton from "./SignOutButton";
import { NavProgress, NavWatch } from "./NavProgress";

interface Props {
	email: string;
	role: string;
	canManage: boolean;
	children: React.ReactNode;
}

export function AdminShell({ email, role, canManage, children }: Props) {
	const path = usePathname();
	const [open, setOpen] = useState(false);
	const [navLabel, setNavLabel] = useState<string | null>(null);
	const [unsaved, setUnsaved] = useState(false);

	useEffect(() => subscribeDirty((n) => setUnsaved(n > 0)), []);

	const guardNav = useCallback((e: React.MouseEvent) => {
		if (!hasUnsavedWork()) return;
		if (
			!window.confirm(
				"You have unsaved changes on this page. Leave without saving?",
			)
		)
			e.preventDefault();
	}, []);
	const groups = visibleGroups(canManage);

	const report = useCallback((label: string, pending: boolean) => {
		setNavLabel((prev) =>
			pending ? label : prev === label ? null : prev,
		);
	}, []);

	useEffect(() => {
		setOpen(false);
		setNavLabel(null);
	}, [path]);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const isActive = (href: string) =>
		href === "/admin" ? path === "/admin" : path.startsWith(href);

	const nav = (
		<nav className="flex flex-col gap-7">
			<Link
				href="/admin"
				onClick={guardNav}
				className={`flex items-center gap-2 border-l py-0.5 pl-3 font-sans font-light uppercase tracking-[0.24em] text-tiny transition-colors ${
					path === "/admin"
						? "border-gold text-gold"
						: "border-cream/10 text-cream/82 hover:border-cream/40 hover:text-gold"
				}`}>
				Overview
				<NavWatch label="Overview" onReport={report} />
			</Link>

			{groups.map((g) => (
				<div key={g.title} className="flex flex-col gap-2.5">
					<div className="border-l border-transparent pl-3 font-sans font-light uppercase tracking-[0.3em] text-cream/80 text-micro">
						{g.title}
					</div>
					{g.items.map((item) => {
						const active = isActive(item.href);
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={guardNav}
								className={`group flex items-center gap-2 border-l pl-3 py-0.5 font-sans font-light text-tiny transition-colors ${
									active
										? "border-gold text-gold"
										: "border-cream/10 text-cream/82 hover:border-cream/40 hover:text-gold"
								}`}>
								{item.label}
								<NavWatch label={item.label} onReport={report} />
							</Link>
						);
					})}
				</div>
			))}
		</nav>
	);

	return (
		<div className="min-h-dvh bg-plum-dark text-cream lg:flex">
			<aside className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-cream/10 bg-plum-dark/95 px-6 py-4 backdrop-blur lg:hidden">
				<Link
					href="/admin"
					className="font-sans font-light uppercase tracking-[0.32em] text-gold text-tiny">
					SP · Studio CMS
				</Link>
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					aria-label="Toggle menu"
					aria-expanded={open}
					className="cursor-pointer rounded-sm border border-cream/25 px-3 py-1.5 font-sans font-light uppercase tracking-[0.2em] text-cream/85 text-micro transition-colors hover:border-gold hover:text-gold">
					{open ? "Close" : "Menu"}
				</button>
			</aside>

			{open && (
				<button
					type="button"
					aria-hidden
					tabIndex={-1}
					onClick={() => setOpen(false)}
					className="fixed inset-0 z-40 bg-plum-dark/70 backdrop-blur-sm lg:hidden"
				/>
			)}

			<div
				className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col justify-between overflow-y-auto border-r border-cream/10 bg-plum-dark px-6 py-7 transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-64 lg:translate-x-0 ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}>
				<div className="flex flex-col gap-8">
					<Link
						href="/admin"
						className="hidden font-sans font-light uppercase tracking-[0.32em] text-gold text-tiny lg:block">
						SP · Studio CMS
					</Link>
					{nav}
				</div>

				<div className="mt-10 flex flex-col gap-3 border-t border-cream/10 pt-5">
					<a
						href="/"
						target="_blank"
						rel="noopener noreferrer"
						className="group inline-flex items-center gap-1.5 font-sans font-light uppercase tracking-[0.24em] text-cream/82 text-tiny transition-colors hover:text-gold">
						View site
						<span className="transition-transform duration-300 group-hover:translate-x-0.5">
							↗
						</span>
					</a>
					{unsaved && (
						<div className="flex items-center gap-2 rounded-sm border border-gold/35 bg-gold/5 px-2.5 py-1.5">
							<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold [animation:admin-pulse_1.6s_ease-in-out_infinite]" />
							<span className="font-sans font-light text-gold text-micro">
								Unsaved changes
							</span>
						</div>
					)}
					<div className="truncate font-sans font-light text-cream/82 text-micro">
						{email}
					</div>
					<div className="flex items-center justify-between gap-3">
						<span className="rounded-full border border-gold/30 px-2.5 py-0.5 font-sans font-light uppercase tracking-[0.24em] text-gold text-micro">
							{role}
						</span>
						<form action={signOut}>
							<SignOutButton />
						</form>
					</div>
				</div>
			</div>

			<main className="relative min-w-0 flex-1">
				<NavProgress label={navLabel} />
				<div key={path} className="admin-page">
					{children}
				</div>
			</main>
		</div>
	);
}
