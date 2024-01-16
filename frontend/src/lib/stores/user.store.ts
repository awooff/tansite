import { create } from 'zustand'

type UserAuthState = {
	username: string
	jwt: string
}

type UserAuthAction = {
	updateUsername: (username: UserAuthState['username']) => void
	updateJwt: (jwt: UserAuthState['jwt']) => void
}

export const useUserAuthStore = create<UserAuthState & UserAuthAction>(set => ({
	username: '',
	jwt: '',
	updateUsername: (username) => set(() => ({ username })),
	updateJwt: (jwt) => set(() => ({ jwt }))
}))

