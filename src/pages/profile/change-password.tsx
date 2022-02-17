import { GetServerSideProps } from "next";
import { authenticatedRoute } from "@/lib/redirects";

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export { ChangePassword as default } from "@/components/EditProfile/ChangePassword";
