import { useCallback, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { Board } from "@/components/TicTacToe/Board";

const COMBINATIONS = [
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

// Player vs Player Tic Tac Toe page
const Player: NextPage = () => {
	const [squares, setSquares] = useState<string[]>(
		Array.from({ length: 9 }, () => ""),
	);
	const [isXNext, setIsXNext] = useState<boolean>(!!Math.round(Math.random()));
	const [winner, setWinner] = useState<string>("");
	// const [history, setHistory] = useState<string[][]>([]);
	// const [stepNumber, setStepNumber] = useState<number>(0);

	const calculateWinner = () => {
		for (let i = 0; i < COMBINATIONS.length; i++) {
			const [a, b, c] = COMBINATIONS[i];

			if (!squares[a] || !squares[b] || !squares[c]) {
				continue;
			}

			if (squares[a] === squares[b] && squares[b] === squares[c]) {
				return squares[a];
			}
		}

		if (squares.filter((square) => square === "").length === 0) {
			return "draw";
		}
		return "";
	};

	const handleClick = useCallback(
		(i: number) => {
			console.log(`Square ${i} clicked`);

			if (winner || squares[i]) {
				return;
			}

			const newSquares = [...squares];
			newSquares[i] = isXNext ? "O" : "X";
			setSquares(newSquares);
			setIsXNext(!isXNext);
		},
		[squares, isXNext, winner, calculateWinner],
	);

	useEffect(() => {
		setWinner(calculateWinner);
	}, [squares, calculateWinner]);

	const reset = useCallback(() => {
		setSquares(Array.from({ length: 9 }, () => ""));
		setIsXNext(!!Math.round(Math.random()));
		setWinner("");
	}, [winner]);

	const playAgain = useCallback(() => {
		setSquares(Array.from({ length: 9 }, () => ""));
		setIsXNext(winner === "X" ? false : true);
		setWinner("");
	}, [winner]);

	return (
		<div>
			<h6>hello</h6>
			{winner ? (
				<div>
					<h1>{winner}</h1>
					<button onClick={playAgain}>Play again</button>
				</div>
			) : (
				<div>
					<Board squares={squares} onClick={handleClick} />
					<button onClick={reset}>Reset</button>
				</div>
			)}
			<hr />

			{/* <div className="game-info">
				<div>{isXNext ? "X" : "O"}'s turn</div>
				<ol>
					{history.map((_, step) => (
						<li key={step}>
							<button onClick={() => jumpTo(step)}>
								{step ? "Go to move #" + step : "Go to game start"}
							</button>
						</li>
					))}
				</ol>
			</div> */}
		</div>
	);
};

export default Player;
