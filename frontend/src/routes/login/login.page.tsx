import React, {Fragment} from 'react';
import Form from './form';
import {Heading} from '@radix-ui/themes';

function RegisterPage() {
	return (
		<Fragment>
			<Heading>RegisterPage</Heading>
			<div className='my-12 flex max-w-md align-center items-center justify-center'>
				<Form />
			</div>
		</Fragment>
	);
}

export default RegisterPage;
