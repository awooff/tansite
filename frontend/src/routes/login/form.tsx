import React from 'react';
import {useAtom} from 'jotai';
import {userAtom, type UserAtom} from '@stores/user.store';
import * as Form from '@radix-ui/react-form';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {type RegisterSchema} from '@schemas/register.schema';
import {Box, Button, TextField, Checkbox, Flex} from '@radix-ui/themes';

function RegisterForm() {
	const [user, setUser] = useAtom<UserAtom>(userAtom);

	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<RegisterSchema>();

	const onSubmit: SubmitHandler<RegisterSchema> = async data => {
		console.log(data);
		await fetch('http://localhost:1337/auth/register', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {},
		}).then(response => {
			if (!response.ok) {
				return <p> Welcome, {user.username} - {response.statusText}</p>;
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const {jwt} = response.body as any;
			const {username, email} = data;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			setUser({username, email, jwt});
		}).catch(err => {
			if (err) {
				return <p>Something bad happened!</p>;
			}
		});
	};

	return (
		<Box width={'max-content'}>
			<Form.Root onSubmit={handleSubmit(onSubmit)}>
				<Form.Field name='username'>
					<Form.Label>Username</Form.Label>
					<Form.Control asChild>
						<TextField.Input type='text' {...register('username', {required: true})}/>
					</Form.Control>
					{errors.username && <Form.FormMessage>{errors.username.message}</Form.FormMessage>}
				</Form.Field>
				<Form.Field name='email'>
					<Form.Label>Email</Form.Label>
					<Form.Control asChild>
						<TextField.Input type='email' {...register('email', {required: true})}/>
					</Form.Control>
					{errors.email && <Form.FormMessage>{errors.email.message}</Form.FormMessage>}
				</Form.Field>
				<Form.Field name='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control asChild>
						<TextField.Input type='password' {...register('password', {required: true})}/>
					</Form.Control>
					{errors.password && <Form.FormMessage>{errors.password.message}</Form.FormMessage>}
				</Form.Field>

				<Flex dir='col'>
					<Flex dir='row' justify={'center'}>
						<Checkbox {...register('terms')} /> I accept the terms and conditions
					</Flex>
					<Flex dir='row' justify={'center'}>
						<Checkbox {...register('privacy')} /> I accept the privacy policy
					</Flex>
				</Flex>
				<Button size='3' variant='soft' type='submit'> Submit! </Button>
			</Form.Root>
		</Box>
	);
}

export default RegisterForm;
