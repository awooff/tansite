

import React, {ReactNode, useCallback, useEffect, useState} from 'react'
import SessionContext, { SessionContextDefault, SessionType } from '../contexts/session.context'
import PropTypes from 'prop-types';
import axios from 'axios';

function SessionProvider({ children }: {
	children: unknown
}) {
	const [session, setSession] = useState<SessionType>(SessionContextDefault)
	const load = useCallback((after?: () => void) => {				
		(async () => {

			try
			{
				const result = await axios.get("http://localhost:1337/auth/valid", {
					withCredentials: true,
					headers: {
						Authorization: "Bearer " + localStorage.getItem('jwt')
					}
				})

				setSession({
					loaded: true,
					data: result.data.session,
					valid: true,
					user: result.data.user,
					load: load
				})

			} catch (error) {
				setSession(
					{
						...SessionContextDefault,
						loaded: true,
						load: load
					}
				)
			}

			if (after)
				await after()
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