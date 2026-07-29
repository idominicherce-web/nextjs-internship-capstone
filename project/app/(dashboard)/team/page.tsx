import { eq } from "drizzle-orm";
import { TeamClient } from "@/components/team/team-client";
import type { Member } from "@/components/team/team-directory-table";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, users, workspaceInvitations } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
	const dbUser = await getOrCreateDbUser();

	const dbUsers = await db.select().from(users);
	const allProjects = await db.select().from(projects);

	// Fetch real pending invitations from Neon PostgreSQL database
	const pendingInvitesFromDb = await db
		.select()
		.from(workspaceInvitations)
		.where(eq(workspaceInvitations.status, "pending"));

	// Map Real DB Users
	const mappedDbUsers: Member[] = dbUsers.map((u, idx) => {
		const userProjects = allProjects.filter((p) => p.userId === u.id).length;
		const displayName = u.name || u.email.split("@")[0];
		const initials = displayName
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

		return {
			id: u.id,
			name: displayName,
			role:
				u.role || (u.id === dbUser?.id ? "Workspace Owner" : "Project Manager"),
			email: u.email,
			avatar: initials || "U",
			projectCount: userProjects || 0,
			status: idx === 0 ? "Online" : idx % 2 === 0 ? "Away" : "Offline",
			lastActive: idx === 0 ? "Today" : "Yesterday",
		};
	});

	// Format real pending invitations for the UI component
	const mappedPendingInvites = pendingInvitesFromDb.map((inv) => ({
		id: inv.id,
		email: inv.email,
		invitedAgo: new Date(inv.createdAt).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}),
	}));

	const sampleActivities = [
		{
			id: "1",
			user: "Dominic Herce",
			action: "invited team member to workspace",
			timeAgo: "Recently",
		},
	];

	return (
		<TeamClient
			initialMembers={mappedDbUsers}
			activities={sampleActivities}
			pendingInvitations={mappedPendingInvites}
		/>
	);
}
