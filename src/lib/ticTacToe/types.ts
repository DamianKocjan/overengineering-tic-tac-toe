import { Server, ServerOptions } from "socket.io";

// bit hacky, but it works
export interface NextApiResponseWithIO {
	socket: {
		server: {
			io: Server;
		} & ServerOptions;
	};
	end: () => void;
}

export enum SquareState {
	Empty = "empty",
	X = "x",
	O = "o",
}

export enum GameState {
	Waiting = "waiting",
	InProgress = "in-progress",
	X = "x",
	O = "o",
	Draw = "draw",
}

export interface JoinData {
	gameId: string;
	playerId: string;
}

export interface GameStateEmit {
	gameId: string;
	gameState: GameState;
	whoseTurn: SquareState;
	squares: SquareState[9];
	xPlayerId: string;
	oPlayerId: string;
}

export interface PlayData {
	gameId: string;
	playerId: string;
	square: number;
	isX: boolean;
}

export interface PlayEmit {
	gameId: string;
	playerId: string;
	square: number;
	isX: boolean;
}
