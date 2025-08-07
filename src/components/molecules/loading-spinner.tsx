import { cn } from "~/lib/utils";
import { Spinner } from "../atoms/spinner";

interface LoadingSpinnerProps {
	text?: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function LoadingSpinner({
	text,
	size = "md",
	className,
}: LoadingSpinnerProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3",
				className,
			)}
		>
			<Spinner size={size} />
			{text && <p className="text-slate-600 text-sm">{text}</p>}
		</div>
	);
}
