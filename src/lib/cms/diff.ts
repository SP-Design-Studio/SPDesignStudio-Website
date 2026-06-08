type J = unknown;

const IGNORE_KEYS = new Set(["created_at", "updated_at"]);
const LABEL_KEYS = ["title", "name", "label", "role", "author", "quote", "id"];

const isObj = (v: J): v is Record<string, J> =>
	typeof v === "object" && v !== null && !Array.isArray(v);

function labelOf(o: Record<string, J>): string {
	for (const k of LABEL_KEYS) {
		const v = o[k];
		if (typeof v === "string" && v.trim())
			return v.length > 40 ? `${v.slice(0, 37)}…` : v;
	}
	return "item";
}

function shortVal(v: J): string {
	if (v === null || v === undefined) return "—";
	if (typeof v === "string")
		return v.length > 60 ? `“${v.slice(0, 57)}…”` : `“${v}”`;
	if (Array.isArray(v)) return `${v.length} item${v.length === 1 ? "" : "s"}`;
	if (typeof v === "object") return "{…}";
	return String(v);
}

const isImageField = (path: string): boolean => {
	const key = (path.split("·").pop() ?? "").trim().toLowerCase();
	return /(img|image|url|photo|logo|avatar|cover)$/.test(key);
};

function fileName(v: J): string {
	if (typeof v !== "string" || !v) return shortVal(v);
	const clean = v.split("?")[0];
	const name = clean.slice(clean.lastIndexOf("/") + 1);
	return name || v;
}

export function deepEqual(a: J, b: J): boolean {
	if (a === b) return true;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((x, i) => deepEqual(x, b[i]));
	}
	if (isObj(a) && isObj(b)) {
		const ak = Object.keys(a);
		const bk = Object.keys(b);
		if (ak.length !== bk.length) return false;
		return ak.every((k) => k in b && deepEqual(a[k], b[k]));
	}
	return false;
}

const field = (path: string, key: string): string =>
	path ? `${path} · ${key}` : key;

function keyed(arr: J[]): arr is Record<string, J>[] {
	return arr.length > 0 && arr.every((x) => isObj(x) && "id" in x);
}

function diffArray(a: J[], b: J[], path: string, out: string[]): void {
	if (keyed(a) && keyed(b)) {
		const idOf = (x: Record<string, J>) => String(x.id);
		const am = new Map(a.map((x) => [idOf(x), x]));
		const bm = new Map(b.map((x) => [idOf(x), x]));
		for (const x of a)
			if (!bm.has(idOf(x))) out.push(`${path}: removed “${labelOf(x)}”`);
		for (const x of b)
			if (!am.has(idOf(x))) out.push(`${path}: added “${labelOf(x)}”`);
		for (const x of b) {
			const before = am.get(idOf(x));
			if (before && !deepEqual(before, x))
				walk(before, x, `${path} · ${labelOf(x)}`, out);
		}
		const order = (arr: Record<string, J>[], other: Map<string, J>) =>
			arr
				.filter((x) => other.has(idOf(x)))
				.map(idOf)
				.join(",");
		if (order(a, bm) !== order(b, am)) out.push(`${path}: reordered`);
		return;
	}
	const img = isImageField(path) || /gallery$/.test(path.toLowerCase());
	const show = (v: J) => (img ? fileName(v) : shortVal(v));
	const enc = (v: J) => JSON.stringify(v);
	const as = new Set(a.map(enc));
	const bs = new Set(b.map(enc));
	for (const v of a)
		if (!bs.has(enc(v))) out.push(`${path}: removed ${show(v)}`);
	for (const v of b)
		if (!as.has(enc(v))) out.push(`${path}: added ${show(v)}`);
}

function walk(a: J, b: J, path: string, out: string[]): void {
	if (deepEqual(a, b)) return;
	if (Array.isArray(a) && Array.isArray(b)) {
		diffArray(a, b, path, out);
		return;
	}
	if (isObj(a) && isObj(b)) {
		const keys = new Set(
			[...Object.keys(a), ...Object.keys(b)].filter(
				(k) => !IGNORE_KEYS.has(k),
			),
		);
		for (const k of keys) walk(a[k], b[k], field(path, k), out);
		return;
	}
	if (isImageField(path) && (typeof a === "string" || typeof b === "string")) {
		out.push(`${path}: image ${fileName(a)} → ${fileName(b)}`);
		return;
	}
	out.push(`${path || "value"}: ${shortVal(a)} → ${shortVal(b)}`);
}

export function diffData(published: J, draft: J): string[] {
	const out: string[] = [];
	walk(published, draft, "", out);
	return out;
}
