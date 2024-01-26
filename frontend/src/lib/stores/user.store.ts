import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';

export type UserAtom = {
	username: string;
	email: string;
	avatar?: string;
	jwt: string;
};

export const userAtom = atomWithStorage('user', {} as UserAtom);
export const modifyUserAtom = atom(
	get => get(userAtom),
	(_get, set, newUser: UserAtom) => {
		set(userAtom, newUser);
	},
);
