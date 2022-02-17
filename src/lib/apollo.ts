import {
	ApolloClient,
	ApolloError,
	HttpLink,
	InMemoryCache,
	QueryOptions,
} from "@apollo/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useMemo } from "react";

let apolloClient: ApolloClient<any>;

interface ClientOptions {
	headers?: Record<string, string>;
	initialState?: Record<string, any>;
}

export async function preloadQuery(
	context: GetServerSidePropsContext,
	...queries: QueryOptions[]
): Promise<GetServerSidePropsResult<{}>> {
	const client = createApolloClient({
		headers: context.req.headers as Record<string, string>,
	});

	try {
		await Promise.all(
			queries.map((queryOptions) => client.query(queryOptions)),
		);

		return {
			props: {
				initialClientState: client.cache.extract(),
			},
		};
	} catch (e) {
		if (e instanceof ApolloError) {
			const notFoundError = e.graphQLErrors.find((error: Error) => {
				return (error as any)?.extensions.code === 404;
			});

			if (notFoundError) {
				return {
					notFound: true,
				};
			}
		}

		// NOTE: By default, we treat errors to preloading as if we didn't attempt to
		// preload the request at all. This allows the client to react to this, re-attempt
		// the request, and react accordingly. If you'd rather the error trigger a failure
		// in the server-side rendering itself, replace the return with the following line:
		// throw e;

		return { props: {} };
	}
}

export function useApollo(initialState?: Record<string, any>) {
	const client = useMemo(
		() => createApolloClient({ initialState }),
		[initialState],
	);

	return client;
}

export function createApolloClient({ initialState, headers }: ClientOptions) {
	let nextClient = apolloClient;

	if (!nextClient) {
		nextClient = new ApolloClient({
			ssrMode: typeof window === "undefined",
			credentials: "include",
			link: new HttpLink({
				uri:
					typeof window === "undefined"
						? "http://localhost:3000/api/graphql"
						: "/api/graphql",
				headers: {
					...headers,
					// Include the CSRF verification header:
					"X-CSRF-Trick": "nextjs-prisma-graphql",
				},
			}),
			cache: new InMemoryCache({
				typePolicies: {
					User: {
						fields: {
							notes: {
								// Don't cache separate results based on
								// any of this field's arguments.
								keyArgs: false,
								// Concatenate the incoming list items with
								// the existing list items.
								merge(existing = [], incoming) {
									return [...existing, ...incoming];
								},
							},
						},
					},
				},
			}),
		});
	}

	// If your page has Next.js data fetching methods that use Apollo Client,
	// the initial state gets hydrated here
	if (initialState) {
		// Get existing cache, loaded during client side data fetching
		const existingCache = nextClient.extract();

		// Restore the cache using the data passed from
		// getStaticProps/getServerSideProps combined with the existing cached data
		nextClient.cache.restore({ ...existingCache, ...initialState });
	}

	// For SSG and SSR always create a new Apollo Client
	if (typeof window === "undefined") return nextClient;

	// Create the Apollo Client once in the client
	if (!apolloClient) apolloClient = nextClient;

	return nextClient;
}
