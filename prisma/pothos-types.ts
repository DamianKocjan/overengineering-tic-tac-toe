import type { Prisma, User, Session, Game, Move } from "@prisma/client";
export default interface PrismaTypes {
	User: {
		Name: "User";
		Shape: User;
		Include: Prisma.UserInclude;
		Where: Prisma.UserWhereUniqueInput;
		Fields: "session" | "games" | "Move";
		ListRelations: "session" | "games" | "Move";
		Relations: {
			session: {
				Shape: Session[];
				Types: PrismaTypes["Session"];
			};
			games: {
				Shape: Game[];
				Types: PrismaTypes["Game"];
			};
			Move: {
				Shape: Move[];
				Types: PrismaTypes["Move"];
			};
		};
	};
	Session: {
		Name: "Session";
		Shape: Session;
		Include: Prisma.SessionInclude;
		Where: Prisma.SessionWhereUniqueInput;
		Fields: "user";
		ListRelations: never;
		Relations: {
			user: {
				Shape: User;
				Types: PrismaTypes["User"];
			};
		};
	};
	Game: {
		Name: "Game";
		Shape: Game;
		Include: Prisma.GameInclude;
		Where: Prisma.GameWhereUniqueInput;
		Fields: "players" | "moves";
		ListRelations: "players" | "moves";
		Relations: {
			players: {
				Shape: User[];
				Types: PrismaTypes["User"];
			};
			moves: {
				Shape: Move[];
				Types: PrismaTypes["Move"];
			};
		};
	};
	Move: {
		Name: "Move";
		Shape: Move;
		Include: Prisma.MoveInclude;
		Where: Prisma.MoveWhereUniqueInput;
		Fields: "game" | "player";
		ListRelations: never;
		Relations: {
			game: {
				Shape: Game;
				Types: PrismaTypes["Game"];
			};
			player: {
				Shape: User;
				Types: PrismaTypes["User"];
			};
		};
	};
}
