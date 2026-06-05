let getAnchorsFn: (() => number[]) | null = null;

export function setSectionAnchors(fn: (() => number[]) | null) {
	getAnchorsFn = fn;
}

export function getSectionAnchors(): number[] {
	return getAnchorsFn ? getAnchorsFn() : [];
}
