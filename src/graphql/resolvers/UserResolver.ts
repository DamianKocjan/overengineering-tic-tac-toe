import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { builder } from "../builder";

builder.prismaObject("User" as never, {
	findUnique: (user: User) => ({ id: user.id }),
	fields: (t) => ({
		id: t.exposeID("id", {}),
		username: t.exposeString("username", {}),
		numberOfGames: t.exposeInt("numberOfGames", {}),
		wins: t.exposeInt("wins", {}),
		loses: t.exposeInt("loses", {}),
		draws: t.exposeInt("draws", {}),
		games: t.relation("games", {
			args: {
				offset: t.arg.int({
					defaultValue: 0,
					validate: { min: 0 },
				}),
				limit: t.arg.int({
					defaultValue: 10,
					validate: { min: 1, max: 20 },
				}),
			},
			query: (({ limit, offset }: any) => ({
				take: limit,
				skip: offset,
				orderBy: {
					updatedAt: "desc",
				},
			})) as any,
		}),
	}),
});

builder.queryField("user", (t) =>
	t.prismaField({
		type: "User" as never,
		args: {
			id: t.arg.id({}),
		},
		resolve: ((query: any, _root: any, { id }: any) => {
			return prisma.user.findFirst({
				...query,
				where: {
					id,
				},
				rejectOnNotFound: true,
			});
		}) as any,
	}),
);

const EditUserInput = builder.inputType("EditUserInput", {
	fields: (t) => ({
		username: t.string({
			required: false,
			validate: {
				minLength: 1,
				maxLength: 100,
			},
		}),
	}),
});

builder.mutationField("editUser", (t) =>
	t.prismaField({
		type: "User" as never,
		args: {
			input: t.arg({ type: EditUserInput }),
		},
		resolve: async (query, _root, { input }, { session }) => {
			return (await prisma.user.update({
				...query,
				where: {
					id: session!.userId,
				},
				data: {
					// NOTE: Because `username` may be `null`, we use `?? undefined` to ensure that
					// it is either a value, or undefined.
					// https://www.prisma.io/docs/concepts/components/prisma-client/null-and-undefined
					username: input.username ?? undefined,
				},
			})) as any;
		},
	}),
);
