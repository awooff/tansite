import { createContext } from "react";
import { User, Prisma } from "backend/src/generated/client";

type Computer = Prisma.ComputerGetPayload<{
  include: { hardware: true; software: false; process: true };
}>;

export type ConnectedComputer = Prisma.ComputerGetPayload<{
  include: { hardware: true; software: true; process: true; Logs: true };
}>;

export type GameType = {
  loaded: boolean;
  connections: ConnectedComputer[];
  computers: Computer[];
  user: User;
  gameId: string;
  title: string;
  preferences: object;
  load: () => Promise<unknown>;
  reload: () => unknown;
};

export const GameContextDefault = {
  loaded: false,
  connections: [],
  computers: [],
  title: "",
  preferences: {},
  gameId: "",
  user: {} as any,
  valid: false,
  load: async () => {},
  reload: () => {},
} as GameType;

const GameContext = createContext<GameType>(GameContextDefault);

export default GameContext;
