import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { ErrorMessage } from "../ui/ErrorMessage";
import { CreateGame } from "./__generated__/PlayIndex.generated";

export function PlayIndex() {
	const router = useRouter();
	const [createGame, createGameResult] = useMutation<CreateGame>(
		gql`
			mutation CreateGame {
				createGame {
					id
				}
			}
		`,
		{
			onCompleted(data) {
				router.push(`/game/play/${data.createGame.id}`);
			},
		},
	);

	return (
		<Container>
			<div className="space-y-6">
				<div className="text-3xl font-bold italic text-center">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
						Play
					</span>
				</div>

				<ErrorMessage
					title="Failed to create new game"
					error={createGameResult.error}
				/>

				<Button href="/game/play/computer">With computer</Button>
				<button
					className="flex items-center justify-center px-4 py-2 w-full rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-offset-1 disabled:opacity-60 disabled:pointer-events-none hover:bg-opacity-80 bg-brand-500 text-white"
					onClick={() => createGame()}
				>
					With friend
				</button>
			</div>
		</Container>
	);
}
