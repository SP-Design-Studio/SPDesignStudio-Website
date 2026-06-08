import { createClient } from "@supabase/supabase-js";
import { STATS, DISCIPLINES, SECTIONS } from "../src/lib/data/home";
import { ABOUT } from "../src/lib/data/about";
import { CONTACT } from "../src/lib/data/contact";
import { CAREERS } from "../src/lib/data/careers";
import { STUDIO } from "../src/lib/data/studio";
import { PARTNER_DIRECTORY } from "../src/lib/data/partners";
import { PROJECTS } from "../src/lib/data/projects";
import { brandLogos } from "../src/lib/brands";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
	console.error("Missing Supabase env in .env.local");
	process.exit(1);
}

const db = createClient(url, key, {
	auth: { persistSession: false, autoRefreshToken: false },
});

async function isEmpty(table: string) {
	const { count, error } = await db
		.from(table)
		.select("*", { count: "exact", head: true });
	if (error) throw new Error(`${table}: ${error.message}`);
	return (count ?? 0) === 0;
}

async function seedTable<T>(table: string, rows: T[]) {
	if (!(await isEmpty(table))) {
		console.log(`• ${table}: already has data, skipped`);
		return;
	}
	const { error } = await db.from(table).insert(rows as object[]);
	if (error) throw new Error(`${table}: ${error.message}`);
	console.log(`✓ ${table}: inserted ${rows.length}`);
}

async function main() {
	await seedTable(
		"home_stats",
		STATS.map((s, i) => ({ value: s.value, label: s.label, sort: i })),
	);

	await seedTable(
		"home_disciplines",
		DISCIPLINES.map((d, i) => ({
			top_label: d.topLabel,
			img: d.img,
			big_stat: d.bigStat,
			description: d.desc,
			variant: d.variant,
			span: d.span,
			sort: i,
		})),
	);

	await seedTable(
		"partners",
		brandLogos.map((b, i) => ({ name: b.name, logo: b.logo, sort: i })),
	);

	await seedTable(
		"partner_categories",
		PARTNER_DIRECTORY.map((c, i) => ({
			category: c.category,
			brands: c.brands,
			sort: i,
		})),
	);

	await seedTable(
		"testimonials",
		SECTIONS.voices.quotes.map((q, i) => ({
			quote: q.quote,
			name: q.name,
			detail: q.detail,
			img: q.img,
			sort: i,
		})),
	);

	await seedTable(
		"team_members",
		ABOUT.team.members.map((m, i) => ({
			name: m.name,
			role: m.role,
			note: m.note,
			img: m.img,
			sort: i,
		})),
	);

	await seedTable(
		"timeline_entries",
		ABOUT.timeline.entries.map((e, i) => ({
			year: e.year,
			label: e.label,
			description: e.desc,
			img: e.img,
			sort: i,
		})),
	);

	await seedTable(
		"honours",
		ABOUT.achievements.items.map((a, i) => ({
			img: a.img,
			year: a.year,
			by_line: a.by,
			title: a.title,
			description: a.desc,
			sort: i,
		})),
	);

	if (await isEmpty("projects")) {
		for (let i = 0; i < PROJECTS.length; i++) {
			const p = PROJECTS[i];
			const { data, error } = await db
				.from("projects")
				.insert({
					slug: p.id,
					title: p.title,
					location: p.location,
					type: p.type,
					category: p.category,
					img: p.img,
					year: p.year,
					blurb: p.blurb,
					sort: i,
				})
				.select("id")
				.single();
			if (error) throw new Error(`projects: ${error.message}`);
			const pid = data.id;
			await db.from("project_facts").insert(
				p.facts.map((f, fi) => ({
					project_id: pid,
					label: f.label,
					value: f.value,
					sort: fi,
				})),
			);
			await db.from("project_gallery").insert(
				p.gallery.map((u, gi) => ({ project_id: pid, url: u, sort: gi })),
			);
		}
		console.log(`✓ projects: inserted ${PROJECTS.length} (+ facts & gallery)`);
	} else {
		console.log("• projects: already has data, skipped");
	}

	if (await isEmpty("site_settings")) {
		const { error } = await db.from("site_settings").insert({
			id: "main",
			founded: STUDIO.founded,
			name: STUDIO.name,
			founder: STUDIO.founder,
			location: STUDIO.location,
			email: STUDIO.email,
			phone: STUDIO.phone,
			address: STUDIO.address,
			maps_url: STUDIO.mapsUrl,
			instagram: STUDIO.socials.instagram,
			linkedin: STUDIO.socials.linkedin,
			whatsapp: STUDIO.socials.whatsapp,
			hours: CONTACT.visit.hours,
		});
		if (error) throw new Error(`site_settings: ${error.message}`);
		console.log("✓ site_settings: inserted");
	} else {
		console.log("• site_settings: already has data, skipped");
	}

	await seedTable(
		"career_openings",
		CAREERS.openings.map((o, i) => ({
			role: o.role,
			type: o.type,
			location: o.location,
			description: o.desc,
			sort: i,
		})),
	);

	if (await isEmpty("careers_settings")) {
		const { error } = await db.from("careers_settings").insert({
			id: "main",
			subtitle: CAREERS.subtitle,
			empty_note: CAREERS.emptyNote,
			apply_email: CAREERS.applyEmail,
		});
		if (error) throw new Error(`careers_settings: ${error.message}`);
		console.log("✓ careers_settings: inserted");
	} else {
		console.log("• careers_settings: already has data, skipped");
	}

	console.log("\nSeed complete.");
}

main().catch((e) => {
	console.error("\nSeed failed:", e.message);
	process.exit(1);
});
