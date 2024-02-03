import {type Computer} from './computer.type';

export type BankAccount = {
	value: number;
	userId: number;
	data: Record<string, unknown>;
	key: '0000-0000-0000-0000';
	computer: Computer;
};
