import { GetServerSideProps } from "next";
import { authenticatedRoute } from "@/lib/redirects";

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export { EditProfile as default } from "@/components/EditProfile/EditProfile";
