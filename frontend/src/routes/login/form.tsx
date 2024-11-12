import type React from "react";
import { type ReactElement, useState } from "react";
import * as Form from "@radix-ui/react-form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Box, Button, TextField } from "@radix-ui/themes";
import { userStore } from "@stores/user.store";
import axios, { type AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import type { LoginSchema } from "@schemas/login.schema";

type Props = {
	children?: unknown;
};

export const RegisterForm: React.FC<Props> = (): ReactElement => {
	const user = userStore((state) => state.user);
	const jwt = userStore((state) => state.user.jwt);
	const { removeUserData, updateUser } = userStore();
	const [error, setError] = useState("");
	const alertSuccess = () => toast("Welcome user! Let's get you back :)");
	const alertError = () => toast(`An error happened!${error}`);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchema>();

	const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
		console.log(data);
		await axios
			.post("http://localhost:1337/auth/login", data, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			})
			.then(async (response) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const { email, group, name } = response.data.user;
				const { token } = response.data;
				if (user.jwt) {
					removeUserData(user);
				}

				updateUser({
					username: name,
					email,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					jwt: token,
					group,
					avatar: "",
				});

				alertSuccess();
			})
			.catch((error) => {
				const axiosError = error as AxiosError<any, any>;
				const result = axiosError.response;
				const resultError = result?.data?.error || result?.data || error;

				let issue = "";
				if (!resultError.message) {
					// Zod Error
					if (resultError.issues)
						issue = resultError.issues
							.map((issue: any) => {
								return issue.message;
							})
							.join("\n");
					else issue = "internal server error";
				} else issue = resultError.message;

				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				setError(issue);
				alertError();
			});
	};

	return (
		<Box width={"max-content"}>
			<Form.Root onSubmit={handleSubmit(onSubmit)}>
				<Form.Field name="username">
					<Form.Label htmlFor="">Username</Form.Label>
					<Form.Control asChild>
						<TextField.Input
							type="text"
							{...register("username", { required: true })}
						/>
					</Form.Control>
					{errors.username && (
						<Form.FormMessage>
							{errors.username.message?.toString()}
						</Form.FormMessage>
					)}
				</Form.Field>
				<Form.Field name="password">
					<Form.Label>Password</Form.Label>
					<Form.Control asChild>
						<TextField.Input
							type="password"
							{...register("password", { required: true })}
						/>
					</Form.Control>
					{errors.password && (
						<Form.FormMessage>
							{errors.password.message?.toString()}
						</Form.FormMessage>
					)}
				</Form.Field>
				<Button size="3" variant="soft" type="submit">
					{" "}
					Submit!{" "}
				</Button>
			</Form.Root>
			<Toaster />
		</Box>
	);
};

export default RegisterForm;
