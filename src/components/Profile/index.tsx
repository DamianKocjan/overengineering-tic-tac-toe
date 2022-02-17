import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Container } from "../ui/Container";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Shimmer } from "../ui/Shimmer";
import { ProfileInfo, ProfileInfoFragment } from "./ProfileInfo";
import { ProfileQuery } from "./__generated__/index.generated";

export const query = gql`
	query ProfileQuery($id: ID!) {
		user(id: $id) {
			id
			username
			...ProfileInfo_User
		}
	}
	${ProfileInfoFragment}
`;

export function Profile() {
	const router = useRouter();
	const { data, loading, error } = useQuery<ProfileQuery>(query, {
		variables: {
			id: router.query.id,
		},
		skip: !router.isReady,
	});

	return (
		<Container title="Profile">
			{loading && <Shimmer />}

			{error && (
				<ErrorMessage title="Failed to load your profile" error={error} />
			)}

			{data && <ProfileInfo user={data.user} />}
		</Container>
	);
}
