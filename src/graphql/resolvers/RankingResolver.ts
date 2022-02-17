import { prisma } from "@/lib/prisma";
import { builder } from "../builder";

builder.queryField("ranking", (t) =>
	t.prismaField({
		type: ["User"] as any,
		nullable: true,
		skipTypeScopes: true,
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
		resolve: ((query: any, _root: any, { offset, limit }: any) => {
			return prisma.user.findMany({
				...query,
				skip: offset,
				take: limit,
				orderBy: {
					numberOfGames: "desc",
				},

				rejectOnNotFound: true,
			});
		}) as any,
	}),
);
export const hello = "";
