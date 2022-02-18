import { ExecutionResult, GraphQLError } from "graphql";
import {
	getGraphQLParameters,
	processRequest,
	renderGraphiQL,
	shouldRenderGraphiQL,
} from "graphql-helix";
import { NextApiHandler } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { IncomingHttpHeaders } from "http";
import { builder, Context, createGraphQLContext } from "@/graphql/index";
import { resolveSession, sessionOptions } from "@/lib/sessions";

function getGraphQLCode(error: Error & { code?: number }) {
	return error?.code ?? error?.name === "NotFoundError" ? 404 : null;
}

function formatResult(result: ExecutionResult) {
	const formattedResult: ExecutionResult = {
		data: result.data,
	};

	if (result.errors) {
		formattedResult.errors = result.errors.map((error) => {
			// NOTE: If you need to debug a specific server-side GraphQL error, you may want to uncomment this log:
			// console.log(error.originalError);

			// Return a generic error message instead
			return new GraphQLError(
				error.message,
				error.nodes,
				error.source,
				error.positions,
				error.path,
				error.originalError,
				{
					code: getGraphQLCode(error.originalError as any),
					path: (error.originalError as any)?.path,
					...(error.originalError as any)?.extensions,
				},
			);
		});
	}

	return formattedResult;
}

interface GraphQLRequest {
	body?: any;
	headers: IncomingHttpHeaders;
	method: string;
	query: any;
}

const handler: NextApiHandler = async (req, res) => {
	// For POST requests, we require a custom header: X-CSRF-Trick: nextjs-prisma-graphql.
	// This helps ensure that cross-domain requests can't be issued.
	if (
		req.method === "POST" &&
		req.headers["x-csrf-trick"] !== "nextjs-prisma-graphql"
	) {
		res.status(400);
		res.end("Missing CSRF verification.");
		return;
	}

	try {
		const request: GraphQLRequest = {
			headers: req.headers,
			method: req.method ?? "GET",
			query: req.query,
			body: req.body,
		};

		if (shouldRenderGraphiQL(request)) {
			res.setHeader("Content-Type", "text/html");
			res.send(
				renderGraphiQL({
					endpoint: "/api/graphql",
					headers: JSON.stringify({
						"X-CSRF-Trick": "nextjs-prisma-graphql",
					}),
				}),
			);
		} else {
			const { operationName, query, variables } = getGraphQLParameters(request);

			const session = await resolveSession({ req, res });

			const result = await processRequest<Context>({
				operationName,
				query,
				variables,
				request,
				schema: builder.toSchema({}),
				contextFactory: () => createGraphQLContext(req, res, session),
			});

			if (result.type !== "RESPONSE") {
				throw new Error(`Unsupported response type: "${result.type}"`);
			}

			result.headers.forEach(({ name, value }) => res.setHeader(name, value));
			res.status(result.status);
			res.json(formatResult(result.payload));
		}
	} catch (err) {
		res.status(500);
		res.end(String(err));
	}
};

export default withIronSessionApiRoute(handler, sessionOptions);
