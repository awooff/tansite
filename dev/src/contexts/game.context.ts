import { createContext } from 'react'
import { Groups } from '../lib/types/groups.type'
import { User } from '../lib/types/user.type'
import { Computer } from '../lib/types/computer.type'
import { BankAccount } from '../lib/types/account.type'

export type GameType = {
	loaded: boolean
	connections: Computer[],
	computers: Computer[],
	user: User,
	bankAccounts: BankAccount[],
	gameId: string,
	title: string,
	preferences: object
	load: (after?: (newGame: GameType) => unknown | Promise<unknown>) => void
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
	bankAccounts: [],
	valid: false,
	load: () => {
		
	},
	reload: () => {}
} as GameType

const GameContext = createContext<GameType>(GameContextDefault)

export default GameContext;