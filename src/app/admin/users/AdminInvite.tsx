"use client";

import { useActionState } from "react";
import { createUser, type CreateUserState } from "./actions";
import { ui } from "@/lib/admin/ui";

const initial: CreateUserState = {};

export function AdminInvite() {
	const [state, action, pending] = useActionState(createUser, initial);

	return (
		<form action={action} className="flex flex-col gap-5">
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<label className="flex flex-col gap-2">
					<span className="font-sans font-light uppercase tracking-[0.28em] text-gold text-tiny">
						Full name
					</span>
					<input
						type="text"
						name="full_name"
						placeholder="First Last"
						className={ui.input}
					/>
				</label>
				<label className="flex flex-col gap-2">
					<span className="font-sans font-light uppercase tracking-[0.28em] text-gold text-tiny">
						Email
					</span>
					<input
						type="email"
						name="email"
						required
						placeholder="person@example.com"
						className={ui.input}
					/>
				</label>
				<label className="flex flex-col gap-2">
					<span className="font-sans font-light uppercase tracking-[0.28em] text-gold text-tiny">
						Role
					</span>
					<select
						name="role"
						defaultValue="editor"
						className={`${ui.input} cursor-pointer`}>
						<option value="editor" className="bg-plum-dark">
							Editor
						</option>
						<option value="admin" className="bg-plum-dark">
							Admin
						</option>
					</select>
				</label>
			</div>
			<label className="flex flex-col gap-2">
				<span className="font-sans font-light uppercase tracking-[0.28em] text-gold text-tiny">
					Temporary password
				</span>
				<input
					type="text"
					name="password"
					required
					minLength={8}
					placeholder="At least 8 characters"
					className={ui.input}
				/>
				<span className="font-sans font-light text-cream/80 text-tiny">
					Share this with them; they can change it later.
				</span>
			</label>
			<button
				type="submit"
				disabled={pending}
				className="cta-gold w-fit cursor-pointer bg-gold px-7 py-3 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-sm disabled:opacity-60">
				{pending ? "Creating…" : "Create user"}
			</button>
			{state.error && (
				<p className="font-sans text-base text-gold">{state.error}</p>
			)}
			{state.ok && (
				<p className="font-sans text-base text-cream/82">{state.ok}</p>
			)}
		</form>
	);
}
