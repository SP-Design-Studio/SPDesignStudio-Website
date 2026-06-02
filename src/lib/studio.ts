export const STUDIO = {
	founded: "2022",
	name: "SP Design Studio",
	founder: "Spandana Puppala",
	location: "Hyderabad, India",
	email: "hello@spandanapuppala.com",
	phone: "+91 9100111450",
	address: "Banjara Hills, Hyderabad",
	socials: {
		instagram: "https://www.instagram.com/spdesigns_official/",
		linkedin: "https://www.linkedin.com/company/spandana-puppala-designs/",
		whatsapp: "https://wa.me/9100111450",
	},
};

export const STATS = [
	{ value: "300+", label: "Projects Delivered" },
	{ value: "450k+", label: "Sq Ft Designed" },
	{ value: "3+", label: "Years of Excellence" },
	{ value: "100%", label: "Turnkey Capability" },
];

export const DISCIPLINES = [
	{
		id: 1,
		topLabel: "I. RESIDENTIAL",
		img: "/images/grid-top-left.jpg",
		bigStat: "120",
		desc: "Warm, expressive interiors designed to feel like home — every detail curated for your lifestyle.",
		variant: "image" as const,
		span: "wide" as const,
	},
	{
		id: 2,
		topLabel: "II. SCALE",
		img: null,
		bigStat: "450k",
		desc: "SQ. FT. TRANSFORMED",
		variant: "centered" as const,
		span: "normal" as const,
	},
	{
		id: 3,
		topLabel: "III. COMMERCIAL",
		img: "/images/grid-top-right.jpg",
		bigStat: "20,000+",
		desc: "COMMERCIAL SFT",
		variant: "image" as const,
		span: "normal" as const,
	},
	{
		id: 5,
		topLabel: "V. EXECUTION",
		img: "/images/grid-bottom-left.jpg",
		bigStat: "30",
		desc: "Turnkey Solutions",
		variant: "image" as const,
		span: "tall" as const,
	},
	{
		id: 6,
		topLabel: "VI. STRATEGY",
		img: "/images/grid-bottom-right.jpg",
		bigStat: "75+",
		desc: "Design Consultation",
		variant: "image" as const,
		span: "tall" as const,
	},
	{
		id: 4,
		topLabel: "IV. INTERIOR",
		img: null,
		bigStat: "Styling",
		desc: "CURATED SPACES",
		variant: "italic" as const,
		span: "normal" as const,
	},
];

// Single source of truth for all section copy — no inline duplication in components.
export const SECTIONS = {
	hero: {
		label: "SP Design Studio",
		line1: "Your Space,",
		line2: "Designed!",
		quote:
			"We don't just decorate rooms \n we craft the spaces where life unfolds.",
		pillars: ["Authenticity", "Purpose", "Elegance"],
		ctaText: "Explore the Portfolio",
		ctaHref: "#work",
	},
	philosophy: {
		eyebrow: "The Philosophy",
		words: [
			"Design",
			"is",
			"the",
			"silent",
			"language",
			"of",
			"intentional",
			"living.",
		] as const,
		italicFromIndex: 6,
		body: "At SP Design Studio, we look beyond the surface, crafting environments that merge technical rigor with an intuitive understanding of how space influences the soul.",
	},
	disciplines: {
		eyebrow: "Our Disciplines",
		title: "Tailored Design",
	},
	numbers: {
		title: "By the Numbers",
	},
	partners: {
		eyebrow: "Our Partners",
		title: "Partnered Brands that bring our Design alive",
		tagline: "Material houses and craft studios — chosen, refined, trusted.",
	},
	voices: {
		title: "In Their Words",
		quotes: [
			{
				quote:
					"They didn't design a house — they listened to how we live, then gave it form. Every room feels inevitable.",
				name: "Aarav & Meera Reddy",
				detail: "Private Villa · Jubilee Hills",
				img: "/images/grid-top-left.jpg",
			},
			{
				quote:
					"Restraint, warmth, precision. SP turned a difficult brief into a space we never want to leave.",
				name: "Kavya Nair",
				detail: "Penthouse · Banjara Hills",
				img: "/images/grid-top-right.jpg",
			},
			{
				quote:
					"The detail is obsessive in the best way — light, texture, proportion. Nothing is accidental.",
				name: "Rohan Iyer",
				detail: "Studio Office · Gachibowli",
				img: "/images/grid-bottom-left.jpg",
			},
			{
				quote:
					"They made our home feel like a quiet exhale at the end of every day. Exactly what we asked for.",
				name: "Sneha Varma",
				detail: "Apartment · Kondapur",
				img: "/images/grid-bottom-right.jpg",
			},
			{
				quote:
					"Timeless, not trendy. Two years on, it still feels like the smartest decision we made.",
				name: "Vikram Desai",
				detail: "Farmhouse · Shamirpet",
				img: "/images/about-hero.jpg",
			},
		],
	},
	invitation: {
		line1: "Let's Build",
		line2: "Your Design.",
		line2GoldFromIndex: 5, // "Your " (5 chars) cream, rest gold
		ctaText: "Begin Your Project",
	},
} as const;

