import { createContext } from 'react'
import { Groups } from '../lib/types/groups.type'
import { User } from '../lib/types/user.type'
import { Computer } from '../lib/types/computer.type'

export type GameType = {
	loaded: boolean
	connections: Computer[],
	computers: Computer[],
	user: User,
	finance: {
		total: number,
		bankAccount: '0000-0000-0000-0000',
		computer: Computer
	}[],
	gameId: string,
	title: string,
	preferences: object
	load: (after?: () => unknown | Promise<unknown>) => unknown
	reload: () => unknown
}

export const GameContextDefault = {
	loaded: false,
	connections: [],
	computers: [],
	title: '',
	preferences: {},
	gameId: '',
	user: {
		id: -1,
		name: "",
		email: "",
		group: Groups.GUEST
	},
	finance: [],
	valid: false,
	load: () => {

	},
	reload: () => {
		
	}
} as GameType

const GameContext = createContext<GameType>(GameContextDefault)

export default GameContext;