import {type SessionData} from '../types/session.type';
import {type User} from './user.store';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import * as z from 'zod';

const roles = z.enum(['GUEST', 'ADMIN', 'USER']);

type Role = z.infer<typeof roles>;

// eslint-disable-next-line @typescript-eslint/naming-convention
const UserSchema = z.object({
	userId: z.string(),
	roles,
});

type TokenData = z.infer<typeof UserSchema>;

type AuthStore = {
	accessToken: string | undefined;
	accessTokenData: TokenData | undefined;
	refreshToken: string | undefined;
	setAccessToken: (accessToken: string | undefined) => void;
	setRefreshToken: (refreshToken: string | undefined) => void;
	// Set tokens on the app start
	init: () => void;
	clearTokens: () => void;
};

export type SessionType = {
	loaded: boolean;
	data: SessionData;
	user: User;
	valid: boolean;
};

type State = {
	loaded: false;
	data: {
		userId: -1;
		connections: any[];
		group: 'GUEST';
	};
	valid: false;
};

type Action = {
	isLoaded: (state: State['loaded']) => boolean;
	setData: (state: State['data']) => void;
	isValid: (state: State['valid']) => void;
};

export const useSessionStore = create<State & Action>()(
	persist(
		(set, get) => ({
			loaded: false,
			data: {
				userId: -1,
				connections: [],
				group: 'GUEST',
			},
			valid: false,
			isLoaded() {
				set({loaded: get().loaded});
				return get().loaded;
			},
			setData() {
				set({data: get().data});
			},
			isValid() {
				set({valid: get().valid});
			},

		}), {
			name: 'syscrack__auth_store',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

