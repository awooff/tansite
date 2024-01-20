import { createContext } from 'react'
import { SessionData } from '../lib/types/session.type'
import { Groups } from '../lib/types/groups.type'

export type SessionType = {
	loaded: boolean
	data: SessionData
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	user: any,
	valid: boolean,
	load: () => unknown
}

export const SessionContextDefault = {
	loaded: false,
	data: {
		userId: -1,
		currentComputerId: "",
		group: Groups.GUEST
	},
	user: {},
	valid: false,
	load: () => {}
}

const SessionContext = createContext<SessionType>(SessionContextDefault)

export default SessionContext;