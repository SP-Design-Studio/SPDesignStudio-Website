import { STUDIO } from "./studio";

export const CAREERS = {
	eyebrow: "Careers",
	line1: "Join the",
	line2: "Studio.",
	subtitle:
		"We are a small collective of designers, architects, and makers. When the right talent appears, we make room.",
	openingsTitle: "Open Roles",
	openings: [
		{
			role: "Interior Designer",
			type: "Full-time",
			location: "Hyderabad",
			desc: "Concept development, detailing, and material curation across residential and commercial projects.",
		},
		{
			role: "Site Supervisor",
			type: "Full-time",
			location: "Hyderabad",
			desc: "On-site execution lead ensuring craft, quality, and timelines from drawing to handover.",
		},
		{
			role: "Design Intern",
			type: "Internship",
			location: "Hyderabad",
			desc: "Support the studio across drawings, moodboards, and material research. Six-month programme.",
		},
	],
	emptyNote:
		"No open roles right now, but we are always glad to meet kindred talent.",
	invite: {
		eyebrow: "Open Application",
		headline: "Introduce Yourself.",
		body: "Send your portfolio and a note about the work you want to make. When the right role opens, we will already know you.",
	},
	apply: {
		eyebrow: "Apply to the Studio",
		headline: "Tell Us About You",
		intro:
			"Share your work and a few words on the kind of spaces you want to make. We read every application.",
		successTitle: "Application received.",
		successBody:
			"Thank you for reaching out. We review every application and will be in touch if there is a fit.",
		fields: [
			{
				name: "name",
				label: "Full Name",
				placeholder: "Your name",
				type: "text",
				required: true,
			},
			{
				name: "email",
				label: "Email Address",
				placeholder: "email@address.com",
				type: "email",
				required: true,
			},
			{
				name: "role",
				label: "Role of Interest",
				placeholder: "Which role / open application",
				type: "text",
				required: false,
			},
			{
				name: "portfolio",
				label: "Portfolio / Link",
				placeholder: "https:// …",
				type: "url",
				required: false,
			},
			{
				name: "phone",
				label: "Phone Number",
				placeholder: "+91 …",
				type: "tel",
				required: false,
			},
			{
				name: "message",
				label: "Message",
				placeholder: "Tell us about yourself and your work…",
				type: "textarea",
				required: true,
			},
		],
	},
	ctaText: "Send Your Portfolio",
	applyEmail: STUDIO.email,
} as const;
