"use client";

import { useFormStatus } from "react-dom";
import AuthOverlay from "@/components/admin/AuthOverlay";

export default function SignOutButton() {
	const { pending } = useFormStatus();
	return (
		<>
			<button
				type="submit"
				disabled={pending}
				className="cursor-pointer font-sans font-light uppercase tracking-[0.24em] text-bad text-tiny transition-colors hover:brightness-110 disabled:opacity-60 pointer-coarse:min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bad">
				Sign out
			</button>
			<AuthOverlay show={pending} label="Signing out" />
		</>
	);
}
