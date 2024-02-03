import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

export type User = {
	name: string;
	email: string;
	avatar: string;
};

type State = {
	user: User;
};

type Action = {
	updateUser: (name: State['user']) => void;
};

export const userStore = create<State & Action>()(
	persist(
		(set, get) => ({
			user: {
				name: '',
				email: '',
				avatar: '',
			},
			updateUser() {
				set({user: get().user});
			},
		}),
		{
			name: 'syscrack__user-storage', // Name of the item in the storage (must be unique)
			storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
		},
	),

);
