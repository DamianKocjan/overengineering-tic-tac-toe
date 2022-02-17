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

export enum SquareState {
	Empty = "empty",
	X = "x",
	O = "o",
}
