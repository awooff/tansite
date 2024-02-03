import React, {Fragment, useState} from 'react';
import {Box, Text, Heading, Container} from '@radix-ui/themes';

function RootPage() {
	return (
		<Fragment>
			<Box className='border-2 border-blue-800'>
				<Container size={'1'}>
					<Heading>Hi</Heading>
					<Text>Welcome to Syscrack</Text>
				</Container>
			</Box>
		</Fragment>
	);
}

export default RootPage;
