import { User } from "./user.type";

export type Computer = {
	id: string
	userId: number
	user: User
	ip: string
	type: string
	hardware: {
		type: 'HDD' | 'GPU' | "CPU" | "Upload" | "Download" | "Ram"
		strength: number
	}[],
	gameId: string
}