export const formatCurrency = (amount: string) => {
	const num = Number.parseFloat(amount);

	// Handle negative numbers properly
	const isNegative = num < 0;
	const absNum = Math.abs(num);

	const formatted = new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(absNum);

	// Return with proper negative sign
	return isNegative ? `-${formatted}` : formatted;
};

export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("id-ID", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
};
