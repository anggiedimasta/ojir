import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationPreferences {
	email: boolean;
	push: boolean;
	sms: boolean;
	marketing: boolean;
}

interface PrivacyPreferences {
	profileVisibility: "public" | "private" | "friends";
	showEmail: boolean;
	showPhone: boolean;
}

interface UserPreferences {
	language: string;
	timezone: string;
	currency: string;
	dateFormat: string;
	notifications: NotificationPreferences;
	privacy: PrivacyPreferences;
}

interface UserPreferencesStore {
	preferences: UserPreferences;
	setLanguage: (language: string) => void;
	setTimezone: (timezone: string) => void;
	setCurrency: (currency: string) => void;
	setDateFormat: (format: string) => void;
	setNotificationPreference: (
		key: keyof NotificationPreferences,
		value: boolean,
	) => void;
	setPrivacyPreference: (
		key: keyof PrivacyPreferences,
		value: PrivacyPreferences[keyof PrivacyPreferences],
	) => void;
	resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
	language: "en",
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	currency: "IDR",
	dateFormat: "DD/MM/YYYY",
	notifications: {
		email: true,
		push: true,
		sms: false,
		marketing: false,
	},
	privacy: {
		profileVisibility: "private",
		showEmail: false,
		showPhone: false,
	},
};

export const useUserPreferencesStore = create<UserPreferencesStore>()(
	persist(
		(set, get) => ({
			preferences: defaultPreferences,

			setLanguage: (language) =>
				set((state) => ({
					preferences: { ...state.preferences, language },
				})),

			setTimezone: (timezone) =>
				set((state) => ({
					preferences: { ...state.preferences, timezone },
				})),

			setCurrency: (currency) =>
				set((state) => ({
					preferences: { ...state.preferences, currency },
				})),

			setDateFormat: (dateFormat) =>
				set((state) => ({
					preferences: { ...state.preferences, dateFormat },
				})),

			setNotificationPreference: (key, value) =>
				set((state) => ({
					preferences: {
						...state.preferences,
						notifications: {
							...state.preferences.notifications,
							[key]: value,
						},
					},
				})),

			setPrivacyPreference: (key, value) =>
				set((state) => ({
					preferences: {
						...state.preferences,
						privacy: {
							...state.preferences.privacy,
							[key]: value,
						},
					},
				})),

			resetPreferences: () => set({ preferences: defaultPreferences }),
		}),
		{
			name: "user-preferences-storage",
		},
	),
);
