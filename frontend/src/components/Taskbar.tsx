import React from 'react';
import {Avatar, Box, Flex, Heading, IconButton, Text, Tooltip} from '@radix-ui/themes';
import {AvatarIcon, SunIcon} from '@radix-ui/react-icons';
import {userStore} from '@/lib/stores';

function Taskbar() {
	const {name, email, avatar} = userStore(state => state.user);

	return (
		<Flex dir={'row'} className='border-solid border-4 border-green-800'>
			<Tooltip content='User Settings'>
				<IconButton>
					<Avatar fallback={ <AvatarIcon/>} />
				</IconButton>
			</Tooltip>
			<Box>
				<Text>Welcome, {name === '' ? 'user' : name}</Text>
			</Box>
		</Flex>
	);
}

export default Taskbar;
