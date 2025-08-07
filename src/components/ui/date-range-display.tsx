import type { DateRangeDisplayProps } from "~/entities/api/wallet";

export function DateRangeDisplay({
	dateFilter,
	startDate,
	endDate,
	className = "",
}: DateRangeDisplayProps) {
	if (!startDate || !endDate) return null;

	const getDisplayText = () => {
		switch (dateFilter) {
			case "current-day":
				return (
					<span>
						Showing <span className="font-semibold text-blue-700">today's</span>{" "}
						transactions
					</span>
				);
			case "current-week":
				return (
					<span>
						Showing transactions from{" "}
						<span className="font-semibold text-blue-700">
							{startDate.toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
							})}
						</span>{" "}
						to{" "}
						<span className="font-semibold text-blue-700">
							{endDate.toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
							})}
						</span>
					</span>
				);
			case "current-month":
				return (
					<span>
						Showing{" "}
						<span className="font-semibold text-blue-700">this month's</span>{" "}
						transactions
					</span>
				);
			case "last-month":
				return (
					<span>
						Showing{" "}
						<span className="font-semibold text-blue-700">last month's</span>{" "}
						transactions
					</span>
				);
			default:
				return (
					<span>
						Showing transactions from{" "}
						<span className="font-semibold text-blue-700">
							{startDate.toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</span>{" "}
						to{" "}
						<span className="font-semibold text-blue-700">
							{endDate.toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</span>
					</span>
				);
		}
	};

	return (
		<div
			className={`rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-slate-600 text-xs ${className}`}
		>
			{getDisplayText()}
		</div>
	);
}
