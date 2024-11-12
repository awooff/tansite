import { Computer } from "./computer.type";

export type Log = {
	id: number;
	message: string;
	computer: Computer;
	created: string;
};
