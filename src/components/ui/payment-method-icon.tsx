import { Banknote, CreditCard, QrCode, Zap } from "lucide-react";
import type React from "react";

interface PaymentMethodIconProps {
	methodName: string;
	className?: string;
}

export const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({
	methodName,
	className = "w-4 h-4",
}) => {
	const getPaymentMethodIcon = (method: string) => {
		const normalizedMethod = method.toLowerCase();

		// QRIS
		if (normalizedMethod.includes("qris")) {
			return <QrCode className={className} />;
		}

		// Bank Transfer
		if (
			normalizedMethod.includes("transfer") ||
			normalizedMethod.includes("bank")
		) {
			return <Banknote className={className} />;
		}

		// Virtual Account
		if (
			normalizedMethod.includes("virtual") ||
			normalizedMethod.includes("account")
		) {
			return <CreditCard className={className} />;
		}

		// BI-FAST
		if (
			normalizedMethod.includes("bi-fast") ||
			normalizedMethod.includes("bifast")
		) {
			return <Zap className={className} />;
		}

		// Default fallback
		return <CreditCard className={className} />;
	};

	return getPaymentMethodIcon(methodName);
};
