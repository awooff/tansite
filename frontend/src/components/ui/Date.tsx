import {useNow} from '@hooks/use-now';
import {Text} from '@radix-ui/themes';
import React from 'react';

function Date() {
	const hours = useNow(60, 'hour');
	const minutes = useNow(1, 'minute');
	const seconds = useNow(1, 'second');
	return (
		<Text weight={'bold'}>
			{hours.getHours().toString().padStart(2, '0')}:
			{minutes.getMinutes().toString().padStart(2, '0')}:
			{seconds.getSeconds().toString().padStart(2, '0')}</Text>
	);
}

export default Date;
