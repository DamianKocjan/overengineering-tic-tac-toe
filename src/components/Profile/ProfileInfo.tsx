import { gql } from "@apollo/client";
import { useMemo } from "react";
import { ProfileInfo_User } from "./__generated__/ProfileInfo.generated";

export const ProfileInfoFragment = gql`
	fragment ProfileInfo_User on User {
		id
		username
		numberOfGames
		wins
		loses
		draws
	}
`;

interface Props {
	user: ProfileInfo_User;
}

export function ProfileInfo({ user }: Props) {
	const winRate = useMemo(
		() => (user.wins + user.loses + user.draws) / user.numberOfGames,
		[user],
	);

	return (
		<>
			<h3 className="text-center font-bold text-xl uppercase">
				{user.username}
			</h3>

			<hr className="w-72 h-1 bg-brand-500 rounded mt-2 mb-4 mx-auto" />

			{winRate ? (
				<div className="grid grid-cols-2 gap-2 text-center">
					<div>
						<h4 className="font-bold text-xl">Stats</h4>
						<p>Number of games: {user.numberOfGames}</p>
						<p>Wins: {user.wins}</p>
						<p>Loses: {user.loses}</p>
						<p>Draws: {user.draws}</p>
					</div>
					<div>
						<h4 className="font-bold text-xl">Overall</h4>
						<p>
							Win rate:{" "}
							{(user.wins + user.loses + user.draws) / user.numberOfGames}%
						</p>
					</div>
				</div>
			) : (
				<div className="text-center">
					<h4 className="font-bold text-xl">Stats</h4>
					<p>Number of games: {user.numberOfGames}</p>
					<p>Wins: {user.wins}</p>
					<p>Loses: {user.loses}</p>
					<p>Draws: {user.draws}</p>
				</div>
			)}
		</>
	);
}
