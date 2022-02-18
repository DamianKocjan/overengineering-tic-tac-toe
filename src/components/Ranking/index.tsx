import { gql, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Link } from "../ui/Link";
import { Shimmer } from "../ui/Shimmer";
import { RankingQuery } from "./__generated__/index.generated";

export const query = gql`
	query RankingQuery($offset: Int, $limit: Int) {
		ranking(offset: $offset, limit: $limit) {
			id
			username
			numberOfGames
			wins
			loses
			draws
		}
	}
`;

export function Ranking() {
	const { data, loading, error, fetchMore } = useQuery<RankingQuery>(query);
	const [loadMoreVisible, setLoadMoreVisibility] = useState(true);

	const loadMore = useCallback(async () => {
		const { data: moreData } = await fetchMore({
			variables: {
				offset: data?.ranking?.length || 0,
			},
		});

		if ((moreData?.ranking?.length || 0) < 10) {
			setLoadMoreVisibility(false);
		}
	}, [data, fetchMore]);

	return (
		<Container>
			<div className="space-y-6">
				<div className="text-3xl font-bold italic text-center">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
						Tic Tac Toe Ranking
					</span>
				</div>

				{loading && <Shimmer />}

				<ErrorMessage title="Failed to load the ranking." error={error} />

				{data?.ranking && data.ranking.length > 0 && (
					<div className="grid grid-cols-1 gap-4">
						{data.ranking.map((user, i) => (
							<div
								key={user.id}
								className="flex flex-col space-y-2 items-center"
							>
								<div className="text-2xl font-bold">
									<span className="text-3xl text-brand-500">{i + 1}.</span>{" "}
									<Link href={`/profile/${user.id}`}>{user.username}</Link>
								</div>
								<div className="flex flex-row space-x-2">
									<div className="flex flex-col items-center">
										<div className="text-2xl font-bold">
											{user.numberOfGames}
										</div>
										<div className="text-xs font-bold">Games</div>
									</div>
									<div className="flex flex-col items-center">
										<div className="text-2xl font-bold">{user.wins}</div>
										<div className="text-xs font-bold">Wins</div>
									</div>
									<div className="flex flex-col items-center">
										<div className="text-2xl font-bold">{user.loses}</div>
										<div className="text-xs font-bold">Loses</div>
									</div>
									<div className="flex flex-col items-center">
										<div className="text-2xl font-bold">{user.draws}</div>
										<div className="text-xs font-bold">Draws</div>
									</div>
								</div>
							</div>
						))}
						{loadMoreVisible ? (
							<Button onClick={loadMore}>Load more</Button>
						) : null}
					</div>
				)}
			</div>
		</Container>
	);
}
