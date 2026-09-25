export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/avif",
];

export const ACCEPTED_IMAGE_ATTR = ACCEPTED_IMAGE_TYPES.join(",");

export interface UploadProblem {
	message: string;
	detail?: string;
}

export function formatBytes(bytes: number): string {
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
	return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

const HEIC = /\.(heic|heif)$/i;

export function validateImageFile(file: {
	name: string;
	type: string;
	size: number;
}): string | null {
	if (!file.size) return "That file is empty — choose another image.";

	if (
		HEIC.test(file.name) ||
		file.type === "image/heic" ||
		file.type === "image/heif"
	)
		return "HEIC/HEIF photos aren't supported. Open the photo and export it as JPEG, then upload that.";

	if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
		const ext = file.name.split(".").pop()?.toUpperCase();
		return ext && ext.length <= 5 && ext !== file.name.toUpperCase()
			? `${ext} files aren't supported. Use JPG, PNG, WebP, or AVIF.`
			: "That file type isn't supported. Use JPG, PNG, WebP, or AVIF.";
	}

	if (file.size > MAX_IMAGE_BYTES)
		return `This image is ${formatBytes(file.size)} — the limit is ${formatBytes(
			MAX_IMAGE_BYTES,
		)}. Export it at a smaller size and try again.`;

	return null;
}

export function storageErrorMessage(raw: string): UploadProblem {
	const m = raw.toLowerCase();

	if (
		m.includes("row-level security") ||
		m.includes("unauthorized") ||
		m.includes("permission")
	)
		return {
			message:
				"You don't have permission to upload images. Sign out, sign back in, and try again.",
		};

	if (m.includes("jwt") || m.includes("expired") || m.includes("invalid token"))
		return {
			message:
				"Your sign-in expired. Refresh the page, sign in again, then retry the upload.",
		};

	if (
		m.includes("maximum allowed size") ||
		m.includes("payload too large") ||
		m.includes("entity too large")
	)
		return {
			message:
				"Storage rejected this image for being too large. Export it at a smaller size and try again.",
		};

	if (m.includes("bucket not found"))
		return {
			message:
				"The media storage bucket is missing, so uploads can't be saved. This one needs a developer.",
		};

	if (m.includes("already exists"))
		return {
			message: "A file with that name already exists. Try the upload again.",
		};

	if (
		m.includes("fetch failed") ||
		m.includes("network") ||
		m.includes("timeout") ||
		m.includes("econn")
	)
		return {
			message:
				"Couldn't reach the image server. Check your connection and try again.",
		};

	if (m.includes("mime") || m.includes("content type"))
		return {
			message:
				"Storage rejected this image format. Use JPG, PNG, WebP, or AVIF.",
		};

	return {
		message: "The upload failed. Please try again.",
		detail: raw,
	};
}
