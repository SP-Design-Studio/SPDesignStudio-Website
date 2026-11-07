import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { getPageDraft, type PageKey } from "@/lib/cms/pages";

export async function DraftStatus({
	page,
	keys,
}: {
	page: PageKey;
	keys?: string[];
}) {
	const [draft, profile] = await Promise.all([getPageDraft(page), getProfile()]);
	const canPublish = profile?.role === "founder" || profile?.role === "admin";

	const changes = keys
		? draft.changes.filter((c) => keys.includes(c.path.split("·")[0]!.trim()))
		: draft.changes;
	const count = changes.length;
	const pending = draft.status === "unpublished" || count > 0;

	const label =
		draft.status === "unpublished"
			? "Not published"
			: count > 0
				? `${count} unpublished`
				: "Live";

	return (
		<span className="flex items-center gap-4 font-sans font-light uppercase tracking-[0.2em] text-tiny">
			<span
				className={`inline-flex items-center gap-2 ${pending ? "text-warn" : "text-cream/70"}`}>
				<span
					className={`h-1.5 w-1.5 rounded-full ${
						pending
							? "bg-warn [animation:admin-pulse_1.6s_ease-in-out_infinite]"
							: "bg-ok"
					}`}
				/>
				{label}
			</span>
			{pending &&
				(canPublish ? (
					<Link
						href={`/admin/publish?page=${page}`}
						className="text-ok transition-colors hover:brightness-110">
						Review →
					</Link>
				) : (
					<span className="text-cream/60 normal-case tracking-normal">
						Awaiting an admin
					</span>
				))}
			{pending && (
				<a
					href={`/preview/${page}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-cream/70 transition-colors hover:text-gold">
					Preview ↗
				</a>
			)}
		</span>
	);
}
