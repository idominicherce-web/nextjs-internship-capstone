import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
	// Notifications
	emailNotifications: boolean;
	overdueAlerts: boolean;
	memberJoinAlerts: boolean;
	// Preferences
	defaultLandingView: "dashboard" | "projects" | "calendar";
	compactMode: boolean;
	// Actions
	setEmailNotifications: (val: boolean) => void;
	setOverdueAlerts: (val: boolean) => void;
	setMemberJoinAlerts: (val: boolean) => void;
	setDefaultLandingView: (val: "dashboard" | "projects" | "calendar") => void;
	setCompactMode: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			emailNotifications: true,
			overdueAlerts: true,
			memberJoinAlerts: true,
			defaultLandingView: "dashboard",
			compactMode: false,

			setEmailNotifications: (val) => set({ emailNotifications: val }),
			setOverdueAlerts: (val) => set({ overdueAlerts: val }),
			setMemberJoinAlerts: (val) => set({ memberJoinAlerts: val }),
			setDefaultLandingView: (val) => set({ defaultLandingView: val }),
			setCompactMode: (val) => set({ compactMode: val }),
		}),
		{
			name: "roundtable-realm-settings",
		},
	),
);
