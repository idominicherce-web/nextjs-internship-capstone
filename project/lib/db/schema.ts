import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// USERS TABLE
export const users = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	clerkId: text("clerk_id").notNull().unique(),
	email: text("email").notNull().unique(),
	name: text("name"),
	role: text("role").default("Project Manager"),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// NEW: USER SETTINGS TABLE
export const userSettings = pgTable("user_settings", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: "cascade" }),
	taskAssignedInApp: boolean("task_assigned_in_app").default(true).notNull(),
	taskAssignedEmail: boolean("task_assigned_email").default(true).notNull(),
	dueDatesInApp: boolean("due_dates_in_app").default(true).notNull(),
	dueDatesEmail: boolean("due_dates_email").default(true).notNull(),
	mentionsInApp: boolean("mentions_in_app").default(true).notNull(),
	mentionsEmail: boolean("mentions_email").default(false).notNull(),
	emailDigest: text("email_digest").default("daily").notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// NEW: WORKSPACE INVITATIONS TABLE
export const workspaceInvitations = pgTable("workspace_invitations", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull(),
	role: text("role").default("Project Manager").notNull(),
	invitedById: text("invited_by_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	status: text("status").default("pending").notNull(), // 'pending', 'accepted', 'cancelled'
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// PROJECTS TABLE
export const projects = pgTable("projects", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// LISTS TABLE (Kanban Columns)
export const lists = pgTable("lists", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	position: integer("position").notNull(),
	projectId: text("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TASKS TABLE
export const tasks = pgTable("tasks", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text("title").notNull(),
	description: text("description"),
	position: integer("position").notNull(),
	listId: text("list_id")
		.notNull()
		.references(() => lists.id, { onDelete: "cascade" }),
	userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
	dueDate: timestamp("due_date"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ACTIVITY LOGS TABLE
export const activityLogs = pgTable("activity_logs", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	action: text("action").notNull(),
	entityType: text("entity_type").notNull(),
	entityName: text("entity_name").notNull(),
	details: text("details"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// DRIZZLE RELATIONS
// ==========================================

	settings: one(userSettings, {
			fields: [users.id],
			references: [userSettings.userId],
		}),
		sentInvitations: many(workspaceInvitations),
	projects: many(projects),
	tasks: many(tasks),
}));

export const workspaceInvitationsRelations = relations(
	workspaceInvitations,
	({ one }) => ({
		invitedBy: one(users, {
			fields: [workspaceInvitations.invitedById],
			references: [users.id],
		}),
	}),
);


export const projectsRelations = relations(projects, ({ one, many }) => ({
	user: one(users, {
		fields: [projects.userId],
		references: [users.id],
	}),
	lists: many(lists),
}));

export const listsRelations = relations(lists, ({ one, many }) => ({
	project: one(projects, {
		fields: [lists.projectId],
		references: [projects.id],
	}),
	tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id],
	}),
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id],
	}),
}));
