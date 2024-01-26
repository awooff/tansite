import { Hardware, HardwareType } from "./hardware.type";
import { User } from "./user.type";


export type Computer = {
	id: string
	userId: number
	user: User
	ip: string
	type: string
	hardware: Hardware[],
	gameId: string
	data: {
		hardwareLimits?: Record<HardwareType, number>
		title?: string
		markdown?: string
	},
	process: {
		id: string
		type: string
	}[],
	software: {
		name: string,
		level: number,
		size: number,
		type: string,
		userId: number,
		id: string,
		installed: boolean
	}[]
}