export const ABOUT = {
	hero: {
		eyebrow: "About the Studio",
		line1: "Crafting Spaces",
		line2: "with Soul.",
		line2GoldFromIndex: 5,
		quote:
			"Exceptional interiors emerge from thoughtful dialogue \nfunctionality before trend, soul before surface.",
	},
	mission: {
		eyebrow: "Our Mission",
		title: "Design that listens before it speaks.",
		body: "At SP Design Studio, we believe spaces should reflect the lives lived within them. Our work begins with conversation, evolves through craft, and lives on through everyday rituals.",
	},
	visionary: {
		eyebrow: "Meet the Visionary",
		title: "Led by Spandana Puppala",
		subtitle: "A Foundation of Passion",
		body1:
			"SP Design Studio represents the intersection of intentional architecture and the quiet art of well-being. Guided by Spandana Puppala's belief that our surroundings profoundly shape our internal state, the studio was born to bridge the gap between artistic soul and technical rigor.",
		body2:
			"Each project is treated as a unique, personal narrative, meticulously crafted to ensure that beauty never exists at the expense of function.",
		quoteBefore: "I design for how people ",
		quoteEmphasis: "feel",
		quoteAfter: " in a space, not just how it looks.",
		attribution: "Spandana Puppala",
		image: "/images/team/spandana.jpg",
	},
	team: {
		eyebrow: "The Collection",
		title: "Hands Behind the Craft",
		body: "A close studio of architects, designers, and craftspeople. Each project carries the imprint of every hand on it — from drawing board to final styling.",
		members: [
			{
				name: "Senior Designer",
				role: "Interior Architect",
				note: "Lead Concept & Detailing",
				img: null,
			},
			{
				name: "Junior Designer",
				role: "Interior Designer",
				note: "Drawings & Material",
				img: null,
			},
			{
				name: "Site Supervisor",
				role: "On-Site Lead",
				note: "Execution & Quality",
				img: null,
			},
			{
				name: "Marketing Manager",
				role: "Brand & Studio",
				note: "Communication & Reach",
				img: null,
			},
			{
				name: "Technical Head",
				role: "Engineering Lead",
				note: "Drawings & Compliance",
				img: null,
			},
			{
				name: "Project Coordinator",
				role: "Studio Operations",
				note: "Schedule & Procurement",
				img: null,
			},
		],
	},
	timeline: {
		eyebrow: "Studio Evolution",
		title: "A Decade in the Making",
		entries: [
			{
				year: "2012",
				label: "The Beginning",
				desc: "First commission. A foundation laid in residential interiors.",
				img: "/images/grid-top-left.jpg",
			},
			{
				year: "2016",
				label: "Studio Founded",
				desc: "SP Design Studio officially opens in Hyderabad.",
				img: "/images/grid-top-right.jpg",
			},
			{
				year: "2019",
				label: "Hospitality Expansion",
				desc: "Practice broadens into boutique hospitality and commercial.",
				img: "/images/grid-bottom-left.jpg",
			},
			{
				year: "2022",
				label: "Sustainable Design Award",
				desc: "Recognised for material-conscious residential work.",
				img: "/images/grid-bottom-right.jpg",
			},
			{
				year: "Today",
				label: "Onward",
				desc: "300+ projects delivered across India and beyond.",
				img: "/images/about-hero.jpg",
			},
		],
	},
	connect: {
		line1: "Let's",
		line2: "Connect.",
		line2GoldFromIndex: 0,
		body: "Tell us about your space. We'll do the listening.",
		ctaText: "Begin a Conversation",
	},
} as const;

export const PROCESS = {
	eyebrow: "The Studio's Workflow",
	title: "Our Approach",
	subtitle: "From Vision to Reality",
	intro:
		"Every project moves through six considered stages, from the first conversation to the day you step inside.",
	steps: [
		{
			no: "01",
			title: "Discovery & Consultation",
			desc: "We begin with deep listening: understanding your rhythm, habits, and lifestyle to establish a foundation for a space that is uniquely yours.",
			img: "/images/grid-top-left.jpg",
		},
		{
			no: "02",
			title: "Concept & Moodboarding",
			desc: "Translating insights into a curated palette of textures, shapes, and tones that define the atmospheric direction of the project.",
			img: "/images/grid-top-right.jpg",
		},
		{
			no: "03",
			title: "Design & Refinement",
			desc: "Our studio blends aesthetic clarity with functional layouts, ensuring your space feels as effortless as it looks.",
			img: "/images/grid-bottom-left.jpg",
		},
		{
			no: "04",
			title: "Material Selections",
			desc: "We carefully source honest materials and custom finishes to create cohesive, tactile, and enduring living experiences.",
			img: "/images/grid-bottom-right.jpg",
		},
		{
			no: "05",
			title: "Execution & Styling",
			desc: "We oversee the final realization, from technical implementation to the styling touches that breathe life into the room.",
			img: "/images/about-hero.jpg",
		},
		{
			no: "06",
			title: "Project Handover",
			desc: "The final reveal: a space designed with soul, story, and intention, ready for you to inhabit and make your own.",
			img: "/images/grid-top-right.jpg",
		},
	],
	ctaText: "Begin Your Project",
} as const;

export const PARTNER_DIRECTORY = [
	{ category: "Hardware", brands: ["Hettich", "Blum", "Häfele", "Ebco"] },
	{ category: "Paints", brands: ["Asian Paints", "Berger", "Dulux", "Jotun"] },
	{ category: "Lighting", brands: ["Philips", "Wipro", "Gold Medal", "Jaquar"] },
	{ category: "Plywood", brands: ["Greenply", "Century", "Mikasa", "Austin"] },
	{
		category: "Wallpapers",
		brands: ["Nilaya", "Marshalls", "Excel", "Elementto"],
	},
	{
		category: "Flooring",
		brands: ["Pergo", "Greenlam", "Square Foot", "Welspun"],
	},
	{
		category: "Automation",
		brands: ["Lutron", "Schneider", "Legrand", "Norisys"],
	},
	{ category: "Modular", brands: ["Sleek", "Häcker", "Veneta", "Nobilia"] },
] as const;
