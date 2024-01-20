

import React, {ReactNode, useCallback, useEffect, useState} from 'react'
import SessionContext, { SessionContextDefault, SessionType } from '../contexts/session.context'
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SessionProvider({ children }: {
	children: unknown
}) {
	const [session, setSession] = useState<SessionType>(SessionContextDefault)
	const navigate = useNavigate()

	const load = useCallback((after?: () => void) => {				
		(async () => {
			
			if (session.loaded) { 
				setSession(
					{
						...SessionContextDefault,
						loaded: false,
						load: load,
						reload: () => {
							navigate(0)
						}
					}
				)
				return;
			}
		
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
					load: load,
					reload: () => {
							navigate(0)
						}
				})

			} catch (error) {
				setSession(
					{
						...SessionContextDefault,
						loaded: true,
						load: load,
						reload: () => {
							navigate(0)
						}
					}
				)
			}

			if (after)
				await after()
		})();
	}, [
		setSession, navigate, session.loaded
	])

	useEffect(() => {
		if (session.loaded)
			return;

		load();
	}, [
		load, session
	])

	return <SessionContext.Provider value={session}>
		{children as ReactNode }
	</SessionContext.Provider>
}

SessionProvider.propTypes = {
	children: PropTypes.any
}

export default SessionProvider