import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
	console.log("⚔️ Starting presentation database reset & seed...");

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

	// 2. Clear project data tables
	console.log("🧹 Clearing existing project data...");
	await db.delete(schema.taskComments);
	await db.delete(schema.tasks);
	await db.delete(schema.lists);
	await db.delete(schema.projectMembers);
	await db.delete(schema.activityLogs);
	await db.delete(schema.notifications);
	await db.delete(schema.projects);

	console.log("🌱 Seeding presentation projects & tasks...");

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

	// Dynamic relative dates relative to today
	const now = new Date();
	const overdueDate1 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
	const overdueDate2 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
	const todayDate = new Date(now);
	const tomorrowDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // Tomorrow
	const upcomingDate = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 days later

	// 6. Seed Tasks across all urgency buckets for Tasks Requiring Attention
	const createdTasks1 = await db
		.insert(schema.tasks)
		.values([
			// OVERDUE Tasks
			{
				title: "Critical Security Patch & Audit",
				description: "Fix CSRF vulnerability in Server Actions.",
				position: 0,
				listId: listMap1.get("In Progress")!,
				userId: ownerUser.id,
				priority: "Urgent",
				dueDate: overdueDate1,
			},
			{
				title: "Database Migration Review",
				description: "Verify foreign key constraints on cascade delete.",
				position: 1,
				listId: listMap1.get("To Do")!,
				userId: ownerUser.id,
				priority: "High",
				dueDate: overdueDate2,
			},
			// DUE TODAY Tasks
			{
				title: "Deploy Vercel Production Build",
				description: "Verify edge routing and environment variables.",
				position: 0,
				listId: listMap1.get("To Do")!,
				userId: ownerUser.id,
				priority: "Urgent",
				dueDate: todayDate,
			},
			{
				title: "Refactor Navigation Drawer Layout",
				description: "Implement smooth mobile-first drawer container.",
				position: 0,
				listId: listMap1.get("In Review")!,
				userId: ownerUser.id,
				priority: "High",
				dueDate: todayDate,
			},
			// DUE TOMORROW Tasks
			{
				title: "Configure Clerk Webhook Sync",
				description: "Automatically provision user records on invite.",
				position: 1,
				listId: listMap1.get("To Do")!,
				userId: ownerUser.id,
				priority: "Medium",
				dueDate: tomorrowDate,
			},
			// UPCOMING Tasks
			{
				title: "Design Kingdom Analytics Dashboard",
				description:
					"Build velocity meters and active task distribution charts.",
				position: 2,
				listId: listMap1.get("Backlog")!,
				userId: ownerUser.id,
				priority: "Low",
				dueDate: upcomingDate,
			},
			// DONE Tasks
			{
				title: "Setup Initial Project Charter",
				description: "Kickoff workspace charter and define objectives.",
				position: 0,
				listId: listMap1.get("Done")!,
				userId: ownerUser.id,
				priority: "High",
				dueDate: overdueDate1,
			},
		])
		.returning();

	// 7. Seed Comments
	await db.insert(schema.taskComments).values([
		{
			taskId: createdTasks1[0].id,
			userId: secondUser.id,
			content: "I reviewed the patch and verified it on staging.",
		},
		{
			taskId: createdTasks1[3].id,
			userId: ownerUser.id,
			content: "Drawer layout tested on mobile screens, looks solid!",
		},
	]);

	// 8. Seed Completed Project (Project 2)
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
			dueDate: overdueDate1,
		},
		{
			title: "Deploy Vercel Edge Router",
			description: "Configure proxy matchers and static asset routing.",
			position: 1,
			listId: listMap2.get("Done")!,
			userId: ownerUser.id,
			priority: "Urgent",
			dueDate: overdueDate2,
		},
	]);

	// 9. Seed Activity Logs & Notifications
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
				description: `"Critical Security Patch & Audit" created by ${ownerUser.name || "Officer"}. [SLUG:${project1.slug}] [TASK:${createdTasks1[0].id}]`,
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
				entityName: createdTasks1[0].title,
				details: `[TASK:${createdTasks1[0].id}] Posted dispatch comment on task: "${createdTasks1[0].title}"`,
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

	console.log("✨ Seed completed successfully with demo tasks!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("❌ Seed failed:", err);
	process.exit(1);
});
