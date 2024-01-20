import { Groups } from "./groups.type"

export interface SessionData {
	userId: number
	currentComputerId: string
	group: Groups
}