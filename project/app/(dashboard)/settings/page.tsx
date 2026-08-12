import { eq } from "drizzle-orm";
import { Shield } from "lucide-react";
import { SettingsClient } from "@/components/settings/settings-client";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
	const dbUser = await getOrCreateDbUser();

	if (!dbUser) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#15100C] p-6 text-center font-serif text-[#D7B05C]">
				<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#2D1B10] p-8 shadow-2xl">
					<Shield className="mx-auto mb-3 text-[#D7B05C]" size={32} />
					<h1 className="text-xl font-black uppercase tracking-widest text-[#F8EEDB]">
						Access Denied
					</h1>
					<p className="mt-2 font-sans text-xs text-[#E3C279]">
						Unauthorized traveler. Please sign in to view settings.
					</p>
				</div>
			</div>
		);
	}

	// Fetch existing user settings from DB
	const settings = await db.query.userSettings.findFirst({
		where: eq(userSettings.userId, dbUser.id),
	});

	return (
		<main className="min-w-0">
			<SettingsClient
				user={{
					name: dbUser.name,
					email: dbUser.email,
					role: dbUser.role,
					createdAt: dbUser.createdAt,
				}}
				initialSettings={settings}
			/>
		</main>
	);
}
