export const PROJECTS_PAGE = {
	eyebrow: "Selected Work",
	title: ["Quiet, Considered", "Interiors Shaped", "By How You Live"],
};

export const PROJECT_CATEGORIES = [
	{ id: "residential", label: "Residential" },
	{ id: "commercial", label: "Commercial" },
	{ id: "hospitality", label: "Hospitality" },
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]["id"];

export interface ProjectFact {
	label: string;
	value: string;
}

export interface Project {
	id: string;
	title: string;
	location: string;
	type: string;
	category: ProjectCategory;
	img: string;
	year: string;
	blurb: string;
	facts: ProjectFact[];
	gallery: string[];
}

export const PROJECTS: Project[] = [
	{
		id: "vanilla-vista",
		title: "Vanilla Vista",
		location: "My Home Sayuk, Tellapur",
		type: "Residential",
		category: "residential",
		img: "/images/grid-top-left.jpg",
		year: "2024",
		blurb:
			"A warm, light-filled family home where soft plaster, oak, and brass settle into a calm daily rhythm. Every room is shaped around how the family actually lives — unhurried, tactile, and quietly luxurious.",
		facts: [
			{ label: "Area", value: "3,400 sq ft" },
			{ label: "Scope", value: "Full Interior" },
			{ label: "Year", value: "2024" },
			{ label: "Status", value: "Completed" },
		],
		gallery: [
			"/images/grid-top-left.jpg",
			"/images/grid-bottom-left.jpg",
			"/images/about-hero.jpg",
		],
	},
	{
		id: "infinite-retail-stores",
		title: "Infinite Retail Stores",
		location: "All Cities",
		type: "Retail & Commercial",
		category: "commercial",
		img: "/images/grid-top-right.jpg",
		year: "2023",
		blurb:
			"A roll-out retail identity built to scale across cities without losing its warmth. A flexible kit of materials, lighting, and fixtures keeps every store unmistakably the same brand, yet locally at home.",
		facts: [
			{ label: "Area", value: "1,200–2,000 sq ft" },
			{ label: "Scope", value: "Retail Rollout" },
			{ label: "Year", value: "2023" },
			{ label: "Status", value: "Ongoing" },
		],
		gallery: [
			"/images/grid-top-right.jpg",
			"/images/process/step-01.jpg",
			"/images/process/step-03.jpg",
		],
	},
	{
		id: "indis-viva-city",
		title: "Indis Viva City",
		location: "Kondapur, Hyderabad",
		type: "Residential",
		category: "residential",
		img: "/images/grid-bottom-left.jpg",
		year: "2024",
		blurb:
			"A high-rise apartment reworked for light and flow. Walls came down, sightlines opened up, and a restrained palette lets the city skyline become the room's true artwork.",
		facts: [
			{ label: "Area", value: "2,100 sq ft" },
			{ label: "Scope", value: "Renovation" },
			{ label: "Year", value: "2024" },
			{ label: "Status", value: "Completed" },
		],
		gallery: [
			"/images/grid-bottom-left.jpg",
			"/images/grid-top-right.jpg",
			"/images/process/step-05.jpg",
		],
	},
	{
		id: "skyway-9",
		title: "Skyway 9",
		location: "Gandipet, Hyderabad",
		type: "Residential",
		category: "residential",
		img: "/images/about-hero.jpg",
		year: "2022",
		blurb:
			"A sculptural villa where architecture and interior speak one language. Deep thresholds, layered shadow, and honest materials make light itself the central character of the home.",
		facts: [
			{ label: "Area", value: "6,800 sq ft" },
			{ label: "Scope", value: "Architecture + Interior" },
			{ label: "Year", value: "2022" },
			{ label: "Status", value: "Completed" },
		],
		gallery: [
			"/images/about-hero.jpg",
			"/images/grid-top-left.jpg",
			"/images/process/step-06.jpg",
		],
	},
	{
		id: "chalet-meadows",
		title: "Chalet Meadows",
		location: "RTC Crossroads, Hyderabad",
		type: "Residential",
		category: "residential",
		img: "/images/process/step-05.jpg",
		year: "2023",
		blurb:
			"A serene retreat that trades noise for nature. Earthy textures, soft seating, and generous greenery turn a city apartment into a slow, restorative escape.",
		facts: [
			{ label: "Area", value: "2,650 sq ft" },
			{ label: "Scope", value: "Full Interior" },
			{ label: "Year", value: "2023" },
			{ label: "Status", value: "Completed" },
		],
		gallery: [
			"/images/process/step-05.jpg",
			"/images/grid-bottom-right.jpg",
			"/images/about-hero.jpg",
		],
	},
	{
		id: "bahar-biryani-cafe",
		title: "Bahar Biryani Cafe",
		location: "Miyapur, Hyderabad",
		type: "Hospitality",
		category: "hospitality",
		img: "/images/process/step-02.jpg",
		year: "2024",
		blurb:
			"A modern cafe that plates heritage with restraint. Warm timber, low light, and intimate booths frame the food as the hero while keeping the room buzzing and welcoming.",
		facts: [
			{ label: "Area", value: "1,800 sq ft" },
			{ label: "Scope", value: "F&B Interior" },
			{ label: "Year", value: "2024" },
			{ label: "Status", value: "Completed" },
		],
		gallery: [
			"/images/process/step-02.jpg",
			"/images/process/step-04.jpg",
			"/images/grid-top-right.jpg",
		],
	},
	{
		id: "indu-fortune-fields",
		title: "Indu Fortune Fields",
		location: "Kukatpally, Hyderabad",
		type: "Residential",
		category: "residential",
		img: "/images/process/step-06.jpg",
		year: "2023",
		blurb:
			"A young family's first home, designed to grow with them. Smart storage, durable finishes, and a soft, cheerful palette keep everyday life easy and bright.",
		facts: [
			{ label: "Area", value: "1,650 sq ft" },
			{ label: "Scope", value: "Full Interior" },
			{ label: "Year", value: "2023" },
			{ label: "Status", value: "Completed" },
		],
		gallery: [
			"/images/process/step-06.jpg",
			"/images/grid-bottom-left.jpg",
			"/images/grid-top-left.jpg",
		],
	},
	{
		id: "pottery-studio",
		title: "Pottery Studio",
		location: "Filmnagar, Hyderabad",
		type: "Studio",
		category: "commercial",
		img: "/images/process/step-03.jpg",
		year: "2024",
		blurb:
			"A maker's studio built around hands and clay. Raw concrete, abundant daylight, and honest workbenches create a space that invites mess, focus, and craft in equal measure.",
		facts: [
			{ label: "Area", value: "950 sq ft" },
			{ label: "Scope", value: "Studio Fit-out" },
			{ label: "Year", value: "2024" },
			{ label: "Status", value: "Completed" },
		],
		gallery: [
			"/images/process/step-03.jpg",
			"/images/process/step-01.jpg",
			"/images/process/step-02.jpg",
		],
	},
	{
		id: "dsire-exhibitions",
		title: "Dsire Exhibitions",
		location: "Begumpet, Hyderabad",
		type: "Office Space",
		category: "commercial",
		img: "/images/process/step-01.jpg",
		year: "2023",
		blurb:
			"A workspace that doubles as a showroom. Modular zones, considered acoustics, and a confident material story let the team work, host, and present all under one roof.",
		facts: [
			{ label: "Area", value: "4,200 sq ft" },
			{ label: "Scope", value: "Workplace Design" },
			{ label: "Year", value: "2023" },
			{ label: "Status", value: "Completed" },
		],
		gallery: [
			"/images/process/step-01.jpg",
			"/images/process/step-03.jpg",
			"/images/grid-bottom-right.jpg",
		],
	},
	{
		id: "sandilyas-abode",
		title: "Sandilya's Abode",
		location: "Aditya Empress Towers",
		type: "Residential",
		category: "residential",
		img: "/images/grid-bottom-right.jpg",
		year: "2022",
		blurb:
			"A collector's apartment where art leads and the interior listens. Quiet backdrops, museum-grade lighting, and bespoke joinery give every cherished piece room to breathe.",
		facts: [
			{ label: "Area", value: "2,900 sq ft" },
			{ label: "Scope", value: "Full Interior" },
			{ label: "Year", value: "2022" },
			{ label: "Status", value: "Completed" },
		],
		gallery: [
			"/images/grid-bottom-right.jpg",
			"/images/about-hero.jpg",
			"/images/grid-top-left.jpg",
		],
	},
];
