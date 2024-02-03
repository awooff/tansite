import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

export type User = {
	username: string;
	email: string;
	avatar: string;
	jwt: string;
};

type State = {
	user: User;
};

type Action = {
	updateUser: (user: State['user']) => void;
	removeUserData: (user: State['user']) => void;
};

export const userStore = create<State & Action>()(
	persist(
		(set, get) => ({
			user: {
				username: '',
				email: '',
				avatar: '',
				jwt: '',
			},
			updateUser() {
				set({user: get().user});
			},
			removeUserData() {
				set({
					user: {
						email: '',
						username: '',
						avatar: '',
						jwt: '',
					},
				});
			},
		}),
		{
			name: 'syscrack__user-storage', // Name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),

);
