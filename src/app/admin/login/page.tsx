"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { login } from "./actions";
import AuthOverlay from "@/components/admin/AuthOverlay";
import {
	AuthScreen,
	AUTH_BTN,
	AUTH_FIELD,
	AUTH_LABEL,
} from "@/components/admin/AuthScreen";

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

	return (
		<AuthScreen title="Sign in">
			<AuthOverlay show={pending} label="Signing you in" />
			{SITE_KEY && (
				<Script
					src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
					strategy="afterInteractive"
				/>
			)}
			<form action={formAction} className="flex flex-col gap-6">
				<input type="hidden" name="next" value={next} />
				{SITE_KEY && (
					<input type="hidden" name="cf-turnstile-response" value={token} />
				)}
				<div className="auth-stagger flex flex-col gap-7">
					<label className="flex flex-col gap-2">
						<span className={AUTH_LABEL}>Email</span>
						<input
							type="email"
							name="email"
							required
							autoFocus
							autoComplete="username"
							placeholder="you@example.com"
							className={AUTH_FIELD}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className={AUTH_LABEL}>Password</span>
						<input
							type="password"
							name="password"
							required
							autoComplete="current-password"
							placeholder="••••••••"
							className={AUTH_FIELD}
						/>
					</label>
					{SITE_KEY && <div ref={boxRef} className="min-h-[65px]" />}
					<button type="submit" disabled={pending} className={AUTH_BTN}>
						{pending ? "Signing in…" : "Sign in"}
						<span className="transition-transform duration-500 group-hover:translate-x-1">
							&rarr;
						</span>
					</button>
				</div>
				{state.error && (
					<p role="alert" className="font-sans text-base text-bad">
						{state.error}
					</p>
				)}
			</form>
		</AuthScreen>
	);
}
