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

export interface Project {
	id: string;
	title: string;
	location: string;
	type: string;
	category: ProjectCategory;
	img: string;
}

export const PROJECTS: Project[] = [
	{
		id: "vanilla-vista",
		title: "Vanilla Vista",
		location: "My Home Sayuk, Tellapur",
		type: "Residential",
		category: "residential",
		img: "/images/grid-top-left.jpg",
	},
	{
		id: "infinite-retail-stores",
		title: "Infinite Retail Stores",
		location: "All Cities",
		type: "Retail & Commercial",
		category: "commercial",
		img: "/images/grid-top-right.jpg",
	},
	{
		id: "indis-viva-city",
		title: "Indis Viva City",
		location: "Kondapur, Hyderabad",
		type: "Residential",
		category: "residential",
		img: "/images/grid-bottom-left.jpg",
	},
	{
		id: "skyway-9",
		title: "Skyway 9",
		location: "Gandipet, Hyderabad",
		type: "Residential",
		category: "residential",
		img: "/images/grid-bottom-right.jpg",
	},
	{
		id: "chalet-meadows",
		title: "Chalet Meadows",
		location: "RTC Crossroads, Hyderabad",
		type: "Residential",
		category: "residential",
		img: "/images/about-hero.jpg",
	},
	{
		id: "bahar-biryani-cafe",
		title: "Bahar Biryani Cafe",
		location: "Miyapur, Hyderabad",
		type: "Hospitality",
		category: "hospitality",
		img: "/images/process/step-02.jpg",
	},
	{
		id: "indu-fortune-fields",
		title: "Indu Fortune Fields",
		location: "Kukatpally, Hyderabad",
		type: "Residential",
		category: "residential",
		img: "/images/process/step-06.jpg",
	},
	{
		id: "pottery-studio",
		title: "Pottery Studio",
		location: "Filmnagar, Hyderabad",
		type: "Studio",
		category: "commercial",
		img: "/images/process/step-03.jpg",
	},
	{
		id: "dsire-exhibitions",
		title: "Dsire Exhibitions",
		location: "Begumpet, Hyderabad",
		type: "Office Space",
		category: "commercial",
		img: "/images/process/step-01.jpg",
	},
	{
		id: "sandilyas-abode",
		title: "Sandilya's Abode",
		location: "Aditya Empress Towers",
		type: "Residential",
		category: "residential",
		img: "/images/process/step-05.jpg",
	},
];
