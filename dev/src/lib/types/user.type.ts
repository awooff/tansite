import { Groups } from "./groups.type";

export type User = {
	id: number;
	name: string;
	email: string;
	group: Groups;
	created?: string;
}