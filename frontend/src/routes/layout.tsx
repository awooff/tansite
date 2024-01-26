import Taskbar from '../components/Taskbar';
import React, {type ReactNode, type ReactElement} from 'react';
import {UserContext} from '../lib/contexts/user.context';
import {userAtom} from '../lib/stores/user.store';
import {useAtom} from 'jotai';

export function Layout(props: {children?: ReactNode}): ReactElement {
	const [user] = useAtom(userAtom);

	return (
		<UserContext.Provider value={user}>
			{props.children}
			<Taskbar />
		</UserContext.Provider>
	);
}

export default Layout;
