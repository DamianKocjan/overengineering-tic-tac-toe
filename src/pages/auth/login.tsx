import { GetServerSideProps } from "next";
import { unauthenticatedRoute } from "@/lib/redirects";

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute;

export { LoginForm as default } from "@/components/Auth/LoginForm";
