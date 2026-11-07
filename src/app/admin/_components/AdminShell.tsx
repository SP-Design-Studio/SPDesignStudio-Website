"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { visibleGroups } from "@/lib/admin/sections";
import { hasUnsavedWork, subscribeDirty } from "@/lib/admin/useDirty";
import { usePending } from "@/lib/admin/usePending";
import { NavProgress } from "./NavProgress";
import { Sidebar } from "./Sidebar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface Props {
	name: string;
	role: string;
	canManage: boolean;
	children: React.ReactNode;
}

export function AdminShell({ name, role, canManage, children }: Props) {
	const path = usePathname();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [leaveTo, setLeaveTo] = useState<string | null>(null);
	const [navLabel, setNavLabel] = useState<string | null>(null);
	const [unsaved, setUnsaved] = useState(false);

	useEffect(() => subscribeDirty((n) => setUnsaved(n > 0)), []);

	const guardNav = useCallback((e: React.MouseEvent, href: string) => {
		if (!hasUnsavedWork()) return;
		e.preventDefault();
		setLeaveTo(href);
	}, []);
	const groups = visibleGroups(canManage);
	const pending = usePending(path);

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

	return (
		<div className="min-h-dvh bg-plum-dark text-cream lg:flex">
			<aside className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-cream/10 bg-plum-dark/95 px-6 pb-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur lg:hidden">
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
				className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col justify-between overflow-y-auto border-r border-cream/[0.07] bg-plum-dark px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[max(1.75rem,env(safe-area-inset-top))] transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-64 lg:translate-x-0 ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}>
				<Sidebar
					groups={groups}
					path={path}
					canManage={canManage}
					pending={pending}
					unsaved={unsaved}
					name={name}
					role={role}
					onNavigate={guardNav}
					onReport={report}
				/>
			</div>

			<ConfirmDialog
				open={leaveTo !== null}
				title="Leave without saving?"
				message="You have unsaved changes on this page. They'll be lost if you leave."
				confirmLabel="Leave"
				cancelLabel="Stay"
				onCancel={() => setLeaveTo(null)}
				onConfirm={() => {
					const href = leaveTo;
					setLeaveTo(null);
					if (href) router.push(href);
				}}
			/>
			<main className="relative min-w-0 flex-1">
				<NavProgress label={navLabel} />
				<div key={path} className="admin-page">
					{children}
				</div>
			</main>
		</div>
	);
}
