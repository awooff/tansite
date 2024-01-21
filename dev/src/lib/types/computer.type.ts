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
	}
}