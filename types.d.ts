import type { IronSession } from "iron-session";
import type { Session } from "@prisma/client";

declare module "next" {
	interface NextApiRequest {
		session: IronSession;
	}
}

declare module "iron-session" {
	interface IronSessionData {
		sessionID: string;
	}
}
