"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface UserDropdownProps {
	name: string;
	email: string;
	image?: string | null;
}

export function UserDropdown({ name, email, image }: UserDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
			>
				{image ? (
					<Image
						src={image}
						alt={name}
						width={24}
						height={24}
						className="rounded-full"
					/>
				) : (
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs">
						{name.charAt(0).toUpperCase()}
					</div>
				)}
				<span className="text-sm">{name}</span>
				<ChevronDown
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-sm">
					<div className="p-2">
						<div className="mb-2 px-3 py-2">
							<p className="font-medium text-slate-900 text-xs">{name}</p>
							<p className="text-slate-500 text-xs">{email}</p>
						</div>
						<div className="h-px bg-slate-200" />
						<button
							type="button"
							onClick={() => signOut({ callbackUrl: "/" })}
							className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-slate-600 text-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
						>
							<LogOut className="h-4 w-4" />
							Sign out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
