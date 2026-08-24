export interface RatioOption {
	label: string;
	value: number;
}

export const ORIGINAL = 0;

export const DEFAULT_RATIO = 4 / 3;

export const RATIO_PRESETS: RatioOption[] = [
	{ label: "1:1", value: 1 },
	{ label: "4:3", value: 4 / 3 },
	{ label: "3:2", value: 3 / 2 },
	{ label: "16:9", value: 16 / 9 },
	{ label: "21:10", value: 21 / 10 },
	{ label: "4:5", value: 4 / 5 },
	{ label: "3:4", value: 3 / 4 },
	{ label: "9:16", value: 9 / 16 },
];

const near = (a: number, b: number) => Math.abs(a - b) < 0.02;

export function ratioLabel(aspect: number | null | undefined): string {
	if (typeof aspect !== "number" || !Number.isFinite(aspect) || aspect <= 0)
		return ratioLabel(DEFAULT_RATIO);
	const hit = RATIO_PRESETS.find((r) => near(r.value, aspect));
	return hit ? hit.label : `${aspect.toFixed(2)}:1`;
}

export function resolveAspect(aspect: string | number): RatioOption {
	if (typeof aspect === "number")
		return { label: ratioLabel(aspect), value: aspect };
	if (aspect.includes("square")) return { label: "1:1", value: 1 };
	if (aspect.includes("video")) return { label: "16:9", value: 16 / 9 };
	const m = aspect.match(/(\d+)\s*\/\s*(\d+)/);
	if (m)
		return { label: `${m[1]}:${m[2]}`, value: Number(m[1]) / Number(m[2]) };
	return { label: "4:3", value: DEFAULT_RATIO };
}
