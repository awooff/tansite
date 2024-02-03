import React, {useState} from 'react';
import * as Form from '@radix-ui/react-form';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {type RegisterSchema} from '@schemas/register.schema';
import {Box, Button, TextField, Checkbox, Flex} from '@radix-ui/themes';
import {userStore} from '@/lib/stores';
import axios, {type AxiosError} from 'axios';
import toast, {Toaster} from 'react-hot-toast';

function RegisterForm() {
	const user = userStore((state => state.user));
	const jwt = userStore(state => state.user.jwt);
	const { updateUser } = userStore()
	const [error, setError] = useState('');
	const alertError = () => toast('An error happened!' + error);
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<RegisterSchema>();

	const onSubmit: SubmitHandler<RegisterSchema> = async data => {
		console.log(data);
		await axios.post('http://localhost:1337/auth/register', data, {
			withCredentials: true,
			headers: {
				Authorization: 'Bearer ' + jwt,
			},
		})
			.then(async response => {
				if (response.status !== 500) {
					setError(response.statusText)
					alertError();
				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const { username, email } = data;
				updateUser({
					username,
					email,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					jwt: '',
					avatar: '',
					group: 'GUEST',
				});
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
							{...register('username', {required: true})}
						/>
					</Form.Control>
					{errors.username && (
						<Form.FormMessage>
							{errors.username.message}
						</Form.FormMessage>
					)}
				</Form.Field>
				<Form.Field name='email'>
					<Form.Label>Email</Form.Label>
					<Form.Control asChild>
						<TextField.Input
							type='email'
							{...register('email', {required: true})}
						/>
					</Form.Control>
					{errors.email && (
						<Form.FormMessage>
							{errors.email.message}
						</Form.FormMessage>
					)}
				</Form.Field>
				<Form.Field name='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control asChild>
						<TextField.Input
							type='password'
							{...register('password', {required: true})}
						/>
					</Form.Control>
					{errors.password && (
						<Form.FormMessage>
							{errors.password.message}
						</Form.FormMessage>
					)}
				</Form.Field>

				<Flex dir='col'>
					<Flex dir='row' justify={'center'}>
						<Checkbox {...register('terms')} /> I accept the terms
						and conditions
					</Flex>
					<Flex dir='row' justify={'center'}>
						<Checkbox {...register('privacy')} /> I accept the
						privacy policy
					</Flex>
				</Flex>
				<Button size='3' variant='soft' type='submit'>
					{' '}
					Submit!{' '}
				</Button>
			</Form.Root>
			<Toaster/>
		</Box>
	);
}

export default RegisterForm;
