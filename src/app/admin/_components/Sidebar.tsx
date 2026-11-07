"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { AdminGroup, AdminSection } from "@/lib/admin/sections";
import type { PendingMap } from "@/lib/admin/usePending";
import { signOut } from "../auth-actions";
import SignOutButton from "./SignOutButton";
import { NavWatch } from "./NavProgress";

const STORE = "admin-nav-open";

interface Props {
	groups: AdminGroup[];
	path: string;
	canManage: boolean;
	pending: PendingMap | null;
	unsaved: boolean;
	name: string;
	role: string;
	onNavigate: (e: React.MouseEvent, href: string) => void;
	onReport: (label: string, pending: boolean) => void;
}

function sectionPending(item: AdminSection, pending: PendingMap | null) {
	if (!pending || !item.page) return false;
	const p = pending[item.page];
	if (!p) return false;
	if (p.status === "unpublished") return true;
	if (p.status === "clean") return false;
	return item.keys ? item.keys.some((k) => p.dirtyKeys.includes(k)) : true;
}

const linkBase =
	"relative flex items-center gap-2 py-1.5 font-sans font-light text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function NavLinkItem({
	href,
	label,
	active,
	dot,
	count,
	onNavigate,
	onReport,
}: {
	href: string;
	label: string;
	active: boolean;
	dot?: boolean;
	count?: number;
	onNavigate: Props["onNavigate"];
	onReport: Props["onReport"];
}) {
	return (
		<Link
			href={href}
			onClick={(e) => onNavigate(e, href)}
			aria-current={active ? "page" : undefined}
			className={`${linkBase} ${
				active ? "text-gold" : "text-cream/85 hover:text-gold"
			}`}>
			{active && (
				<span
					aria-hidden
					className="absolute -left-3.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-gold"
				/>
			)}
			{label}
			{count ? (
				<span className="ml-auto rounded-full bg-warn/15 px-2 py-0.5 font-sans tabular-nums text-warn text-micro">
					{count}
				</span>
			) : dot ? (
				<span
					role="img"
					aria-label="Unpublished changes"
					className="ml-auto h-1.5 w-1.5 rounded-full bg-warn"
				/>
			) : null}
			<NavWatch label={label} onReport={onReport} />
		</Link>
	);
}

function Group({
	group,
	open,
	forced,
	pendingAny,
	onToggle,
	children,
}: {
	group: AdminGroup;
	open: boolean;
	forced: boolean;
	pendingAny: boolean;
	onToggle: () => void;
	children: React.ReactNode;
}) {
	const shown = open || forced;
	return (
		<div>
			<button
				type="button"
				onClick={onToggle}
				aria-expanded={shown}
				className="flex w-full cursor-pointer items-center gap-2 py-1 text-left font-sans font-light uppercase tracking-[0.3em] text-cream/70 text-micro transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
				{group.title}
				{!shown && pendingAny && (
					<span
						aria-hidden
						className="h-1.5 w-1.5 rounded-full bg-warn"
					/>
				)}
				<span
					aria-hidden
					className={`ml-auto text-cream/50 transition-transform duration-300 ${
						shown ? "rotate-90" : ""
					}`}>
					›
				</span>
			</button>
			<div
				className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
				style={{ gridTemplateRows: shown ? "1fr" : "0fr" }}>
				<div className="overflow-hidden" inert={!shown}>
					<div className="flex flex-col pt-1">{children}</div>
				</div>
			</div>
		</div>
	);
}

export function Sidebar({
	groups,
	path,
	canManage,
	pending,
	unsaved,
	name,
	role,
	onNavigate,
	onReport,
}: Props) {
	const [open, setOpen] = useState<Record<string, boolean>>({});

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORE);
			if (raw) setOpen(JSON.parse(raw) as Record<string, boolean>);
		} catch {
			return;
		}
	}, []);

	const toggle = useCallback((title: string, now: boolean) => {
		setOpen((prev) => {
			const next = { ...prev, [title]: !now };
			try {
				localStorage.setItem(STORE, JSON.stringify(next));
			} catch {
				return next;
			}
			return next;
		});
	}, []);

	const isActive = (href: string) =>
		href === "/admin" ? path === "/admin" : path.startsWith(href);

	const publishCount = pending
		? Object.values(pending).filter((p) => p.status !== "clean").length
		: 0;

	return (
		<>
			<div className="flex flex-col gap-9">
				<Link
					href="/admin"
					className="hidden items-baseline gap-3 lg:flex">
					<span className="font-alta text-gold text-3xl leading-none tracking-[0.04em]">
						SP
					</span>
					<span className="font-sans uppercase tracking-[0.4em] text-cream/80 text-micro">
						Studio CMS
					</span>
				</Link>

				<nav className="flex flex-col gap-7 pl-3.5">
					<div className="flex flex-col">
						<NavLinkItem
							href="/admin"
							label="Overview"
							active={path === "/admin"}
							onNavigate={onNavigate}
							onReport={onReport}
						/>
						{canManage && (
							<NavLinkItem
								href="/admin/publish"
								label="Publish"
								active={isActive("/admin/publish")}
								count={publishCount}
								onNavigate={onNavigate}
								onReport={onReport}
							/>
						)}
					</div>

					{groups.map((g) => {
						const active = g.items.some((i) => isActive(i.href));
						const pendingAny = g.items.some((i) => sectionPending(i, pending));
						return (
							<Group
								key={g.title}
								group={g}
								open={open[g.title] ?? false}
								forced={active}
								pendingAny={pendingAny}
								onToggle={() =>
									toggle(g.title, (open[g.title] ?? false) || active)
								}>
								{g.items.map((item) => (
									<NavLinkItem
										key={item.href}
										href={item.href}
										label={item.label}
										active={isActive(item.href)}
										dot={sectionPending(item, pending)}
										onNavigate={onNavigate}
										onReport={onReport}
									/>
								))}
							</Group>
						);
					})}
				</nav>
			</div>

			<div className="relative mt-10 pt-4">
				<span
					aria-hidden
					className="absolute inset-x-0 top-0 h-px bg-cream/[0.07]"
				/>
				{unsaved && (
					<div className="mb-3 flex items-center gap-2 rounded-sm border border-warn/40 bg-warn/10 px-2.5 py-1.5">
						<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn [animation:admin-pulse_1.6s_ease-in-out_infinite]" />
						<span className="font-sans font-light text-warn text-micro">
							Unsaved changes
						</span>
					</div>
				)}
				<Link
					href="/admin/account"
					onClick={(e) => onNavigate(e, "/admin/account")}
					aria-current={isActive("/admin/account") ? "page" : undefined}
					className="flex items-center gap-3 rounded-sm py-1.5 transition-colors hover:bg-plum/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
					<span
						className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border font-serif text-lg leading-none ${
							isActive("/admin/account")
								? "border-gold text-gold"
								: "border-gold/40 text-gold"
						}`}>
						{name.charAt(0).toUpperCase()}
					</span>
					<span className="min-w-0">
						<span className="block truncate font-sans text-cream text-sm">
							{name}
						</span>
						<span className="block font-sans uppercase tracking-[0.22em] text-cream/60 text-micro">
							{role}
						</span>
					</span>
				</Link>
				<div className="mt-3 flex items-center justify-between gap-3">
					<a
						href="/"
						target="_blank"
						rel="noopener noreferrer"
						className="font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-tiny transition-colors hover:text-gold">
						View site ↗
					</a>
					<form action={signOut}>
						<SignOutButton />
					</form>
				</div>
			</div>
		</>
	);
}
