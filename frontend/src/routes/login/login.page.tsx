import React, { type ReactElement } from "react";
import Form from "./form";
import { Flex, Heading } from "@radix-ui/themes";

export function LoginPage(): ReactElement {
	return (
		<>
			<Heading>Login</Heading>
			<Flex className="my-12 max-w-md align-center items-center justify-center">
				<Form />
			</Flex>
		</>
	);
}

export default LoginPage;
