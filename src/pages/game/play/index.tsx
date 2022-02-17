import { GetServerSideProps } from "next";
import { authenticatedRoute } from "@/lib/redirects";

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export { PlayIndex as default } from "@/components/TicTacToe/PlayIndex";
