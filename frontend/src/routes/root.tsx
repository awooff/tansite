import React, {Fragment, useState} from 'react';
import {Text, Heading} from '@radix-ui/themes';
import {useAtom} from 'jotai';
import {userAtom} from '../lib/stores/user.store';

function RootPage() {
	const [user, setUser] = useAtom(userAtom);

	return (
		<Fragment>
			<Heading>Hi</Heading>
			<Text>Welcome to Syscrack, {user.username || 'user'}</Text>
		</Fragment>
	);
}

export default RootPage;
