import { createContext } from 'react'
import { SessionData } from '../lib/types/session.type'
import { Groups } from '../lib/types/groups.type'
import { User } from '../lib/types/user.type'

export type SessionType = {
	loaded: boolean
	data: SessionData
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	user: User,
	valid: boolean,
	load: (after?: () => unknown | Promise<unknown>) => unknown
}

export const SessionContextDefault = {
	loaded: false,
	data: {
		userId: -1,
		currentComputerId: "",
		group: Groups.GUEST
	},
	user: {
		id: -1,
		name: "",
		email: "",
		group: Groups.GUEST
	},
	valid: false,
	load: () => {
	
	}
} as SessionType

const SessionContext = createContext<SessionType>(SessionContextDefault)

export default SessionContext;