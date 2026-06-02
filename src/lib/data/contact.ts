import { STUDIO } from "./studio";

export const CONTACT = {
	hero: {
		eyebrow: "Get in Touch",
		line1: "Let's Create",
		line2: "Something Timeless.",
		subtitle:
			"Every considered space begins with a conversation. Tell us about yours, and we will take it from there.",
	},
	inquiries: {
		eyebrow: "Inquiry Channels",
		title: "How Can We Help?",
		items: [
			{
				kind: "project" as const,
				title: "New Projects",
				who: "Clients",
				desc: "Whether you are looking to transform a residence or a commercial space, we are ready to bring your vision to life.",
				cta: "Start a Project",
			},
			{
				kind: "partnership" as const,
				title: "Partnerships",
				who: "Vendors",
				desc: "We are always looking to expand our network of high-end artisans, suppliers, and skilled contractors.",
				cta: "Join Network",
			},
			{
				kind: "career" as const,
				title: "Careers",
				who: "Applicants",
				desc: "Join our collective of designers and architects. We are always seeking passionate talent to join our studio.",
				cta: "View Openings",
				href: "/careers",
			},
		],
	},
	forms: {
		project: {
			eyebrow: "New Projects",
			title: "Clients",
			headline: "Start a Project",
			intro:
				"Share your space, your timeline, and the life you want it to hold. We will take it from there.",
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
					name: "location",
					label: "Project Location",
					placeholder: "City / Area",
					type: "text",
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
					placeholder: "Tell us about your inquiry…",
					type: "textarea",
					required: true,
				},
			],
		},
		partnership: {
			eyebrow: "Partnerships",
			title: "Vendors",
			headline: "Join the Network",
			intro:
				"Tell us about your craft, your materials, and what you bring to the table. We love meeting makers.",
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
					name: "company",
					label: "Company Name",
					placeholder: "Business Name",
					type: "text",
					required: false,
				},
				{
					name: "category",
					label: "Service Category",
					placeholder: "Furniture, Lighting, etc.",
					type: "text",
					required: false,
				},
				{
					name: "message",
					label: "Message",
					placeholder: "Tell us about your inquiry…",
					type: "textarea",
					required: true,
				},
			],
		},
	},
	success: {
		title: "Inquiry received.",
		body: "Thank you for reaching out. We respond within two working days.",
	},
	channels: {
		eyebrow: "Reach the Studio",
		title: "Other Ways to Connect",
		items: [
			{
				label: "Email",
				value: STUDIO.email,
				href: `mailto:${STUDIO.email}`,
				icon: "mail" as const,
			},
			{
				label: "Phone",
				value: STUDIO.phone,
				href: `tel:${STUDIO.phone.replace(/\s/g, "")}`,
				icon: "phone" as const,
			},
			{
				label: "WhatsApp",
				value: "Start a chat",
				href: STUDIO.socials.whatsapp,
				icon: "whatsapp" as const,
			},
		],
	},
	visit: {
		eyebrow: "Visit & Hours",
		address: STUDIO.address,
		city: STUDIO.location,
		mapsUrl: STUDIO.mapsUrl,
		hours: [
			{ days: "Monday — Friday", time: "10:00 AM — 06:00 PM" },
			{ days: "Saturday", time: "By Appointment" },
			{ days: "Sunday", time: "Closed" },
		],
	},
} as const;
