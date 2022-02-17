import { GetServerSideProps } from "next";
import { Ranking, query } from "@/components/Ranking";
import { preloadQuery } from "@/lib/apollo";

export const getServerSideProps: GetServerSideProps = async (ctx) =>
	preloadQuery(ctx, { query });

export default Ranking;
