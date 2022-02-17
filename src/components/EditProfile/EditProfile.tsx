import { gql, useQuery } from "@apollo/client";
import { Container } from "../ui/Container";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Shimmer } from "../ui/Shimmer";
import { ProfileForm } from "./ProfileForm";
import { EditProfileQuery } from "./__generated__/EditProfile.generated";

export function EditProfile() {
	const { data, loading, error } = useQuery<EditProfileQuery>(gql`
		query EditProfileQuery {
			me {
				id
				username
			}
		}
	`);

	return (
		<Container title="Edit Profile">
			{loading && <Shimmer />}

			{error && (
				<ErrorMessage title="Failed to load your profile" error={error} />
			)}

			{data && data.me && <ProfileForm user={data.me as any} />}
		</Container>
	);
}
