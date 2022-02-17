import { gql, useMutation } from "@apollo/client";
import { object, string } from "zod";
import { Container } from "../ui/Container";
import { Input } from "../ui/Input";
import { SubmitButton } from "../ui/SubmitButton";
import { Form, useZodForm } from "../ui/Form";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Link } from "../ui/Link";
import { useAuthRedirect } from "../utils/useAuthRedirect";
import {
	LoginFormMutation,
	LoginFormMutationVariables,
} from "./__generated__/LoginForm.generated";

const loginSchema = object({
	email: string().email(),
	password: string().min(6),
});

export function LoginForm() {
	const authRedirect = useAuthRedirect();
	const [login, loginResult] = useMutation<
		LoginFormMutation,
		LoginFormMutationVariables
	>(
		gql`
			mutation LoginFormMutation($input: LoginInput!) {
				login(input: $input) {
					id
				}
			}
		`,
		{
			onCompleted() {
				authRedirect();
			},
		},
	);

	const form = useZodForm({
		schema: loginSchema,
	});

	return (
		<Container title="Login">
			<div className="mb-4">
				<Link href="/auth/signup" preserveRedirect>
					Don&rsquo;t have an account? Sign up.
				</Link>
			</div>

			<Form
				form={form}
				onSubmit={({ email, password }) =>
					login({ variables: { input: { email, password } } })
				}
			>
				<ErrorMessage title="Login failed." error={loginResult.error} />

				<Input
					label="Email"
					type="email"
					autoComplete="email"
					autoFocus
					{...form.register("email")}
				/>
				<Input
					label="Password"
					type="password"
					autoComplete="current-password"
					{...form.register("password")}
				/>
				<SubmitButton>Login</SubmitButton>
			</Form>
		</Container>
	);
}
