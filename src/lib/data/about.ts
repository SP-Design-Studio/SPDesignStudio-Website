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
	achievements: {
		eyebrow: "Recognition",
		title: "Honours & Milestones",
		items: [
			{
				img: "/images/grid-top-left.jpg",
				year: "2024",
				by: "The Studio",
				title: "300+ Projects Delivered",
				desc: "A body of residential and commercial work realised across India and beyond.",
			},
			{
				img: "/images/grid-bottom-right.jpg",
				year: "2022",
				by: "The Studio",
				title: "Sustainable Design Award",
				desc: "Recognised for material-conscious, low-impact residential interiors.",
			},
			{
				img: "/images/team/spandana.jpg",
				year: "2023",
				by: "The Founder",
				title: "Designer of the Year",
				desc: "Spandana Puppala, honoured for a decade of intentional design.",
			},
			{
				img: "/images/grid-top-right.jpg",
				year: "2021",
				by: "The Studio",
				title: "Featured — Interior Editorial",
				desc: "Published for considered detailing and a restrained material palette.",
			},
			{
				img: "/images/about-hero.jpg",
				year: "2021",
				by: "The Founder",
				title: "Speaker — Design Forum",
				desc: "On the quiet relationship between well-being and the spaces we inhabit.",
			},
			{
				img: "/images/grid-bottom-left.jpg",
				year: "2019",
				by: "The Studio",
				title: "Hospitality Portfolio",
				desc: "The practice broadened into boutique hospitality and commercial design.",
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
