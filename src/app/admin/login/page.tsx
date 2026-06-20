"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { login } from "./actions";
import AuthOverlay from "@/components/admin/AuthOverlay";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

interface TurnstileApi {
	render: (el: HTMLElement, opts: Record<string, unknown>) => string;
	reset: (id?: string) => void;
	remove: (id: string) => void;
}

declare global {
	interface Window {
		turnstile?: TurnstileApi;
	}
}

export default function AdminLoginPage() {
	const [state, formAction, pending] = useActionState(login, {});
	const [next, setNext] = useState("/admin");
	const [token, setToken] = useState("");

	const boxRef = useRef<HTMLDivElement>(null);
	const widgetId = useRef<string | null>(null);

	useEffect(() => {
		const n = new URLSearchParams(window.location.search).get("next");
		if (n && n.startsWith("/admin") && !n.startsWith("//")) setNext(n);
	}, []);

	// Explicitly render Turnstile once the API is ready (robust across
	// redirects/client navigation where implicit auto-render races the DOM).
	useEffect(() => {
		if (!SITE_KEY) return;
		let cancelled = false;
		let timer: ReturnType<typeof setInterval> | undefined;

		const render = () => {
			if (cancelled || !boxRef.current || !window.turnstile) return;
			if (widgetId.current) return;
			widgetId.current = window.turnstile.render(boxRef.current, {
				sitekey: SITE_KEY,
				theme: "dark",
				callback: (t: string) => setToken(t),
				"error-callback": () => setToken(""),
				"expired-callback": () => setToken(""),
				"response-field": false,
			});
		};

		if (window.turnstile) {
			render();
		} else {
			timer = setInterval(() => {
				if (window.turnstile) {
					clearInterval(timer);
					render();
				}
			}, 150);
		}

		return () => {
			cancelled = true;
			if (timer) clearInterval(timer);
			if (widgetId.current && window.turnstile) {
				try {
					window.turnstile.remove(widgetId.current);
				} catch {}
				widgetId.current = null;
			}
		};
	}, []);

	// After a failed submit the token is spent — reset for a fresh challenge.
	useEffect(() => {
		if (state.error && widgetId.current && window.turnstile) {
			try {
				window.turnstile.reset(widgetId.current);
			} catch {}
			setToken("");
		}
	}, [state]);

	const inputCls =
		"w-full border-b border-cream/20 bg-transparent py-3 text-cream text-xl outline-none transition-colors placeholder:text-cream/25 focus:border-gold";

	return (
		<div className="flex min-h-dvh items-center justify-center px-6">
			<AuthOverlay show={pending} label="Signing you in" />
			{SITE_KEY && (
				<Script
					src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
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
					{SITE_KEY && (
						<input type="hidden" name="cf-turnstile-response" value={token} />
					)}
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

					{SITE_KEY && <div ref={boxRef} className="min-h-[65px]" />}

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
