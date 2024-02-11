import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Computer } from "../types/computer.type";

type State = {
  history: Record<string, ({ tab?: string; domain?: string } & Computer)[]>;
  connectionId?: string;
};

type Action = {
  addHistory: (
    connectionId: string,
    tab: string,
    computer: Computer,
    domain?: string
  ) => void;
  removeHistory: (connectionId: string, computer: Computer) => void;
  setConnectionId: (connectionId: string) => void;
  updateTab: (connectionId: string, index: number, tab: string) => void;
};
``;

export const useBrowserStore = create<State & Action>()(
  persist(
    (set, get) => ({
      history: {},
      updateTab(connectionId: string, index: number, tab: string) {
        let newHistory = this.history[connectionId];

        newHistory[index].tab = tab;
        set({
          history: {
            [connectionId]: newHistory,
          },
        });
      },
      setConnectionId(connectionId: string) {
        set({
          connectionId: connectionId,
        });
      },
      addHistory(
        connectonId: string,
        tab: string,
        computer: Computer,
        domain?: string
      ) {
        set({
          history: {
            ...this.history,
            [connectonId]: [{ ...computer, tab: tab, domain: domain }],
          },
        });
      },
      removeHistory(connectionId: string, computer: Computer) {
        set({
          history: {
            ...this.history,
            [connectionId]: this.history[connectionId].filter(
              (that) => that.id !== computer.id
            ),
          },
        });
      },
    }),
    {
      name: "syscrack__browser-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);