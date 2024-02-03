import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Checkbox, Flex } from '@radix-ui/themes';
import { userStore } from '@stores/user.store';
import axios, { type AxiosError } from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { LoginSchema } from '@schemas/login.schema';

function RegisterForm() {
	const user = userStore((state => state.user));
	const [error, setError] = useState('');
	const alertSuccess = () => toast('Welcome user! Let\'s get you back :)')
	const alertError = () => toast('An error happened!' + error);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchema>();

	const onSubmit: SubmitHandler<LoginSchema> = async data => {
		console.log(data);
		await axios.post('http://localhost:1337/auth/login', data, {
			withCredentials: true,
			headers: {
				Authorization: 'Bearer ' + userStore(state => state.user.jwt),
			},
		})
			.then(async response => {
				if (response.status !== 500) {
					return (
						<p>
							{' '}
							Welcome, {user.username} - {response.statusText}
						</p>
					);
				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const { jwt } = response.data;
				const { username } = data;
				if (user.jwt !== '') {
					userStore(state => state.removeUserData(state.user));
				}
				
				userStore(state => {
					state.updateUser({
						username,
						email: state.user.email,
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						jwt,
						avatar: state.user.avatar,
					});
				});

				alertSuccess();
			})
			.catch(error => {
				const axiosError = error as AxiosError<any, any>;
				const result = axiosError.response;
				const resultError = result?.data?.error || result?.data || error;

				let issue = "";
				if (!resultError.message) {
					// Zod Error
					if (resultError.issues)
						issue = resultError.issues.map((issue: any) => {
							return issue.message
						}).join('\n')
					else
						issue = "internal server error"
				} else
					issue = resultError.message

				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				setError(issue);
				alertError();
			});
	};

	return (
		<Box width={'max-content'}>
			<Form.Root onSubmit={handleSubmit(onSubmit)}>
				<Form.Field name='username'>
					<Form.Label htmlFor=''>Username</Form.Label>
					<Form.Control asChild>
						<TextField.Input
							type='text'
							{...register('username', { required: true })}
						/>
					</Form.Control>
					{errors.username && (
						<Form.FormMessage>
							{errors.username.message}
						</Form.FormMessage>
					)}
				</Form.Field>
				<Form.Field name='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control asChild>
						<TextField.Input
							type='password'
							{...register('password', { required: true })}
						/>
					</Form.Control>
					{errors.password && (
						<Form.FormMessage>
							{errors.password.message}
						</Form.FormMessage>
					)}
				</Form.Field>
				<Button size='3' variant='soft' type='submit'>
					{' '}
					Submit!{' '}
				</Button>
			</Form.Root>
			<Toaster />
		</Box>
	);
}

export default RegisterForm;
