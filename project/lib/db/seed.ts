import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
	console.log("⚔️ Starting database reset & seed...");

	// 1. Fetch existing users to preserve them
	const existingUsers = await db.query.users.findMany();

	if (existingUsers.length === 0) {
		console.error(
			"❌ No existing users found in Neon DB! Please sign in once first.",
		);
		process.exit(1);
	}

	console.log(`👤 Preserving ${existingUsers.length} existing user(s):`);
	for (const u of existingUsers) {
		console.log(`   - ${u.name || u.email} (${u.id})`);
	}

	const ownerUser = existingUsers[0];
	const secondUser = existingUsers[1] || existingUsers[0];

	// 2. Clear all tables EXCEPT users & user_settings
	console.log("🧹 Clearing existing project data...");
	await db.delete(schema.taskComments);
	await db.delete(schema.tasks);
	await db.delete(schema.lists);
	await db.delete(schema.projectMembers);
	await db.delete(schema.activityLogs);
	await db.delete(schema.notifications);
	await db.delete(schema.projects);

	console.log("🌱 Seeding sample projects & Kanban boards...");

	// 3. Create Projects
	const [project1] = await db
		.insert(schema.projects)
		.values({
			name: "Project Excalibur",
			slug: "project-excalibur",
			description:
				"Core workspace platform overhaul and UI refinement campaign.",
			userId: ownerUser.id,
		})
		.returning();

	const [project2] = await db
		.insert(schema.projects)
		.values({
			name: "Siege Strategy Alpha",
			slug: "siege-strategy-alpha",
			description:
				"Initial security audit and server action dispatch architecture.",
			userId: ownerUser.id,
		})
		.returning();

	// 4. Assign Project Memberships
	const projectMembersData = [];
	for (const user of existingUsers) {
		projectMembersData.push(
			{
				projectId: project1.id,
				userId: user.id,
				role: user.id === ownerUser.id ? "Owner" : "Member",
			},
			{
				projectId: project2.id,
				userId: user.id,
				role: user.id === ownerUser.id ? "Owner" : "Member",
			},
		);
	}
	await db.insert(schema.projectMembers).values(projectMembersData);

	// 5. Seed Kanban Lists
	const createdLists1 = await db
		.insert(schema.lists)
		.values([
			{ name: "Backlog", position: 0, projectId: project1.id },
			{ name: "To Do", position: 1, projectId: project1.id },
			{ name: "In Progress", position: 2, projectId: project1.id },
			{ name: "In Review", position: 3, projectId: project1.id },
			{ name: "Done", position: 4, projectId: project1.id },
		])
		.returning();

	const listMap1 = new Map(createdLists1.map((l) => [l.name, l.id]));

	// Explicit August 2026 dates for calendar alignment
	const aug1 = new Date("2026-08-01T09:00:00.000Z");
	const aug20 = new Date("2026-08-20T10:00:00.000Z");
	const aug24 = new Date("2026-08-24T14:00:00.000Z");
	const aug27 = new Date("2026-08-27T16:00:00.000Z");
	const aug30 = new Date("2026-08-30T18:00:00.000Z");

	// 6. Seed Tasks for August 2026 Calendar Grid
	const createdTasks1 = await db
		.insert(schema.tasks)
		.values([
			{
				title: "Setup Initial Project Charter",
				description:
					"Kickoff workspace charter and define operational objectives.",
				position: 0,
				listId: listMap1.get("Done")!,
				userId: ownerUser.id,
				priority: "High",
				dueDate: aug1,
			},
			{
				title: "Database Schema Migrations",
				description: "Setup Neon Drizzle ORM foreign keys and cascade rules.",
				position: 1,
				listId: listMap1.get("Done")!,
				userId: ownerUser.id,
				priority: "High",
				dueDate: aug20,
			},
			{
				title: "Refactor Navigation Drawer Layout",
				description:
					"Implement smooth mobile-first drawer container with backdrop blur.",
				position: 0,
				listId: listMap1.get("In Progress")!,
				userId: ownerUser.id,
				priority: "High",
				dueDate: aug24,
			},
			{
				title: "Configure Clerk Webhook Sync",
				description:
					"Automatically provision user records on invitation acceptance.",
				position: 0,
				listId: listMap1.get("To Do")!,
				userId: secondUser.id,
				priority: "Urgent",
				dueDate: aug27,
			},
			{
				title: "Design Kingdom Analytics Dashboard",
				description:
					"Build velocity meters and active task distribution charts.",
				position: 1,
				listId: listMap1.get("To Do")!,
				userId: ownerUser.id,
				priority: "Medium",
				dueDate: aug30,
			},
		])
		.returning();

	// 7. Seed Task Comments
	await db.insert(schema.taskComments).values([
		{
			taskId: createdTasks1[2].id,
			userId: secondUser.id,
			content: "Drawer layout tested on mobile screens, looks solid!",
		},
		{
			taskId: createdTasks1[3].id,
			userId: ownerUser.id,
			content: "Webhook endpoint configured and verified.",
		},
	]);

	// 8. Seed Completed Project (Project 2 - All Tasks in Done)
	const createdLists2 = await db
		.insert(schema.lists)
		.values([
			{ name: "Backlog", position: 0, projectId: project2.id },
			{ name: "To Do", position: 1, projectId: project2.id },
			{ name: "In Progress", position: 2, projectId: project2.id },
			{ name: "In Review", position: 3, projectId: project2.id },
			{ name: "Done", position: 4, projectId: project2.id },
		])
		.returning();

	const listMap2 = new Map(createdLists2.map((l) => [l.name, l.id]));

	await db.insert(schema.tasks).values([
		{
			title: "Initial Security Inspection",
			description: "Audit route permissions and authentication checks.",
			position: 0,
			listId: listMap2.get("Done")!,
			userId: ownerUser.id,
			priority: "High",
			dueDate: aug20,
		},
		{
			title: "Deploy Vercel Edge Router",
			description: "Configure proxy matchers and static asset routing.",
			position: 1,
			listId: listMap2.get("Done")!,
			userId: ownerUser.id,
			priority: "Urgent",
			dueDate: aug24,
		},
	]);

	// 9. Seed Activity Logs & Notifications for all preserved users
	const notificationsData = [];
	const activityLogsData = [];

	for (const user of existingUsers) {
		notificationsData.push(
			{
				userId: user.id,
				title: `🏆 Quest Completed: ${project2.name}`,
				description: `All campaign objectives for "${project2.name}" have been fulfilled! [SLUG:${project2.slug}]`,
				type: "project",
				read: false,
			},
			{
				userId: user.id,
				title: "New Task Appointed",
				description: `"Refactor Navigation Drawer Layout" created by ${ownerUser.name || "Officer"}. [SLUG:${project1.slug}]`,
				type: "task",
				read: false,
			},
		);

		activityLogsData.push(
			{
				projectId: project1.id,
				userId: user.id,
				action: "Created Project",
				entityType: "project",
				entityName: project1.name,
				details: `Commissioned quest dossier: ${project1.name}`,
			},
			{
				projectId: project1.id,
				userId: user.id,
				action: "COMMENTED",
				entityType: "task",
				entityName: createdTasks1[2].title,
				details: `[TASK:${createdTasks1[2].id}] Posted dispatch comment on task: "${createdTasks1[2].title}"`,
			},
			{
				projectId: project2.id,
				userId: user.id,
				action: "Quest Completed",
				entityType: "project",
				entityName: project2.name,
				details: `100% of campaign objectives for "${project2.name}" have been fulfilled!`,
			},
		);
	}

	await db.insert(schema.notifications).values(notificationsData);
	await db.insert(schema.activityLogs).values(activityLogsData);

	console.log(
		"✨ Seed completed successfully! August 2026 calendar dates populated.",
	);
	process.exit(0);
}

seed().catch((err) => {
	console.error("❌ Seed failed:", err);
	process.exit(1);
});
