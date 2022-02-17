import crypto from "crypto";
import { bcrypt, bcryptVerify } from "hash-wasm";
import { ValidationError } from "@/graphql/errors";
import { prisma } from "./prisma";

/**
 * This is the cost factor of the bcrypt hash function. In general, this number
 * should be changed as CPUs get faster.
 */
const COST_FACTOR = 11;

/**
 * Hash a given raw text password
 * @param password - Raw text password
 * @returns a new hashed password
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.randomBytes(16);

	const key = await bcrypt({
		password,
		salt,
		costFactor: COST_FACTOR,
		outputType: "encoded",
	});

	return key;
}

/**
 * Verifies the given hashed password is correct
 * @param hashedPassword - Hashed password
 * @param password - Raw text password
 * @returns the password is correct or not
 */
export function verifyPassword(
	hashedPassword: string,
	password: string,
): Promise<boolean> {
	return bcryptVerify({
		password,
		hash: hashedPassword,
	});
}

/**
 * Authenticate the user by email and password
 * @param email - User's email
 * @param password - User's password
 * @returns the authenticated user
 */
export async function authenticateUser(email: string, password: string) {
	const user = await prisma.user.findFirst({
		where: {
			email: {
				equals: email,
			},
		},
	});

	if (!user || !user.hashedPassword) {
		throw new ValidationError("Email not found", {
			email: "Email not found.",
		});
	}

	if (!(await verifyPassword(user.hashedPassword, password))) {
		throw new ValidationError("Invalid password.", {
			password: "Password is incorrect.",
		});
	}

	const costFactorString = user.hashedPassword.split("$")[2];

	if (!costFactorString) {
		throw new Error("Unknown password format.");
	}

	const costFactor = Number.parseInt(costFactorString, 10);
	if (costFactor !== COST_FACTOR) {
		const improvedHash = await hashPassword(password);
		await prisma.user.update({
			where: { id: user.id },
			data: { hashedPassword: improvedHash },
		});
	}

	return user;
}
