import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { COMBINATIONS, SquareState } from "./constants";
import { Square } from "./Square";

export function Computer() {
	const [squares, setSquares] = useState<SquareState[]>(
		Array(9).fill(SquareState.Empty),
	);
	const [xIsNext, setXIsNext] = useState(true);
	const [winner, setWinner] = useState<SquareState>(SquareState.Empty);
	const [isTie, setIsTie] = useState(false);
	const [round, setRound] = useState(0);

	const [shouldStart, setShouldStart] = useState(false);

	useEffect(() => {
		const winner = calculateWinner(squares);

		if (winner !== SquareState.Empty) {
			setWinner(winner);
		} else if (squares.every((square) => square !== SquareState.Empty)) {
			setIsTie(true);
		}
	}, [xIsNext]);

	const calculateWinner = (squares: SquareState[]) => {
		for (let i = 0; i < COMBINATIONS.length; i++) {
			const [a, b, c] = COMBINATIONS[i];
			if (
				squares[a] &&
				squares[a] === squares[b] &&
				squares[a] === squares[c]
			) {
				return squares[a];
			}
		}
		return SquareState.Empty;
	};

	const handleClick = (i: number) => {
		if (
			calculateWinner(squares) !== SquareState.Empty ||
			squares[i] !== SquareState.Empty
		) {
			return;
		}

		squares[i] = xIsNext ? SquareState.X : SquareState.O;

		setSquares(squares);
		setXIsNext(!xIsNext);

		computerMove();
	};

	const computerMove = () => {
		const emptySquares = squares.filter(
			(square) => square === SquareState.Empty,
		);
		const randomIndex = Math.floor(Math.random() * emptySquares.length);
		const randomSquare = emptySquares[randomIndex];

		if (randomSquare) {
			squares[randomIndex] = !xIsNext ? SquareState.X : SquareState.O;
			setSquares(squares);
			setXIsNext(!xIsNext);
		}
	};

	const chooseSide = (side?: string) => {
		if (side === "X") {
			setXIsNext(false);
		} else if (side === "O") {
			setXIsNext(true);
		} else {
			setXIsNext(Math.random() >= 0.5);
			setRound(0);
		}

		setShouldStart(true);
		setRound((round) => round + 1);
	};

	const reset = () => {
		setSquares(Array(9).fill(SquareState.Empty));
		setWinner(SquareState.Empty);
		setIsTie(false);
		setShouldStart(false);
	};

	if (!shouldStart) {
		return (
			<Container title="Choose your side">
				<div className="grid grid-cols-3 gap-2 text-center">
					<Button onClick={() => chooseSide("X")}>O</Button>
					<Button onClick={() => chooseSide("O")}>X</Button>
					<Button onClick={() => chooseSide()}>Random</Button>
				</div>
			</Container>
		);
	}

	if (winner !== SquareState.Empty) {
		return (
			<Container>
				<div className="text-3xl font-bold italic text-center">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
						Winner: {winner}
					</span>
				</div>
				<Button onClick={() => reset()}>Play again</Button>
			</Container>
		);
	}

	if (isTie) {
		return (
			<Container>
				<div className="text-3xl font-bold italic text-center">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
						Tie
					</span>
				</div>
				<Button onClick={() => reset()}>Play again</Button>
			</Container>
		);
	}

	return (
		<Container title={`Round: ${round}`}>
			<div className="grid grid-rows-3 grid-cols-3 h-72 w-72 mx-auto border-2 border-solid border-gray-400">
				{squares.map((square, i) => (
					<Square value={square} onClick={() => handleClick(i)} key={i} />
				))}
			</div>
		</Container>
	);
}
