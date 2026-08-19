import { auth, clerkClient } from "@clerk/nextjs/server";
import { desc, eq, inArray, like, or } from "drizzle-orm";
import { TeamClient } from "@/components/team/team-client";
import type { Member } from "@/components/team/team-directory-table";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { activityLogs, projectMembers, projects, users } from "@/lib/db/schema";

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

				// 2. Fetch live organization members from Clerk
				const clerkMemberships =
					await client.organizations.getOrganizationMembershipList({
						organizationId: targetOrgId,
					});

				const clerkUserIds = clerkMemberships.data
					.map((mem) => mem.publicUserData?.userId)
					.filter(Boolean) as string[];

				// Sync with database users matching by clerkId or internal UUID
				const dbUsersList =
					clerkUserIds.length > 0
						? await db
								.select()
								.from(users)
								.where(
									or(
										inArray(users.clerkId, clerkUserIds),
										inArray(users.id, clerkUserIds),
									),
								)
						: [];

				const allProjects = await db.select().from(projects);
				const allProjectMemberships = await db.select().from(projectMembers);

				mappedMembers = clerkMemberships.data.map((mem, idx: number) => {
					const memberUserId = mem.publicUserData?.userId || "";
					const matchingDbUser = dbUsersList.find(
						(u) => u.clerkId === memberUserId || u.id === memberUserId,
					);

					// Combine all known DB/Clerk identifiers for this user
					const validUserIds = new Set(
						[memberUserId, matchingDbUser?.id, matchingDbUser?.clerkId].filter(
							Boolean,
						),
					);

					// Calculate unique project IDs where the user is an OWNER or an ASSIGNED MEMBER
					const assignedProjectIds = new Set<string>();

					// Add projects owned by user
					allProjects.forEach((p) => {
						if (validUserIds.has(p.userId)) {
							assignedProjectIds.add(p.id);
						}
					});

					// Add projects assigned via projectMembers junction table
					allProjectMemberships.forEach((pm) => {
						if (validUserIds.has(pm.userId)) {
							assignedProjectIds.add(pm.projectId);
						}
					});

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
						matchingDbUser?.role ||
						(mem.role === "org:admin" ? "Workspace Owner" : "Project Manager");

					return {
						id: memberUserId,
						name: displayName,
						role: roleTitle,
						email: email,
						avatar: initials || "U",
						projectCount: assignedProjectIds.size, // ✅ Counts both owned AND assigned projects
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
		const allProjectMemberships = await db.select().from(projectMembers);

		mappedMembers = dbUsersList.map((u, idx: number) => {
			const validUserIds = new Set([u.id, u.clerkId].filter(Boolean));
			const assignedProjectIds = new Set<string>();

			allProjects.forEach((p) => {
				if (validUserIds.has(p.userId)) {
					assignedProjectIds.add(p.id);
				}
			});

			allProjectMemberships.forEach((pm) => {
				if (validUserIds.has(pm.userId)) {
					assignedProjectIds.add(pm.projectId);
				}
			});

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
				projectCount: assignedProjectIds.size, // ✅ Counts both owned AND assigned projects
				status: idx === 0 ? "Online" : idx % 2 === 0 ? "Away" : "Offline",
				lastActive: idx === 0 ? "Today" : "Yesterday",
			};
		});
	}

	// Fetch Team-related Activity Logs
	const dbLogs = await db
		.select({
			id: activityLogs.id,
			action: activityLogs.action,
			entityName: activityLogs.entityName,
			details: activityLogs.details,
			createdAt: activityLogs.createdAt,
			userName: users.name,
			userEmail: users.email,
		})
		.from(activityLogs)
		.leftJoin(
			users,
			or(
				eq(activityLogs.userId, users.id),
				eq(activityLogs.userId, users.clerkId),
			),
		)
		.where(
			or(
				like(activityLogs.action, "%Invite%"),
				like(activityLogs.action, "%Revoked%"),
				like(activityLogs.action, "%Role%"),
				like(activityLogs.action, "%Discharged%"),
				like(activityLogs.action, "%Joined%"),
				like(activityLogs.action, "%Officer%"),
			),
		)
		.orderBy(desc(activityLogs.createdAt))
		.limit(10);

	const formattedActivities = dbLogs.map((log) => {
		const actorName =
			log.userName || log.userEmail?.split("@")[0] || "Council Officer";

		let rawDetails = log.details || `${log.action} ${log.entityName}`;

		rawDetails = rawDetails
			.replace(/\borg:admin\b/g, "Admin")
			.replace(/\borg:member\b/g, "Member");

		const diffMinutes = Math.floor(
			(Date.now() - new Date(log.createdAt).getTime()) / (1000 * 60),
		);
		let timeAgo = "Just now";
		if (diffMinutes >= 60 * 24) {
			timeAgo = `${Math.floor(diffMinutes / (60 * 24))}d ago`;
		} else if (diffMinutes >= 60) {
			timeAgo = `${Math.floor(diffMinutes / 60)}h ago`;
		} else if (diffMinutes > 0) {
			timeAgo = `${diffMinutes}m ago`;
		}

		const lowerAction = log.action.toLowerCase();
		let type: "invite" | "accept" | "revoke" | "assign" | "general" = "general";
		if (lowerAction.includes("invited")) type = "invite";
		else if (lowerAction.includes("joined") || lowerAction.includes("accepted"))
			type = "accept";
		else if (
			lowerAction.includes("revoked") ||
			lowerAction.includes("discharged")
		)
			type = "revoke";
		else if (
			lowerAction.includes("assigned") ||
			lowerAction.includes("officer") ||
			lowerAction.includes("role")
		)
			type = "assign";

		return {
			id: log.id,
			user: actorName,
			action: rawDetails.trim(),
			timeAgo,
			type,
		};
	});

	return (
		<TeamClient
			initialMembers={mappedMembers}
			activities={formattedActivities}
			pendingInvitations={mappedPendingInvites}
		/>
	);
}
