import { GetServerSideProps } from "next";
import { authenticatedRoute } from "@/lib/redirects";
import { preloadQuery } from "@/lib/apollo";
import { Play, query } from "@/components/TicTacToe/Play";

export const getServerSideProps: GetServerSideProps<
	{},
	{
		id: string;
	}
> = async (ctx) => {
	const auth = await authenticatedRoute(ctx);
	if ("redirect" in auth) {
		return auth;
	}

	return preloadQuery(ctx, {
		query,
		variables: {
			id: ctx.params!.id,
		},
	});
};

export default Play;
