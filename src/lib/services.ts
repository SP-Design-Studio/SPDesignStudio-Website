export interface ServiceItem {
  roman: string;
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  statLabel: string;
  backgroundImage: string;
}

export const services: ServiceItem[] = [
  {
    roman: "I",
    title: "Residential",
    subtitle: "Spaces",
    description: "Warm, expressive interiors designed to feel like home — every detail curated for your lifestyle.",
    stat: "120",
    statLabel: "Projects",
    backgroundImage: "/images/grid-top-left.jpg",
  },
  {
    roman: "II",
    title: "Scale",
    subtitle: "",
    description: "From intimate rooms to vast commercial expanses, we design at every scale.",
    stat: "450k",
    statLabel: "Sq. Ft. Transformed",
    backgroundImage: "",
  },
  {
    roman: "III",
    title: "Commercial",
    subtitle: "Spaces",
    description: "Elegant, functional workplaces that reflect your brand and inspire productivity.",
    stat: "20,000+",
    statLabel: "Commercial Sft",
    backgroundImage: "/images/grid-top-right.jpg",
  },
  {
    roman: "IV",
    title: "Interior",
    subtitle: "Styling",
    description: "Curated spaces with an eye for proportion, texture, and the art of restraint.",
    stat: "",
    statLabel: "Curated Spaces",
    backgroundImage: "",
  },
  {
    roman: "V",
    title: "Execution",
    subtitle: "TurnKey",
    description: "Holistic design experiences — from vision to execution — with every touchpoint considered.",
    stat: "30",
    statLabel: "TurnKey Solutions",
    backgroundImage: "/images/grid-bottom-left.jpg",
  },
  {
    roman: "VI",
    title: "Strategy",
    subtitle: "Consultation",
    description: "Breathing new life into spaces with intentional design, craftsmanship, and modern sensibility.",
    stat: "75+",
    statLabel: "Consultations",
    backgroundImage: "/images/grid-bottom-right.jpg",
  },
];
