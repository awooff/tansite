import {Button} from '@radix-ui/themes';
import React, { ReactComponentElement } from 'react';

type Props = {
	children?: any;
	className?: string;
	wonky?: boolean;
	props?: any;
	ref?: any;
};

const OverlayButton = React.forwardRef<HTMLButtonElement, Props>(
	({className, ...props}, ref) => (
		<button className='
			bg-inherit border-8 border-spacing-8 p-2 border-green-700 right-1 -skew-x-6
			hover:border-green-300
			active:border-red-200
			focus:border-red-600
			transition-all
			' ref={ref} {...props} />
	),
);

OverlayButton.displayName = 'OverlayButton';

export default OverlayButton;
