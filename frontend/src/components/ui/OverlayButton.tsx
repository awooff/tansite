import {Button} from '@radix-ui/themes';
import React from 'react';

type Props = {
	children?: React.ReactElement;
	wonky?: boolean;
	props?: any;
};

function OverlayButton(props: Props) {
	return (
		<Button {...props.props}>
			{props.children}
		</Button>
	);
}

export default OverlayButton;
