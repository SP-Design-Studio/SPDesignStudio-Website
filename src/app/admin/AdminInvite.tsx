"use client";

import { useActionState } from "react";
import { createUser, type CreateUserState } from "./actions";

const initial: CreateUserState = {};

export function AdminInvite() {
	const [state, action, pending] = useActionState(createUser, initial);

	const inputCls =
		"w-full border-b border-cream/20 bg-transparent py-2.5 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold";

	return (
		<form action={action} className="flex flex-col gap-5">
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<label className="flex flex-col gap-2">
					<span className="font-sans font-light uppercase tracking-[0.28em] text-gold/80 text-[0.55rem]">
						Full name
					</span>
					<input
						type="text"
						name="full_name"
						placeholder="First Last"
						className={inputCls}
					/>
				</label>
				<label className="flex flex-col gap-2">
					<span className="font-sans font-light uppercase tracking-[0.28em] text-gold/80 text-[0.55rem]">
						Email
					</span>
					<input
						type="email"
						name="email"
						required
						placeholder="person@example.com"
						className={inputCls}
					/>
				</label>
				<label className="flex flex-col gap-2">
					<span className="font-sans font-light uppercase tracking-[0.28em] text-gold/80 text-[0.55rem]">
						Role
					</span>
					<select
						name="role"
						defaultValue="editor"
						className={`${inputCls} cursor-pointer`}>
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
				<span className="font-sans font-light uppercase tracking-[0.28em] text-gold/80 text-[0.55rem]">
					Temporary password
				</span>
				<input
					type="text"
					name="password"
					required
					minLength={8}
					placeholder="At least 8 characters"
					className={inputCls}
				/>
				<span className="font-sans font-light text-cream/35 text-[0.62rem]">
					Share this with them; they can change it later.
				</span>
			</label>
			<button
				type="submit"
				disabled={pending}
				className="cta-gold w-fit cursor-pointer bg-gold px-7 py-3 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-xs disabled:opacity-60">
				{pending ? "Creating…" : "Create user"}
			</button>
			{state.error && (
				<p className="font-sans text-sm text-gold/80">{state.error}</p>
			)}
			{state.ok && (
				<p className="font-sans text-sm text-cream/60">{state.ok}</p>
			)}
		</form>
	);
}
