import { gql, useQuery } from "@apollo/client";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Shimmer } from "../ui/Shimmer";
import { SignedOut } from "./SignedOut";
import { UserInfo, UserInfoFragment } from "./UserInfo";
import { HomeQuery } from "./__generated__/index.generated";

export const query = gql`
	query HomeQuery {
		me {
			id
			username
			...UserInfo_User
		}
	}
	${UserInfoFragment}
`;

export function Home() {
	const { data, loading, error } = useQuery<HomeQuery>(query);

	return (
		<Container>
			<div className="space-y-6">
				<div className="text-3xl font-bold italic text-center">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
						Tic Tac Toe
					</span>
				</div>

				{loading && <Shimmer />}

				<ErrorMessage title="Failed to load the current user." error={error} />

				{data &&
					(data.me ? (
						<UserInfo user={data?.me as any} />
					) : (
						<>
							<Button href="/ranking">Ranking</Button>
							<SignedOut />
						</>
					))}
			</div>
		</Container>
	);
}
