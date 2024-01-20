

import React, {ReactNode, useCallback, useEffect, useState} from 'react'
import SessionContext, { SessionContextDefault, SessionType } from '../contexts/session.context'
import PropTypes from 'prop-types';
import axios from 'axios';

function SessionProvider({ children }: {
	children: unknown
}) {
	const [session, setSession] = useState<SessionType>(SessionContextDefault)
	const load = useCallback(() => {
		(async () => {
			const result = await axios.get("http://localhost:1337/auth/valid", {
				headers: {
					Authorization: "Bearer " + localStorage.getItem('jwt')
				}
			})

			if (result.status === 200) {
				setSession({
					loaded: true,
					data: result.data.session,
					valid: true,
					user: result.data.user,
					load: load
				})
				return;
			}

			setSession(
				{
					...SessionContextDefault,
					load: load
				}
			)
		})();
	}, [
		setSession
	])

	useEffect(() => {
		if (session.loaded)
			return;

		load();
	}, [
		load, session
	])

	return <SessionContext.Provider value={session}>
		{children as ReactNode}
	</SessionContext.Provider>
}

SessionProvider.propTypes = {
	children: PropTypes.any
}

export default SessionProvider