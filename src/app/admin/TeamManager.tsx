"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole, deleteUser, resetUserPassword } from "./actions";

type Member = {
	id: string;
	email: string;
	role: string;
	full_name: string | null;
};

const ROLE_OPTIONS = ["founder", "admin", "editor"];

function Row({
	member,
	currentUserId,
	currentRole,
}: {
	member: Member;
	currentUserId: string;
	currentRole: string;
}) {
	const router = useRouter();
	const [pending, start] = useTransition();
	const [msg, setMsg] = useState("");
	const [pw, setPw] = useState("");
	const [showPw, setShowPw] = useState(false);

	const isSelf = member.id === currentUserId;
	const canEditFounder = currentRole === "founder";
	const lockedRole =
		isSelf || (member.role === "founder" && !canEditFounder);

	return (
		<div className="flex flex-col gap-3 border-b border-cream/10 py-4 last:border-b-0">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="min-w-0">
					<div className="font-serif font-light text-cream text-lg">
						{member.full_name?.trim() || member.email.split("@")[0]}
						{isSelf && (
							<span className="ml-2 font-sans font-light uppercase tracking-[0.18em] text-cream/30 text-[0.5rem]">
								You
							</span>
						)}
					</div>
					<div className="font-sans font-light text-cream/40 text-[0.7rem]">
						{member.email}
					</div>
				</div>
				<div className="flex items-center gap-3">
					<select
						value={member.role}
						disabled={pending || lockedRole}
						onChange={(e) =>
							start(async () => {
								setMsg("");
								const res = await updateUserRole(member.id, e.target.value);
								setMsg(res.error ? res.error : "Role updated");
								router.refresh();
							})
						}
						className="cursor-pointer border-b border-cream/20 bg-transparent py-1.5 text-cream text-sm outline-none focus:border-gold disabled:cursor-not-allowed disabled:text-cream/40">
						{ROLE_OPTIONS.map((r) => (
							<option key={r} value={r} className="bg-plum-dark">
								{r.charAt(0).toUpperCase() + r.slice(1)}
							</option>
						))}
					</select>
					<button
						type="button"
						onClick={() => setShowPw((v) => !v)}
						className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/40 text-[0.55rem] transition-colors hover:text-gold">
						Password
					</button>
					{!isSelf && (
						<button
							type="button"
							disabled={pending}
							onClick={() => {
								if (
									!window.confirm(
										`Remove ${member.email}? This permanently deletes their account.`,
									)
								)
									return;
								start(async () => {
									setMsg("");
									const res = await deleteUser(member.id);
									setMsg(res.error ? res.error : "Removed");
									router.refresh();
								});
							}}
							className="cursor-pointer font-sans font-light uppercase tracking-[0.2em] text-cream/40 text-[0.55rem] transition-colors hover:text-gold disabled:opacity-50">
							Remove
						</button>
					)}
				</div>
			</div>
			{showPw && (
				<div className="flex items-center gap-3">
					<input
						type="text"
						value={pw}
						onChange={(e) => setPw(e.target.value)}
						placeholder="New password (min 8 chars)"
						className="w-64 border-b border-cream/20 bg-transparent py-1.5 text-cream text-sm outline-none placeholder:text-cream/25 focus:border-gold"
					/>
					<button
						type="button"
						disabled={pending || pw.length < 8}
						onClick={() =>
							start(async () => {
								setMsg("");
								const res = await resetUserPassword(member.id, pw);
								setMsg(res.error ? res.error : "Password set");
								setPw("");
								setShowPw(false);
							})
						}
						className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.2em] text-plum-dark text-[0.55rem] disabled:opacity-50">
						Set password
					</button>
				</div>
			)}
			{msg && (
				<span className="font-sans font-light text-cream/50 text-xs">{msg}</span>
			)}
		</div>
	);
}

export function TeamManager({
	members,
	currentUserId,
	currentRole,
}: {
	members: Member[];
	currentUserId: string;
	currentRole: string;
}) {
	return (
		<div className="flex flex-col">
			{members.map((m) => (
				<Row
					key={m.id}
					member={m}
					currentUserId={currentUserId}
					currentRole={currentRole}
				/>
			))}
		</div>
	);
}
