import { SquareState } from "@/lib/ticTacToe";

interface SquareProps {
	value: SquareState;
	onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({ value, onClick }) => {
	return (
		<button
			className="bg-white dark:bg-gray-700 border border-solid border-gray-400 dark:border-gray-500 p-0 text-center float-left focus:outline-none"
			onClick={() => onClick()}
		>
			{value === SquareState.X ? (
				<svg className="w-full h-full" viewBox="0 0 40 40">
					<path
						style={{ stroke: "#506ded", strokeWidth: "2" }}
						d="M 10,10 L 30,30 M 30,10 L 10,30"
					></path>
				</svg>
			) : value === SquareState.O ? (
				<svg className="w-full h-full" viewBox="0 0 40 40">
					<circle
						cx="20"
						cy="20"
						r="12"
						fill="transparent"
						style={{ stroke: "#ea4335", strokeWidth: "1.7" }}
					></circle>
				</svg>
			) : null}
		</button>
	);
};
