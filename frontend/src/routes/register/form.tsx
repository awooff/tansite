import React, { useState } from "react";
import { registerSchema, type RegisterSchema } from "@schemas/register.schema";
import { userStore } from "@lib/stores";
import axios, { type AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@hooks/use-toast";
import { Button } from "@ui/Button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ui/Form";
import { Input } from "@ui/Input";
import { Toaster } from "@/components/ui/Toaster";
import { Checkbox } from "@/components/ui";
import { type SubmitHandler, useForm } from "react-hook-form";

export function RegisterForm() {
	const jwt = userStore((state) => state.user.jwt);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterSchema>();

	const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
		const alertError = () =>
			toast({
				title: "Uh oh! There's been an error u.u",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(data, null, 2)}</code>
					</pre>
				),
			});

		const alertSuccess = () =>
			toast({
				title: "You submitted the following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(data, null, 2)}</code>
					</pre>
				),
			});

		console.log(data);

		await axios
			.post("http://localhost:1337/auth/register", data, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			})
			.then(async (_response) => {
				alertSuccess();

				navigate("/user/login");
			})
			.catch((error) => {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				const axiosError = error as AxiosError<any, any>;
				const result = axiosError.response;
				const resultError = result?.data?.error || result?.data || error;

				let issue = "";
				if (!resultError.message) {
					// Zod Error
					if (resultError.issues)
						issue = resultError.issues
							// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
		<article className="max-w-max">
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
									This is your public display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" {...field} />
								</FormControl>
								<FormDescription>This is your public email .</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" type="password" {...field} />
								</FormControl>
								<FormDescription>
									This is your public display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<section>
						<div className="flex justify-center">
							<Checkbox {...register("terms")} /> I accept the terms and
							conditions
						</div>
						<div className="justify-center flex">
							<Checkbox {...register("privacy")} /> I accept the privacy policy
						</div>
					</section>
					<Button variant="secondary" type="submit">
						{" "}
						Submit!{" "}
					</Button>
				</form>
			</Form>
			<Toaster />
		</article>
	);
}

export default RegisterForm;
