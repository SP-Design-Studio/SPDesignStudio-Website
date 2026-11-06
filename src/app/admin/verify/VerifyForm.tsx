"use client";

import { useActionState, useEffect, useRef } from "react";
import { verifyCode, type VerifyState } from "./actions";
import { signOut } from "../auth-actions";
import { AuthScreen } from "@/components/admin/AuthScreen";
import AuthOverlay from "@/components/admin/AuthOverlay";
import { ui } from "@/lib/admin/ui";

export function VerifyForm() {
	const [state, action, pending] = useActionState(verifyCode, {} as VerifyState);
	const form = useRef<HTMLFormElement>(null);
	const input = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (state.error) input.current?.focus();
	}, [state]);

	return (
		<AuthScreen title="Your code">
			<AuthOverlay show={pending} label="Checking your code" />
			<form ref={form} action={action} className="flex flex-col gap-6">
				<p className="font-sans font-light text-cream/90 text-base leading-relaxed">
					Open your authenticator app and enter the 6 digits it shows for SP
					Design Studio.
				</p>
				<label className="flex flex-col gap-2">
					<span className="font-sans font-light uppercase tracking-[0.28em] text-gold text-tiny">
						6-digit code
					</span>
					<input
						ref={input}
						name="code"
						inputMode="numeric"
						autoComplete="one-time-code"
						pattern="[0-9 ]*"
						maxLength={7}
						required
						autoFocus
						placeholder="123 456"
						onChange={(e) => {
							if (!pending && e.target.value.replace(/\D/g, "").length === 6)
								form.current?.requestSubmit();
						}}
						className={`${ui.input} text-xl tracking-[0.3em] tabular-nums`}
					/>
				</label>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
					<button
						type="submit"
						disabled={pending}
						className="cta-gold group inline-flex w-fit cursor-pointer items-center gap-3 bg-gold px-8 py-3.5 font-sans font-light uppercase tracking-[0.28em] text-plum-dark text-sm disabled:opacity-60">
						{pending ? "Checking…" : "Continue"}
						<span className="transition-transform duration-500 group-hover:translate-x-1">
							&rarr;
						</span>
					</button>
					<button
						type="submit"
						formAction={signOut}
						formNoValidate
						className={ui.btnQuiet}>
						Use a different account
					</button>
				</div>
				{state.error && (
					<p role="alert" className="font-sans text-base text-gold">
						{state.error}
					</p>
				)}
			</form>
		</AuthScreen>
	);
}
