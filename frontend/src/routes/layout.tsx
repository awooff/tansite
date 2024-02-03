import Taskbar from '@components/Taskbar';
import React, {type ReactNode, type ReactElement} from 'react';
import {UserContext} from '@contexts/user.context';
import {userStore} from '@stores/user.store';
import {Theme} from '@radix-ui/themes';
import {useThemeStore} from '@stores/theme.store';
import Navbar from '@components/Navbar';

export function Layout(props: {children?: ReactNode}): ReactElement {
	const user = userStore(state => state.user);
	const theme = useThemeStore(state => state.theme);

	return (
		<UserContext.Provider value={user}>
			<Theme appearance={theme}>
				<Navbar />
				{props.children}
				<Taskbar />
			</Theme>
		</UserContext.Provider>
	);
}

export default Layout;
