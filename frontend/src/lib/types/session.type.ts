import {type Computer} from './computer.type';
import {type Groups} from './groups.type';

export type SessionData = {
	userId: number;
	connections: Computer[];
	group: Groups;
};
