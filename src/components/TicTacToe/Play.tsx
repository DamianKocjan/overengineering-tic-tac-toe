import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import {
	GameState,
	GameStateEmit,
	JoinData,
	PlayEmit,
	SquareState,
} from "@/lib/ticTacToe";
import { Container } from "../ui/Container";
import { Square } from "./Square";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { PlayQuery } from "./__generated__/Play.generated";

export const query = gql`
	query PlayQuery($gameId: ID!) {
		me {
			id
		}
		game(id: $gameId) {
			id
			xPlayerId
			oPlayerId
			winnerId
			loserId
			isDraw
			players {
				id
				username
			}
			moves {
				position
				playerId
			}
		}
	}
`;

export function Play() {
	const router = useRouter();
	const id = router.query.id as string;

	const { data } = useQuery<PlayQuery>(query, {
		variables: {
			gameId: id,
		},
		skip: !router.isReady,
	});

	const prevSquares = useRef<SquareState[]>(Array(9).fill(SquareState.Empty));
	const [squares, setSquares] = useState<SquareState[]>(
		Array(9).fill(SquareState.Empty),
	);
	const [whoAmI, setWhoAmI] = useState<SquareState>(SquareState.Empty); // X or O (i know it should be different type)
	const [isMyTurn, setIsMyTurn] = useState(false);
	const [gameState, setGameState] = useState<GameState>(GameState.Waiting);

	const socket = useRef<Socket>();

	useEffect(() => {
		if (!data) return;

		data.game.moves.map((move) => {
			prevSquares.current[move.position] =
				move.playerId === data.game.xPlayerId ? SquareState.X : SquareState.O;
		});
		setSquares(prevSquares.current);

		fetch("/api/socketio").finally(() => {
			socket.current = io();

			socket.current.on("debug", (...args) => {
				console.log("DEBUG:", ...args);
			});

			socket.current.on("error", (error) => {
				console.log("ERROR:", error);

				if (
					error === "Game not found" ||
					error === "Game is full" ||
					error === "Player not found"
				) {
					router.push("/game/play");
				} else if (error === "Game is over") {
					router.push(`/game/${id}`);
				} else if (error === "Not your turn") {
					setSquares(prevSquares.current);
				} else if (error === "Invalid move") {
					setSquares(prevSquares.current);
				}
			});

			socket.current.on("joined", (playerId: string) => {
				console.log("JOINED:", playerId);

				if (playerId === data?.me?.id) {
					return;
				}

				setGameState(GameState.InProgress);
			});

			socket.current.on(
				"game-state",
				({
					gameId,
					gameState,
					oPlayerId,
					squares,
					whoseTurn,
					xPlayerId,
				}: GameStateEmit) => {
					if (gameId !== id) return;
					console.log(
						"GAME-STATE:",
						gameState,
						oPlayerId,
						squares,
						whoseTurn,
						xPlayerId,
					);

					setSquares(squares as any);
					setGameState(gameState);
					setIsMyTurn(whoseTurn === whoAmI);
				},
			);

			socket.current.emit("join", {
				gameId: id,
				playerId: data?.me?.id,
			} as JoinData);
		});
	}, [data]);

	useEffect(() => {
		if (!data) return;

		if (data.game.players.length === 2) {
			setGameState(GameState.InProgress);
		}

		setWhoAmI(
			data.game.xPlayerId === data.me!.id ? SquareState.X : SquareState.O,
		);
	}, [data]);

	const handleClick = useCallback(
		(i: number, symbol: SquareState, fromSocket: boolean) => {
			if (!isMyTurn) return;

			console.log("CLICK:", i, symbol, fromSocket);

			prevSquares.current = squares;

			squares[i] = symbol;

			setSquares(squares);

			console.log(squares);

			if (!fromSocket && socket.current) {
				socket.current.emit("play", {
					gameId: id,
					isX: whoAmI === SquareState.X,
					playerId: data?.me?.id,
					square: i,
				} as PlayEmit);
			}
		},
		[squares, isMyTurn, id, data],
	);

	if (gameState === GameState.Waiting) {
		return (
			<Container>
				<h1>Waiting for opponent...</h1>
			</Container>
		);
	}

	if (gameState === GameState.X || gameState === GameState.O) {
		return (
			<Container>
				<h1>Winner: {gameState}</h1>
			</Container>
		);
	}

	if (gameState === GameState.Draw) {
		return (
			<Container>
				<h1>Tie</h1>
			</Container>
		);
	}

	return (
		<Container
			title={data?.game.players.map((p) => p.username).join(" vs ") || "Play"}
		>
			<div className="grid grid-rows-3 grid-cols-3 h-72 w-72 mx-auto border-2 border-solid border-gray-400 dark:border-gray-500">
				{squares.map((square, i) => (
					<Square
						value={square}
						onClick={() => handleClick(i, whoAmI, false)}
						key={i}
					/>
				))}
			</div>
			{data?.me?.id}
		</Container>
	);
}
