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
				<Button href="" onClick={() => createGame()}>
					With friend
				</Button>
			</div>
		</Container>
	);
}
