import type { NextApiRequest } from "next";
import { Server } from "socket.io";
import { prisma } from "@/lib/prisma";
import {
	calculateWinner,
	GameState,
	GameStateEmit,
	JoinData,
	NextApiResponseWithIO,
	PlayData,
	PlayEmit,
	SquareState,
} from "@/lib/ticTacToe";
import { Game } from "@prisma/client";

async function getGame(gameId: string, playerId: string) {
	const game = await prisma.game.findFirst({
		where: { id: gameId },
		include: {
			players: {
				select: { id: true },
			},
			moves: {
				select: {
					playerId: true,
					position: true,
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	if (!game) {
		throw new Error("Game not found");
	}

	const players = game.players.filter((p) => p.id !== playerId);
	if (!players.indexOf({ id: playerId }) && players.length === 2) {
		throw new Error("Game is full");
	}

	return game;
}

const ioHandler = (_req: NextApiRequest, res: NextApiResponseWithIO) => {
	if (!res.socket.server.io) {
		const io = new Server(res.socket.server);

		io.on("connection", async (socket) => {
			socket.on("join", async ({ gameId, playerId }: JoinData) => {
				socket.join(gameId);

				let game: any;
				try {
					game = await getGame(gameId, playerId);
				} catch (error) {
					socket.emit("error", (error as Error)?.message || error);
					return;
				}

				if (!game.xPlayerId) {
					const random = Math.random() < 0.5;

					if (random) {
						await prisma.game.update({
							where: { id: gameId },
							data: {
								xPlayerId: playerId,
								players: {
									connect: [
										...game.players,
										{
											id: playerId,
										},
									],
								},
							},
						});
					} else {
						await prisma.game.update({
							where: { id: gameId },
							data: {
								oPlayerId: playerId,
								players: {
									connect: [
										...game.players,
										{
											id: playerId,
										},
									],
								},
							},
						});
					}
				} else {
					await prisma.game.update({
						where: { id: gameId },
						data: {
							oPlayerId: playerId,
							players: {
								connect: [
									...game.players,
									{
										id: playerId,
									},
								],
							},
						},
					});
				}

				const lastestMove = game.moves[game.moves.length - 1];

				const squares = Array(9).fill(
					SquareState.Empty,
				) as unknown as SquareState[];
				game.moves.map((move: any) => {
					squares[move.position] =
						move.playerId === game.xPlayerId ? SquareState.X : SquareState.O;
				});

				const data: GameStateEmit = {
					gameId,
					gameState:
						game.players.length === 2
							? GameState.InProgress
							: GameState.Waiting,
					whoseTurn:
						lastestMove.playerId === game.xPlayerId
							? SquareState.X
							: SquareState.O,
					squares: squares as any,
					xPlayerId: game.xPlayerId,
					oPlayerId: game.oPlayerId,
				};
				socket.in(gameId).emit("game-state", data);
				socket.emit("game-state", data);
			});

			socket.on("play", async ({ gameId, playerId, square }: PlayData) => {
				let game: any;
				try {
					game = await getGame(gameId, playerId);
				} catch (error) {
					socket.emit("error", (error as Error)?.message || error);
					return;
				}

				if (!game.players.indexOf({ id: playerId })) {
					socket.emit("error", "Player not found");
					return;
				}

				const lastMove = await prisma.move.findFirst({
					where: { game: { id: gameId } },
					orderBy: {
						createdAt: "desc",
					},
				});

				if (lastMove && lastMove.playerId === playerId) {
					socket.emit("error", "Not your turn");
					return;
				}

				const moves = await prisma.move.findMany({
					where: { game: { id: gameId } },
				});
				const takenPositions = moves.map((m) => m.position);

				if (takenPositions.includes(square)) {
					socket.emit("error", "Invalid move");
					return;
				}

				await prisma.move.create({
					data: {
						gameId,
						playerId,
						position: square,
					},
				});

				const squares = Array(9).fill(SquareState.Empty);
				prisma.move
					.findMany({
						where: { game: { id: gameId } },
					})
					.then((moves) => {
						moves.map((move) => {
							squares[move.position] =
								move.playerId === game.xPlayerId
									? SquareState.X
									: SquareState.O;
						});
					});

				const winner = calculateWinner(squares);
				const data: GameStateEmit = {
					gameId,
					gameState:
						winner === SquareState.X
							? GameState.X
							: winner === SquareState.O
							? GameState.O
							: GameState.Draw,
					whoseTurn:
						lastMove?.playerId === game.xPlayerId
							? SquareState.O
							: SquareState.X,
					squares: squares as any,
					xPlayerId: game.xPlayerId,
					oPlayerId: game.oPlayerId,
				};
				if (winner !== SquareState.Empty) {
					socket.in(gameId).emit("game-state", data);
					socket.emit("game-state", data);
				}
			});
		});

		res.socket.server.io = io;
	}
	res.end();
};

export const config = {
	api: {
		bodyParser: false,
	},
};

export default ioHandler;
