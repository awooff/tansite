import React, {Fragment, useState} from 'react';
import {Box, Text, Heading, Container, Button} from '@radix-ui/themes';
import {useBearStore} from '@/lib/hooks/use-bear-store';

function BearCounter() {
	const bears = useBearStore(state => state.bears);
	return <h1>{bears} around here...</h1>;
}

function Controls() {
	const increasePopulation = useBearStore(state => state.increasePopulation);
	const decreasePopulation = useBearStore(state => state.decreasePopulation);
	const removeAllBears = useBearStore(state => state.removeAllBears);

	return <Fragment>
		<Button onClick={increasePopulation}>one up</Button>
		<Button onClick={decreasePopulation}>one down</Button>
		<Button onClick={removeAllBears}>kill</Button>
	</Fragment>;
}

function RootPage() {
	return (
		<Fragment>
			<Box className='border-2 border-blue-800'>
				<Container size={'1'}>
					<Heading>Hi</Heading>
					<Text>Welcome to Syscrack</Text>
				</Container>
			</Box>
			<Box>
				<BearCounter/>
				<Controls />
			</Box>
		</Fragment>
	);
}

export default RootPage;
