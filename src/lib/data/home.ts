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
		title: "Client Reflections",
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
		line2GoldFromIndex: 5,
		ctaText: "Begin Your Project",
	},
} as const;
