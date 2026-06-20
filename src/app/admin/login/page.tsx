"use client";

import { useActionState, useEffect, useState } from "react";
import Script from "next/script";
import { login } from "./actions";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export default function AdminLoginPage() {
	const [state, formAction, pending] = useActionState(login, {});
	const [next, setNext] = useState("/admin");

	useEffect(() => {
		const n = new URLSearchParams(window.location.search).get("next");
		if (n && n.startsWith("/admin") && !n.startsWith("//")) setNext(n);
	}, []);

	const inputCls =
		"w-full border-b border-cream/20 bg-transparent py-3 text-cream text-xl outline-none transition-colors placeholder:text-cream/25 focus:border-gold";

	return (
		<div className="flex min-h-dvh items-center justify-center px-6">
			{SITE_KEY && (
				<Script
					src="https://challenges.cloudflare.com/turnstile/v0/api.js"
					strategy="afterInteractive"
				/>
			)}
			<div className="w-full max-w-sm">
				<div className="mb-2 font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem]">
					SP Design Studio
				</div>
				<h1 className="mb-8 font-serif font-light text-cream text-4xl md:text-5xl">
					Studio CMS
				</h1>

				<form action={formAction} className="flex flex-col gap-5">
					<input type="hidden" name="next" value={next} />
					<label className="flex flex-col gap-2">
						<span className="font-sans font-light uppercase tracking-[0.28em] text-gold text-[0.684rem]">
							Email
						</span>
						<input
							type="email"
							name="email"
							required
							autoFocus
							autoComplete="username"
							placeholder="you@example.com"
							className={inputCls}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="font-sans font-light uppercase tracking-[0.28em] text-gold text-[0.684rem]">
							Password
						</span>
						<input
							type="password"
							name="password"
							required
							autoComplete="current-password"
							placeholder="••••••••"
							className={inputCls}
						/>
					</label>

					{SITE_KEY && (
						<div
							className="cf-turnstile"
							data-sitekey={SITE_KEY}
							data-theme="dark"
						/>
					)}

					<button
						type="submit"
						disabled={pending}
						className="cta-gold group mt-2 inline-flex w-fit cursor-pointer items-center gap-3 bg-gold px-8 py-3.5 font-sans font-light uppercase tracking-[0.28em] text-plum-dark text-sm disabled:opacity-60">
						{pending ? "Signing in…" : "Sign in"}
						<span className="transition-transform duration-500 group-hover:translate-x-1">
							&rarr;
						</span>
					</button>
					{state.error && (
						<p className="font-sans text-base text-gold">{state.error}</p>
					)}
				</form>
			</div>
		</div>
	);
}
