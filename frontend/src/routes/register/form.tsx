import React from 'react'
import * as Form from '@radix-ui/react-form';
import { useForm, SubmitHandler } from "react-hook-form"
import { RegisterSchema } from '../../lib/schemas';

function RegisterForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RegisterSchema>();

	const onSubmit: SubmitHandler<RegisterSchema> = (data) => console.log(data)
	
  return (
	  <Form.Root>
		  <Form.Field name="username">
			  <Form.Label>Username</Form.Label>
			  <Form.Control asChild>
				  <input type="text" {...register('username', {required: true})}/>
			  </Form.Control>
		  </Form.Field>
		  <Form.Field name="email">
			  <Form.Label>Username</Form.Label>
			  <Form.Control asChild>
				  <input type="email" {...register('email', {required: true})}/>
			  </Form.Control>
		  </Form.Field>
		  <Form.Field name="password">
			  <Form.Label>Username</Form.Label>
			  <Form.Control asChild>
				  <input type="password" {...register('password', {required: true})}/>
			  </Form.Control>
		  </Form.Field>
	  </Form.Root>
  )
}

export default RegisterForm