import React, {Fragment, useContext, useState} from 'react';
import Form from './form';
import {Flex, Heading} from '@radix-ui/themes';
import {postRequestHandler} from '@/lib/utils';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

function LoginPage(): React.ReactElement {
	return (
		<Fragment>
			<Heading>Login</Heading>
			<Flex className='my-12 max-w-md align-center items-center justify-center'>
				<Form />
			</Flex>
		</Fragment>
	);
}

export default LoginPage;
