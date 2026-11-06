"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	startMfaSetup,
	confirmMfaSetup,
	removeMfa,
	type MfaSetup,
} from "./mfa-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ui } from "@/lib/admin/ui";

export function MfaSetupFlow() {
	const router = useRouter();
	const [setup, setSetup] = useState<MfaSetup | null>(null);
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, start] = useTransition();

	const begin = () =>
		start(async () => {
			setError(null);
			const res = await startMfaSetup();
			if (res.error) setError(res.error);
			else setSetup(res);
		});

	const confirm = (value: string) =>
		start(async () => {
			setError(null);
			const res = await confirmMfaSetup(setup!.factorId!, value);
			if (res.error) setError(res.error);
			else router.refresh();
		});

	const digits = code.replace(/\D/g, "");

	const onCodeChange = (value: string) => {
		setCode(value);
		if (!pending && value.replace(/\D/g, "").length === 6) confirm(value);
	};

	if (!setup) {
		return (
			<div className="flex flex-col gap-4">
				<button
					type="button"
					onClick={begin}
					disabled={pending}
					className={`${ui.btnPrimary} w-fit`}>
					{pending ? "Starting…" : "Set up authenticator app"}
				</button>
				{error && (
					<p role="alert" className="font-sans text-base text-gold">
						{error}
					</p>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-7">
			<ol className="flex flex-col gap-7 font-sans font-light text-cream/90 text-base leading-relaxed">
				<li className="flex flex-col gap-3">
					<span className="text-cream">
						1. Scan this with an authenticator app such as Google
						Authenticator, Microsoft Authenticator, 1Password or Authy.
					</span>
					<Image
						src={setup.qr!}
						alt="QR code to add SP Design Studio to your authenticator app"
						width={200}
						height={200}
						unoptimized
						className="h-[200px] w-[200px] rounded-sm bg-white p-2"
					/>
					<span className="font-sans font-light text-cream/80 text-tiny">
						Can&rsquo;t scan it? Enter this key instead:{" "}
						<code className="select-all break-all rounded-sm bg-plum px-1.5 py-0.5 text-cream">
							{setup.secret}
						</code>
					</span>
				</li>
				<li className="flex flex-col gap-3">
					<span className="text-cream">2. Enter the 6 digits it shows.</span>
					<input
						value={code}
						onChange={(e) => onCodeChange(e.target.value)}
						inputMode="numeric"
						autoComplete="one-time-code"
						maxLength={7}
						placeholder="123 456"
						aria-label="6-digit code"
						className={`${ui.input} max-w-xs text-xl tracking-[0.3em] tabular-nums`}
					/>
				</li>
			</ol>
			<div className="flex flex-wrap items-center gap-4">
				<button
					type="button"
					onClick={() => confirm(code)}
					disabled={pending || digits.length !== 6}
					className={ui.btnPrimary}>
					{pending ? "Checking…" : "Turn on two-step sign-in"}
				</button>
				<button
					type="button"
					onClick={() => {
						setSetup(null);
						setCode("");
						setError(null);
					}}
					className={ui.btnQuiet}>
					Start again
				</button>
			</div>
			{error && (
				<p role="alert" className="font-sans text-base text-gold">
					{error}
				</p>
			)}
		</div>
	);
}

export function MfaPanel({
	factorId,
	required,
}: {
	factorId: string | null;
	required: boolean;
}) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [pending, start] = useTransition();

	return (
		<section className="border-t border-cream/10 pt-10">
			<div className="mb-2 font-sans font-light uppercase tracking-[0.32em] text-gold text-tiny">
				Two-step sign-in
			</div>
			{factorId ? (
				<div className="flex flex-col gap-5">
					<div className="flex flex-wrap items-center gap-3">
						<span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-sans font-light uppercase tracking-[0.18em] text-gold text-micro">
							On
						</span>
						<span className="font-sans font-light text-cream/80 text-base">
							Each sign-in also asks for a code from your authenticator app.
						</span>
					</div>
					{required && (
						<p className="max-w-xl font-sans font-light text-cream/80 text-tiny">
							Your role requires it, so turning it off will ask you to set it up
							again straight away.
						</p>
					)}
					<div>
						<ConfirmButton
							label="Turn off"
							confirmLabel="Yes, turn it off"
							disabled={pending}
							onConfirm={() =>
								start(async () => {
									setError(null);
									const res = await removeMfa(factorId);
									if (res.error) setError(res.error);
									else router.refresh();
								})
							}
						/>
					</div>
					{error && (
						<p role="alert" className="font-sans text-base text-gold">
							{error}
						</p>
					)}
				</div>
			) : (
				<div className="flex flex-col gap-5">
					<p className="max-w-xl font-sans font-light text-cream/80 text-base">
						Protect this account with a code from an authenticator app, as well
						as your password.
						{required ? " Your role requires it." : ""}
					</p>
					<MfaSetupFlow />
				</div>
			)}
		</section>
	);
}
