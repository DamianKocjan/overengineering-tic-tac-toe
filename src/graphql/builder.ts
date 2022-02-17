import SchemaBuilder, { initContextCache } from "@pothos/core";
import DataLoaderPlugin from "@pothos/plugin-dataloader";
import ErrorsPlugin from "@pothos/plugin-errors";
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ValidationPlugin from "@pothos/plugin-validation";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma";
import { Session } from "@prisma/client";
import { IncomingMessage, OutgoingMessage } from "http";
import { prisma } from "@/lib/prisma";

export interface Context {
	req: IncomingMessage;
	res: OutgoingMessage;
	session?: Session | null;
}

export function createGraphQLContext(
	req: IncomingMessage,
	res: OutgoingMessage,
	session?: Session | null,
): Context {
	return {
		...initContextCache(),
		req,
		res,
		session,
	};
}

export const builder = new SchemaBuilder<{
	// We change the defaults for arguments to be `required`. Any non-required
	// argument can be set to `required: false`.
	DefaultInputFieldRequiredness: true;
	PrismaTypes: typeof PrismaTypes;
	Context: Context;
	Scalars: {
		// We modify the types for the `ID` type to denote that it's always a string when it comes in.
		ID: { Input: string; Output: string | number };
		DateTime: { Input: Date; Output: Date };
	};
	// Define the shape of the auth scopes that we'll be using:
	AuthScopes: {
		public: boolean;
		user: boolean;
		unauthenticated: boolean;
	};
}>({
	defaultInputFieldRequiredness: true,
	plugins: [
		DataLoaderPlugin,
		ErrorsPlugin,
		SimpleObjectsPlugin,
		ScopeAuthPlugin,
		ValidationPlugin,
		PrismaPlugin,
	],
	authScopes: async ({ session }) => ({
		public: true,
		user: !!session,
		unauthenticated: !session,
	}),
	prisma: { client: prisma },
});

// This initializes the query and mutation types so that we can add fields to them dynamically:
builder.queryType({
	// Set the default auth scope to be authenticated users:
	authScopes: {
		public: true,
		unauthenticated: true,
		user: true,
	},
});

builder.mutationType({
	// Set the default auth scope to be authenticated users:
	authScopes: {
		user: false,
	},
});

// Provide the custom DateTime scalar that allows dates to be transmitted over GraphQL:
builder.scalarType("DateTime", {
	serialize: (date) => date.toISOString(),
	parseValue: (date) => {
		return new Date(date);
	},
});
