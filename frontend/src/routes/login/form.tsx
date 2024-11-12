import type React from "react";
import { type ReactElement, useState } from "react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ui/Form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { userStore } from "@stores/user.store";
import axios, { type AxiosError } from "axios";

import { loginSchema, type LoginSchema } from "@schemas/login.schema";
import { Button, Input } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@hooks/use-toast";
import { Toaster } from "@/components/ui/Toaster";

type Props = {
	children?: unknown;
};

export const RegisterForm: React.FC<Props> = (): ReactElement => {
	const jwt = userStore((state) => state.user.jwt);
	const { updateUser } = userStore();
	const [error, setError] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchema>();

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
		},
	});

	const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
		const alertSuccess = () =>
			toast({
				title: "You submitted the following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(data, null, 2)}</code>
					</pre>
				),
			});

		const alertError = () =>
			toast({
				title: "Uh oh! There's been an error u.u",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(data, null, 2)}</code>
					</pre>
				),
			});
		console.log(data);
		await axios
			.post("http://localhost:1337/auth/login", data, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			})
			.then(async (response) => {
				const { email, group, name, avatar } = response.data.user;
				const { token: jwt } = response.data;

				updateUser({
					username: name,
					email,
					jwt,
					group,
					avatar,
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

				setError(issue);
				alertError();
			});
	};

	return (
		<article>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-2/3 space-y-6"
				>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" {...field} />
								</FormControl>
								<FormDescription>
									This is your public username .
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>password</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" type="password" {...field} />
								</FormControl>
								<FormDescription>This is your public email .</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button variant="outline" type="submit">
						{" "}
						Submit!{" "}
					</Button>
				</form>
			</Form>
			<Toaster />
		</article>
	);
};

export default RegisterForm;
