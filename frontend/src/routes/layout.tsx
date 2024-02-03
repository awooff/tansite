import Taskbar from '@components/Taskbar';
import React, {type ReactNode, type ReactElement} from 'react';
import {Theme} from '@radix-ui/themes';
import {useThemeStore} from '@stores/theme.store';
import Navbar from '@components/Navbar';

export function Layout(props: {children?: ReactNode}): ReactElement {
	const theme = useThemeStore(state => state.theme);

	return (
		<Theme appearance={theme}>
			<Navbar />
			{props.children}
			<Taskbar />
		</Theme>
	);
}

export default Layout;
