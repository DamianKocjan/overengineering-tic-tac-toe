import { SquareState } from "./types";

export const COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[6, 4, 2],
	[0, 4, 8],
	[2, 4, 6],
	[1, 4, 7],
	[2, 5, 8],
] as const;

export function calculateWinner(squares: SquareState[]) {
	for (let i = 0; i < COMBINATIONS.length; i++) {
		const [a, b, c] = COMBINATIONS[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return SquareState.Empty;
}

export * from "./types";
