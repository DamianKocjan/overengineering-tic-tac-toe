import { Session, User } from "@prisma/client";
import { addSeconds, differenceInSeconds } from "date-fns";
import { IncomingMessage } from "http";
import { GetServerSidePropsContext } from "next";
import { IronSessionOptions, IronSession, getIronSession } from "iron-session";

import { prisma } from "./prisma";

/**
 * The duration that the session will be valid for, in seconds (default is 30 days) and
 * we will automatically renew these sessions after 25% of the validity period.
 */
const SESSION_TTL = 30 * 24 * 3600;

// The key that we store the actual database ID of the session in
const IRON_SESSION_ID_KEY = "sessionID";

// Use a custom IncomingMessage type
interface RequestWithSession extends IncomingMessage {
	session: IronSession; // just for now
}

if (!process.env.COOKIE_SECRET) {
	console.warn(
		"No `COOKIE_SECRET` environment variable was set. This can cause production errors.",
	);
}

export const sessionOptions: IronSessionOptions = {
	password: {
		1: process.env.COOKIE_SECRET as string,
	},
	cookieName: "next.cookie.v1",
	ttl: SESSION_TTL,
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		httpOnly: true,
	},
};

/**
 * Create session for the given user
 * @param request - HTTP request
 * @param user - Session to be created for the given user
 * @returns session of the given user
 */
export async function createSession(request: IncomingMessage, user: User) {
	const session = await prisma.session.create({
		data: {
			userId: user.id,
			expiresAt: addSeconds(new Date(), SESSION_TTL),
		},
		include: {
			user: true,
		},
	});

	const requestWithSession = request as unknown as RequestWithSession;
	(requestWithSession as any).session = { [IRON_SESSION_ID_KEY]: session.id };
	await requestWithSession.session.save();

	return session;
}

/**
 * Remove session
 * @param request - HTTP request
 * @param session - Session in which need to be removed
 */
export async function removeSession(
	request: IncomingMessage,
	session: Session,
) {
	const requestWithSession = request as unknown as RequestWithSession;
	requestWithSession.session.destroy();

	await prisma.session.delete({ where: { id: session!.id } });
}

const sessionCache = new WeakMap<IncomingMessage, Session | null>();

export async function resolveSession(
	{ req, res }: Pick<GetServerSidePropsContext, "req" | "res">,
	checkOnboardStatus: boolean = false,
) {
	if (sessionCache.has(req)) {
		return sessionCache.get(req);
	}

	let session: Session | any = null;
	const requestWithSession = req as unknown as RequestWithSession;
	const ironSession = await getIronSession(req, res, sessionOptions);
	const sessionID = ironSession?.[IRON_SESSION_ID_KEY];

	if (sessionID) {
		session = await prisma.session.findFirst({
			where: {
				id: sessionID,
				expiresAt: { gte: new Date() },
			},
			include: checkOnboardStatus ? { user: { select: {} } } : null,
		});

		if (session) {
			// If we resolve a session in the request, we'll automatically renew it 25% of the session has elapsed
			const shouldRefreshSession =
				differenceInSeconds(session.expiresAt, new Date()) < 0.75 * SESSION_TTL;

			if (shouldRefreshSession) {
				await prisma.session.update({
					where: { id: session.id },
					data: { expiresAt: addSeconds(new Date(), SESSION_TTL) },
				});

				await requestWithSession.session.save();
			}
		}
	}

	sessionCache.set(req, session);

	return session;
}
