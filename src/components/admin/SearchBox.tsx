"use client";

import { ui } from "@/lib/admin/ui";

export function SearchBox({
	value,
	onChange,
	shown,
	total,
	noun,
	placeholder = "Search…",
}: {
	value: string;
	onChange: (v: string) => void;
	shown: number;
	total: number;
	noun: string;
	placeholder?: string;
}) {
	const active = value.trim().length > 0;
	return (
		<div className="mb-4 flex flex-wrap items-center gap-3">
			<input
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				aria-label={`Search ${noun}`}
				className={`${ui.input} max-w-xs`}
			/>
			<span className="font-sans font-light text-cream/80 text-tiny">
				{active ? `${shown} of ${total}` : `${total} ${noun}`}
			</span>
			{active && (
				<button
					type="button"
					onClick={() => onChange("")}
					className={ui.btnQuiet}>
					Clear
				</button>
			)}
		</div>
	);
}
