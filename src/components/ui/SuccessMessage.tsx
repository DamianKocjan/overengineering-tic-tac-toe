import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export function SuccessMessage({ children }: Props) {
	return (
		<div className="rounded-md bg-green-50 dark:bg-green-900 dark:bg-opacity-10 border-2 border-green-500 border-opacity-50 p-4">
			<div className="text-sm text-green-700 dark:text-green-200">
				{children}
			</div>
		</div>
	);
}
