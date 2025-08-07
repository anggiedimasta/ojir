import DayClient from "./_components/day-client";

export default async function DayPage({
	params,
}: { params: Promise<{ date: string }> }) {
	const { date } = await params;
	return <DayClient date={date} />;
}
