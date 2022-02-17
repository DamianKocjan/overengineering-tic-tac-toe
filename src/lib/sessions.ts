import { Session, User } from "@prisma/client";
import { addSeconds, differenceInSeconds } from "date-fns";
import { IncomingMessage } from "http";
import { GetServerSidePropsContext } from "next";
import { IronSessionOptions, sealData, unsealData } from "iron-session";

import { prisma } from "./prisma";

/**
 * The duration that the session will be valid for, in seconds (default is 30 days) and
 * we will automatically renew these sessions after 25% of the validity period.
 */
const SESSION_TTL = 30 * 24 * 3600;

// The key that we store the actual database ID of the session in
const IRON_SESSION_ID_KEY = "sessionID";

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
export async function createSession(user: User) {
	const session = await prisma.session.create({
		data: {
			userId: user.id,
			expiresAt: addSeconds(new Date(), SESSION_TTL),
		},
		include: {
			user: true,
		},
	});

	await sealData({ [IRON_SESSION_ID_KEY]: session.id }, sessionOptions);

	return session;
}

/**
 * Remove session
 * @param request - HTTP request
 * @param session - Session in which need to be removed
 */
export async function removeSession(session: Session) {
	await prisma.session.delete({ where: { id: session!.id } });
}

const sessionCache = new WeakMap<IncomingMessage, Session | null>();

export async function resolveSession(
	{ req }: Pick<GetServerSidePropsContext, "req" | "res">,
	checkOnboardStatus: boolean = false,
) {
	if (sessionCache.has(req)) {
		return sessionCache.get(req);
	}

	let session: Session | null = null;
	const sessionID = await unsealData(IRON_SESSION_ID_KEY, sessionOptions);

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
			}
		}
	}

	sessionCache.set(req, session);

	return session;
}
