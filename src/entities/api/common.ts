// Common API response and error types used across all modules

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: ApiError;
	meta?: Record<string, any>;
}

export interface ApiError {
	message: string;
	code: string;
	field?: string;
	details?: Record<string, unknown>;
}

// tRPC specific error response structure
export interface TRPCErrorResponse {
	message: string;
	code: string;
	data?: {
		code: string;
		httpStatus: number;
		stack?: string;
		path: string;
	};
}

// Common input types for pagination and filtering
export interface PaginatedInput {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface FilterInput {
	search?: string;
	status?: string;
	createdAfter?: Date;
	createdBefore?: Date;
	tags?: string[];
}

// Date range input commonly used across modules
export interface DateRangeInput {
	startDate: Date;
	endDate: Date;
}
