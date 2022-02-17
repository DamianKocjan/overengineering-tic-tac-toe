import { ButtonOrLink, Props as ButtonOrLinkProps } from "./ButtonOrLink";

export interface Props extends ButtonOrLinkProps {}

export function Link(props: Props) {
	return (
		<ButtonOrLink
			className="font-semibold focus:outline-none hover:text-opacity-80 focus:ring-2 focus:ring-gray-500"
			{...props}
		/>
	);
}
