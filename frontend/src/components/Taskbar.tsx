import React from 'react';
import {Avatar, Box, Flex, Heading, IconButton, Text, Tooltip} from '@radix-ui/themes';
import {AvatarIcon, SunIcon} from '@radix-ui/react-icons';
import {userStore} from '@/lib/stores';
import Date from './ui/Date';

function Taskbar() {
	const {name, email, avatar} = userStore(state => state.user);

	return (
		<Flex dir={'row'} m={'auto'} justify={'between'} className='border-solid border-4 border-green-800'>
			<Flex dir={'row'} align={'center'}>
				<Tooltip content='User Settings'>
					<IconButton>
						<Avatar srcSet={avatar} fallback={ <AvatarIcon/>} />
					</IconButton>
				</Tooltip>
				<Box>
					<Text weight={'bold'}>Start</Text>
				</Box>
			</Flex>
			<Flex>
				<Box>
					<Date/>
				</Box>
			</Flex>
		</Flex>
	);
}

export default Taskbar;
