import { query } from "@/components/Profile";
import { preloadQuery } from "@/lib/apollo";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps<
	{},
	{
		id: string;
	}
> = async (ctx) => {
	return preloadQuery(ctx, {
		query,
		variables: {
			id: ctx.params!.id,
		},
	});
};

export { Profile as default } from "@/components/Profile";
