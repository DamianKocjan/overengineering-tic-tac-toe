import { prisma } from "@/lib/prisma";
import { authenticateUser, hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, removeSession } from "@/lib/sessions";
import { builder } from "../builder";
import { Result } from "./ResultResolver";

builder.queryField("me", (t) =>
	t.prismaField({
		type: "User" as never,
		nullable: true,
		skipTypeScopes: true,
		resolve: (async (query: any, _root: any, _args: any, { session }: any) => {
			if (!session?.userId) {
				return null;
			}

			return await prisma.user.findUnique({
				...query,
				where: { id: session.userId },
				rejectOnNotFound: true,
			});
		}) as any,
	}),
);

builder.mutationField("logout", (t) =>
	t.field({
		type: Result,
		resolve: async (_root, _args, { session }) => {
			await removeSession(session!);
			return Result.SUCCESS;
		},
	}),
);

const LoginInput = builder.inputType("LoginInput", {
	fields: (t) => ({
		email: t.string({
			validate: {
				email: true,
			},
		}),
		password: t.string({
			validate: {
				minLength: 6,
			},
		}),
	}),
});

builder.mutationField("login", (t) =>
	t.prismaField({
		type: "User" as never,
		// The parent auth scope (for the Mutation type) is for authenticated users,
		// so we will need to skip it.
		skipTypeScopes: true,
		authScopes: {
			unauthenticated: true,
		},
		args: {
			input: t.arg({ type: LoginInput }),
		},
		resolve: (async (_query: any, _root: any, { input }: any, { req }: any) => {
			const user = await authenticateUser(input.email, input.password);
			await createSession(user);
			return user;
		}) as any,
	}),
);

const SignUpInput = builder.inputType("SignUpInput", {
	fields: (t) => ({
		username: t.string({
			validate: {
				minLength: 1,
				maxLength: 100,
			},
		}),
		email: t.string({
			validate: {
				email: true,
			},
		}),
		password: t.string({
			validate: {
				minLength: 6,
			},
		}),
	}),
});

builder.mutationField("signUp", (t) =>
	t.prismaField({
		type: "User" as never,
		// The parent auth scope (for the Mutation type) is for authenticated users,
		// so we will need to skip it.
		skipTypeScopes: true,
		authScopes: {
			unauthenticated: true,
		},
		args: {
			input: t.arg({ type: SignUpInput }),
		},
		resolve: (async (query: any, _root: any, { input }: any) => {
			const user = await prisma.user.create({
				...query,
				data: {
					username: input.username,
					email: input.email,
					hashedPassword: await hashPassword(input.password),
				},
			});

			await createSession(user);

			return user;
		}) as any,
	}),
);

const ChangePasswordInput = builder.inputType("ChangePasswordInput", {
	fields: (t) => ({
		currentPassword: t.string({
			validate: { minLength: 6 },
		}),
		newPassword: t.string({
			validate: { minLength: 6 },
		}),
	}),
});

builder.mutationField("changePassword", (t) =>
	t.field({
		type: Result,
		args: {
			input: t.arg({ type: ChangePasswordInput }),
		},
		resolve: async (_root, { input }, { session }) => {
			const user = await prisma.user.findUnique({
				where: { id: session!.userId },
			});

			// First, we make sure that your current password is correct:
			const passwordValid = await verifyPassword(
				user!.hashedPassword,
				input.currentPassword,
			);

			if (!passwordValid) {
				throw new Error("Current password was not correct.");
			}

			await prisma.user.update({
				where: { id: user!.id },
				data: {
					hashedPassword: await hashPassword(input.newPassword),
					// When changing the password, we also delete any sessions that
					// are not our current active session.
					session: {
						deleteMany: {
							id: {
								not: session!.id,
							},
						},
					},
				},
			});

			return Result.SUCCESS;
		},
	}),
);
