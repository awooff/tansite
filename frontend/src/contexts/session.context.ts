import { createContext } from "react";
import type { Groups } from "backend/src/generated/client";
import type { User } from "backend/src/generated/client";
import type { Computer } from "backend/src/generated/client";
import type { ConnectedComputer } from "./game.context";

export type SessionType = {
	loaded: boolean;
	data: {
		userId: number;
		connections: Computer[];
		logins: Record<string, ConnectedComputer[]>;
		group: Groups;
	};
	user: User;
	valid: boolean;
	load: () => Promise<void>;
};

export const SessionContextDefault = {
	loaded: false,
	data: {
		userId: -1,
		connections: [],
		group: "Guest",
	} as any,
	user: {
		id: -1,
		name: "",
		email: "",
		group: "Guest",
	},
	valid: false,
	load: async () => {},
} as SessionType;

const SessionContext = createContext<SessionType>(SessionContextDefault);

export default SessionContext;
