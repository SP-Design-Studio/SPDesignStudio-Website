import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { VerifyForm } from "./VerifyForm";

export const metadata = { title: "Your code" };

export default async function VerifyPage() {
	const profile = await getProfile();
	if (!profile) redirect("/admin/login");
	if (profile.mfa === "ok") redirect("/admin");
	if (profile.mfa === "enroll") redirect("/admin/account");
	return <VerifyForm />;
}
