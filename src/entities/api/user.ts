import type { FilterInput, PaginatedInput } from "./common";

// User API Response types
export interface UserResponse {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	emailVerified?: Date | null;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserProfileResponse extends UserResponse {
	bio?: string;
	website?: string;
	location?: string;
	timezone: string;
	language: string;
	preferences: UserPreferencesResponse;
}

export interface UserPreferencesResponse {
	theme: "light" | "dark" | "system";
	notifications: {
		email: boolean;
		push: boolean;
		sms: boolean;
		marketing: boolean;
	};
	privacy: {
		profileVisibility: "public" | "private" | "friends";
		showEmail: boolean;
		showPhone: boolean;
	};
}

// User API Input types
export interface UpdateUserInput {
	name?: string;
	bio?: string;
	website?: string;
	location?: string;
	timezone?: string;
	language?: string;
}

export interface UpdateUserPreferencesInput {
	theme?: "light" | "dark" | "system";
	notifications?: Partial<UserPreferencesResponse["notifications"]>;
	privacy?: Partial<UserPreferencesResponse["privacy"]>;
}

export interface GetUsersInput extends PaginatedInput, FilterInput {
	role?: string;
	status?: "active" | "inactive" | "suspended";
}

export interface CreateUserInput {
	name: string;
	email: string;
	password: string;
	role?: string;
}

export interface ChangePasswordInput {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}
