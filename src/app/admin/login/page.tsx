"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setBusy(true);
		setError("");
		const supabase = createClient();
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			setBusy(false);
			setError(error.message);
			return;
		}
		const next =
			new URLSearchParams(window.location.search).get("next") ?? "/admin";
		window.location.href = next;
	};

	const inputCls =
		"w-full border-b border-cream/20 bg-transparent py-3 text-cream text-xl outline-none transition-colors placeholder:text-cream/25 focus:border-gold";

	return (
		<div className="flex min-h-dvh items-center justify-center px-6">
			<div className="w-full max-w-sm">
				<div className="mb-2 font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem]">
					SP Design Studio
				</div>
				<h1 className="mb-8 font-serif font-light text-cream text-4xl md:text-5xl">
					Studio CMS
				</h1>

				<form onSubmit={submit} className="flex flex-col gap-5">
					<label className="flex flex-col gap-2">
						<span className="font-sans font-light uppercase tracking-[0.28em] text-gold/80 text-[0.684rem]">
							Email
						</span>
						<input
							type="email"
							required
							autoFocus
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							className={inputCls}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="font-sans font-light uppercase tracking-[0.28em] text-gold/80 text-[0.684rem]">
							Password
						</span>
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							className={inputCls}
						/>
					</label>
					<button
						type="submit"
						disabled={busy}
						className="cta-gold group mt-2 inline-flex w-fit cursor-pointer items-center gap-3 bg-gold px-8 py-3.5 font-sans font-light uppercase tracking-[0.28em] text-plum-dark text-sm disabled:opacity-60">
						{busy ? "Signing in…" : "Sign in"}
						<span className="transition-transform duration-500 group-hover:translate-x-1">
							&rarr;
						</span>
					</button>
					{error && <p className="font-sans text-base text-gold/80">{error}</p>}
				</form>
			</div>
		</div>
	);
}
