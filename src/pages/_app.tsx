import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { DefaultSeo } from "next-seo";
import { ApolloProvider } from "@apollo/client";
import { NProgress } from "@/components/NProgress";
import { useApollo } from "@/lib/apollo";
import "@/styles/globals.css";

function App({ Component, pageProps }: AppProps) {
	const client = useApollo(pageProps.initialClientState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider storageKey="preferred-theme" attribute="class">
				<DefaultSeo
					defaultTitle="Tic Tac Toe"
					titleTemplate="%s | Tic Tac Toe"
					description="Tic Tac Toe game with NextJS, Prisma and GraphQL"
				/>
				<NProgress />
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
}

export default App;
