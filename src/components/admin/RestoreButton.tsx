"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSaving } from "@/lib/admin/saving";
import { restoreDeleted } from "@/app/admin/restore-actions";

export function RestoreButton({ table, id }: { table: string; id: string }) {
	const router = useRouter();
	const [pending, start] = useSaving("Restoring");
	const [error, setError] = useState("");

	return (
		<span className="flex items-center gap-3">
			{error && (
				<span role="alert" className="font-sans font-light text-bad text-tiny">
					{error}
				</span>
			)}
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						setError("");
						const res = await restoreDeleted(table, id);
						if (res.error) setError(res.error);
						else router.refresh();
					})
				}
				className="cursor-pointer rounded-sm border border-warn/50 px-4 py-1.5 font-sans font-light uppercase tracking-[0.2em] text-warn text-tiny transition-colors hover:bg-warn/10 disabled:opacity-60 pointer-coarse:min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn">
				{pending ? "Restoring…" : "Restore"}
			</button>
		</span>
	);
}
