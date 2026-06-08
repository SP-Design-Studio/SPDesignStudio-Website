import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.argv[2];
const email = process.argv[3] || process.env.FOUNDER_EMAIL;
const role = process.argv[4] || "founder";
const fullName = process.argv[5];

if (!url || !key) {
	console.error(
		"Missing env. Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local",
	);
	process.exit(1);
}
if (!password || password.length < 8) {
	console.error(
		'Usage:\n  npm run bootstrap:admin -- "<password>" [email] [role] ["Full Name"]\n  (role = founder | admin | editor, default founder)',
	);
	process.exit(1);
}
if (!email) {
	console.error("No email. Pass one as the 2nd arg or set FOUNDER_EMAIL.");
	process.exit(1);
}
if (!["founder", "admin", "editor"].includes(role)) {
	console.error(`Invalid role "${role}". Use founder, admin, or editor.`);
	process.exit(1);
}

const supabase = createClient(url, key, {
	auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
if (listErr) {
	console.error("listUsers failed:", listErr.message);
	process.exit(1);
}

let user = list.users.find(
	(u) => u.email?.toLowerCase() === email.toLowerCase(),
);

if (user) {
	const { error } = await supabase.auth.admin.updateUserById(user.id, {
		password,
		email_confirm: true,
	});
	if (error) {
		console.error("updateUser failed:", error.message);
		process.exit(1);
	}
	console.log("Updated existing user:", email);
} else {
	const { data, error } = await supabase.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
	});
	if (error) {
		console.error("createUser failed:", error.message);
		process.exit(1);
	}
	user = data.user;
	console.log("Created user:", email);
}

const profileRow = { id: user.id, email, role };
if (fullName && fullName.trim()) profileRow.full_name = fullName.trim();

const { error: profErr } = await supabase
	.from("profiles")
	.upsert(profileRow, { onConflict: "id" });
if (profErr) {
	console.error("profile upsert failed:", profErr.message);
	process.exit(1);
}

console.log(`\n✓ ${role} ready. Sign in at /admin/login with:`);
console.log("  email:   ", email);
console.log("  password:  (the one you just set)\n");
