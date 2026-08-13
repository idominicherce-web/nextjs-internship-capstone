import { auth, clerkClient } from "@clerk/nextjs/server";
import { inArray } from "drizzle-orm";
import { TeamClient } from "@/components/team/team-client";
import type { Member } from "@/components/team/team-directory-table";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, users } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

/**
 * Helper function to resolve the target Roundtable Organization ID
 */
async function getTargetOrgId(userId: string, sessionOrgId?: string | null) {
	if (sessionOrgId) return sessionOrgId;

	const client = await clerkClient();
	const userOrgs = await client.users.getOrganizationMembershipList({ userId });

	if (userOrgs.data.length > 0) {
		const roundtableOrg = userOrgs.data.find(
			(mem) =>
				mem.organization.name.toLowerCase().includes("roundtable") ||
				mem.organization.slug?.includes("roundtable"),
		);
		return roundtableOrg
			? roundtableOrg.organization.id
			: userOrgs.data[0].organization.id;
	}

	const allOrgs = await client.organizations.getOrganizationList({
		query: "Roundtable",
		limit: 1,
	});

	if (allOrgs.data.length > 0) return allOrgs.data[0].id;

	const fallbackOrgs = await client.organizations.getOrganizationList({
		limit: 1,
	});
	return fallbackOrgs.data.length > 0 ? fallbackOrgs.data[0].id : null;
}

export default async function TeamPage() {
	const dbUser = await getOrCreateDbUser();
	const { userId, orgId: sessionOrgId } = await auth();

	let mappedPendingInvites: {
		id: string;
		email: string;
		role?: string;
		invitedAgo: string;
	}[] = [];

	let mappedMembers: Member[] = [];

	if (userId) {
		const targetOrgId = await getTargetOrgId(userId, sessionOrgId);

		if (targetOrgId) {
			try {
				const client = await clerkClient();

				// 1. Fetch live pending invitations from Clerk
				const clerkInvites =
					await client.organizations.getOrganizationInvitationList({
						organizationId: targetOrgId,
						status: ["pending"],
					});

				mappedPendingInvites = clerkInvites.data.map((inv) => ({
					id: inv.id,
					email: inv.emailAddress,
					role: inv.role === "org:admin" ? "Admin" : "Member",
					invitedAgo: new Date(inv.createdAt).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					}),
				}));

				// 2. Fetch live organization members from Clerk (getOrganizationMembershipList)
				const clerkMemberships =
					await client.organizations.getOrganizationMembershipList({
						organizationId: targetOrgId,
					});

				const clerkUserIds = clerkMemberships.data
					.map((mem) => mem.publicUserData?.userId)
					.filter(Boolean) as string[];

				// Sync with database users for project count calculations
				const dbUsersList =
					clerkUserIds.length > 0
						? await db
								.select()
								.from(users)
								.where(inArray(users.id, clerkUserIds))
						: [];

				const allProjects = await db.select().from(projects);

				mappedMembers = clerkMemberships.data.map((mem, idx: number) => {
					const memberUserId = mem.publicUserData?.userId || "";
					const matchingDbUser = dbUsersList.find((u) => u.id === memberUserId);

					const userProjectsCount = allProjects.filter(
						(p) => p.userId === memberUserId,
					).length;

					const firstName = mem.publicUserData?.firstName || "";
					const lastName = mem.publicUserData?.lastName || "";
					const displayName =
						`${firstName} ${lastName}`.trim() ||
						matchingDbUser?.name ||
						mem.publicUserData?.identifier?.split("@")[0] ||
						"Council Officer";

					const email =
						mem.publicUserData?.identifier || matchingDbUser?.email || "";

					const initials = displayName
						.split(" ")
						.map((n: string) => n[0])
						.join("")
						.toUpperCase()
						.slice(0, 2);

					const roleTitle =
						mem.role === "org:admin"
							? "Workspace Owner"
							: matchingDbUser?.role || "Project Manager";

					return {
						id: memberUserId,
						name: displayName,
						role: roleTitle,
						email: email,
						avatar: initials || "U",
						projectCount: userProjectsCount,
						status: idx === 0 ? "Online" : idx % 2 === 0 ? "Away" : "Offline",
						lastActive: idx === 0 ? "Today" : "Yesterday",
					};
				});
			} catch (err) {
				console.error("Failed to load Clerk organization data:", err);
			}
		}
	}

	// Fallback to local DB users if no Clerk organization structure is returned
	if (mappedMembers.length === 0) {
		const dbUsersList = await db.select().from(users);
		const allProjects = await db.select().from(projects);

		mappedMembers = dbUsersList.map((u, idx: number) => {
			const userProjects = allProjects.filter((p) => p.userId === u.id).length;
			const displayName = u.name || u.email.split("@")[0];
			const initials = displayName
				.split(" ")
				.map((n: string) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);

			return {
				id: u.id,
				name: displayName,
				role:
					u.role ||
					(u.id === dbUser?.id ? "Workspace Owner" : "Project Manager"),
				email: u.email,
				avatar: initials || "U",
				projectCount: userProjects,
				status: idx === 0 ? "Online" : idx % 2 === 0 ? "Away" : "Offline",
				lastActive: idx === 0 ? "Today" : "Yesterday",
			};
		});
	}

	const sampleActivities = [
		{
			id: "1",
			user: dbUser?.name || "Workspace Admin",
			action: "invited team member to workspace",
			timeAgo: "Recently",
		},
	];

	return (
		<TeamClient
			initialMembers={mappedMembers}
			activities={sampleActivities}
			pendingInvitations={mappedPendingInvites}
		/>
	);
}
