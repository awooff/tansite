import React, {Fragment} from 'react';
import OverlayButton from './ui/OverlayButton';
import {Text} from '@radix-ui/themes';

function Navbar() {
	return (
		<Fragment>
			<nav className='inline-flex space-between border-b-2 border-green-700'>
				<nav className='inline-flex border-r-2 border-green-700'>
					<OverlayButton>
						<Text>File</Text>
					</OverlayButton>
					<OverlayButton>
						<Text>Edit</Text>
					</OverlayButton>
				</nav>
			</nav>
		</Fragment>
	);
}

export default Navbar;
