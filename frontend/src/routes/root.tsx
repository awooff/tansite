import React, {Fragment, useState} from 'react';
import anime from 'animejs';
import {Box, Text, Heading, Flex, Button, Section, Grid, Table} from '@radix-ui/themes';
import {useNavigate} from 'react-router-dom';
import MusicPlayer from '@components/MusicPlayer';
import VideoLayout from '@layouts/VideoLayout';

function Leaderboard() {
	const players = [
		{
			name: 'xXX___l337h4x0r___XXx',
			bloods: 2173,
			money: 324094,
		},
		{
			name: 'houslei',
			bloods: 1934,
			money: 4834,
		},
		{
			name: 'geigei',
			bloods: 1844,
			money: 83842,
		},
	];
	return (
		<Table.Root className='bg-gray-900 rounded-md'>
			<Table.Header>
				<Table.Row className='text-white'>
					{['Player', 'Bloods', '$'].map((el, index) => (
						<Table.ColumnHeaderCell key={index}>
							{el}
						</Table.ColumnHeaderCell>
					))}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{Object.values(players).map((player, index) => (
					<Table.Row key={index} className='text-white bg-gray-800'>
						<Table.RowHeaderCell>{player.name}</Table.RowHeaderCell>
						<Table.Cell>{player.bloods}</Table.Cell>
						<Table.Cell>{player.money}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
}

function HeroBanner() {
	const navigate = useNavigate();
	return (
		<Section size={'1'}>
			<Flex direction={'column'} gap={'4'}>
				<Flex direction={'column'} gap={'1'}>
					<Heading as={'h1'} className={'text-8xl w-full'}>The future is now.</Heading>
					<Text>Hack the world. Hack your dog. Welcome to Syscrack.</Text>
				</Flex>
				<Flex gap={'4'} direction={'row'}>
					<Button variant='classic' content={'Log in'} onClick={() => {
						navigate('/user/login');
					}}>
					Log in
					</Button>
					<Button variant='classic' color='green' content={'Sign Up'} onClick={() => {
						navigate('/user/signup');
					}}>
					Sign Up
					</Button>
				</Flex>
			</Flex>
		</Section>
	);
}

type RootPageProps = Record<string, unknown>;
const RootPage: React.FC<RootPageProps> = () => (
	<Fragment>
		<VideoLayout videoSrc='/videos/CyberGlobalStuff.mp4'>
			<Box>
				<HeroBanner/>
			</Box>
			<Box>
				<Grid columns={'3'} gap={'3'} width={'max-content'} className='text-white'>
					<Box height={'7'} className=''>
						<Text>Leaderboard</Text>
						<Leaderboard/>
					</Box>
					<Box height={'7'}>
						<Text>Hi</Text>
					</Box>
					<Box>
						<MusicPlayer/>
					</Box>
				</Grid>
			</Box>
		</VideoLayout>

	</Fragment>
);

export default RootPage;
