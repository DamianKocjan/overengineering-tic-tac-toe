import { prisma } from "@/lib/prisma";
import { Game, Move } from "@prisma/client";
import { builder } from "../builder";

builder.prismaObject("Game" as never, {
	findUnique: (game: Game) => ({ id: game.id }),
	fields: (t) => ({
		id: t.exposeID("id"),
		xPlayerId: t.exposeString("xPlayerId"),
		oPlayerId: t.exposeString("oPlayerId"),
		winnerId: t.exposeString("winnerId"),
		loserId: t.exposeString("loserId"),
		isDraw: t.exposeBoolean("isDraw"),
		players: t.relation("players", {}),
		moves: t.relation("moves", {}),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
	}),
});

builder.queryField("game", (t) =>
	t.prismaField({
		type: "Game" as never,
		args: {
			id: t.arg.id({}),
		},
		resolve: ((query: any, _root: any, { id }: any) => {
			return prisma.game.findFirst({
				...query,
				where: {
					id,
				},
				rejectOnNotFound: true,
			});
		}) as any,
	}),
);

builder.mutationField("createGame", (t) =>
	t.prismaField({
		type: "Game" as never,
		resolve: (async (
			query: any,
			_root: any,
			_context: any,
			{ session }: any,
		) => {
			const isX = Math.random() > 0.5;

			return await prisma.game.create({
				...query,
				data: {
					xPlayerId: isX ? session!.userId : "",
					oPlayerId: isX ? "" : session!.userId,
					winnerId: "",
					loserId: "",
					isDraw: false,
					players: {
						connect: {
							id: session!.userId,
						},
					},
				},
			});
		}) as any,
	}),
);

builder.prismaObject("Move" as never, {
	findUnique: (move: Move) => ({ id: move.id }),
	fields: (t) => ({
		id: t.exposeID("id"),
		gameId: t.exposeString("gameId"),
		game: t.relation("game", {}),
		playerId: t.exposeString("playerId"),
		position: t.exposeInt("position"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
	}),
});

builder.queryField("move", (t) =>
	t.prismaField({
		type: "Move" as never,
		args: {
			id: t.arg.id({}),
		},
		resolve: ((query: any, _root: any, { id }: any) => {
			return prisma.move.findFirst({
				...query,
				where: {
					id,
				},
				rejectOnNotFound: true,
			});
		}) as any,
	}),
);
