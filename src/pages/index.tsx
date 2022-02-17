import { preloadQuery } from "@/lib/apollo";
import { Home, query } from "@/components/Home";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) =>
	preloadQuery(ctx, { query });

export default Home;
