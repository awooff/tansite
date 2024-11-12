import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios, { type AxiosError } from "axios";

type WithSelectors<S> = S extends { getState: () => infer T }
	? S & { use: { [K in keyof T]: () => T[K] } }
	: never;

const createSelectors = <
	S extends UseBoundStore<StoreApi<Record<string, unknown>>>,
>(
	_store: S,
) => {
	const store = _store as WithSelectors<typeof _store>;
	store.use = {};
	for (const k of Object.keys(store.getState())) {
		(store.use as any)[k] = () => store((s) => s[k]);
	}

	return store;
};

type Group = "GUEST" | "ADMIN" | "USER";
export type User = {
	username: string;
	email: string;
	avatar: string;
	jwt: string;
	group: Group;
};

type State = {
	user: User;
};

type Action = {
	updateUser: (user: State["user"]) => void;
	loginUser: (user: State["user"]) => void;
};

/**
 * Required for zustand stores, as the lib doesn't expose this type
 */
export type ExtractState<S> = S extends {
	getState: () => infer T;
}
	? T
	: never;

export const userStore = create<State & Action>()(
	persist(
		(set, get) => ({
			user: {
				username: "",
				email: "",
				avatar: "",
				jwt: "",
				group: "GUEST",
			},
			async loginUser(data: User) {
				await axios
					.post("http://localhost:1337/auth/login", data, {
						withCredentials: true,
						headers: {
							Authorization: data.jwt,
						},
					})
					.then(async (response) => {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const { email, group, name } = response.data.user;
						const { jwt } = response.data;
						if (data.jwt !== "") {
							get().removeUserData(data);
						}
						get().updateUser({
							username: name,
							email,
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							jwt,
							group,
							avatar: "",
						});
					})
					.catch((error) => {
						const axiosError = error as AxiosError<any, any>;
						const result = axiosError.response;
						const resultError = result?.data?.error || result?.data || error;

						let issue = "";
						if (!resultError.message) {
							// Zod Error
							if (resultError.issues)
								issue = resultError.issues
									.map((issue: any) => {
										return issue.message;
									})
									.join("\n");
							else issue = "internal server error";
						} else issue = resultError.message;

						return issue;
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					});
			},
			updateUser(user: User): void {
				set({ user });
			},
		}),
		{
			name: "syscrack__user-storage", // Name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),
);

export const useAuthStore = createSelectors(userStore);
