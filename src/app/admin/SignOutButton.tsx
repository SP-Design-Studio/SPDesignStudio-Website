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
				className="cursor-pointer font-sans font-light uppercase tracking-[0.24em] text-cream/82 text-[0.708rem] transition-colors hover:text-gold disabled:opacity-60">
				Sign out
			</button>
			<AuthOverlay show={pending} label="Signing out" />
		</>
	);
}
