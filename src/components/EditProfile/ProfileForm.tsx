import { gql, useMutation } from "@apollo/client";
import { object, string } from "zod";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Form, useZodForm } from "../ui/Form";
import { Input } from "../ui/Input";
import { Link } from "../ui/Link";
import { SubmitButton } from "../ui/SubmitButton";
import { SuccessMessage } from "../ui/SuccessMessage";
import {
	ProfileFormMutation,
	ProfileFormMutationVariables,
	ProfileForm_User,
} from "./__generated__/ProfileForm.generated";

const editProfileSchema = object({
	username: string().min(1),
});

export const ProfileFormFragment = gql`
	fragment ProfileForm_user on User {
		id
		username
	}
`;

interface Props {
	user: ProfileForm_User;
}

export function ProfileForm({ user }: Props) {
	const [editUser, editUserResult] = useMutation<
		ProfileFormMutation,
		ProfileFormMutationVariables
	>(gql`
		mutation ProfileFormMutation($input: EditUserInput!) {
			editUser(input: $input) {
				id
				username
			}
		}
	`);

	const form = useZodForm({
		schema: editProfileSchema,
		defaultValues: {
			username: user.username,
		},
	});

	return (
		<Form
			form={form}
			onSubmit={({ username }) =>
				editUser({ variables: { input: { username } } })
			}
		>
			<ErrorMessage
				title="Error creating account"
				error={editUserResult.error}
			/>

			{editUserResult.data && (
				<SuccessMessage>Profile successfully updated!</SuccessMessage>
			)}

			<Input
				label="Username"
				type="text"
				autoComplete="username"
				autoFocus
				{...form.register("username")}
			/>

			<SubmitButton>Save Profile</SubmitButton>

			<Link href="/profile/change-password">
				Looking to change your password?
			</Link>
		</Form>
	);
}
