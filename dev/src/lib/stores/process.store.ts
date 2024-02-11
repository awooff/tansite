import { create } from "zustand";
import { Process } from "../types/process.type";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  processes: Process[];
};

type Action = {
  addProcess: (process: Process) => void;
  removeProcess: (process: Process) => void;
  setProcesses: (processes: Process[]) => void;
};

export const useProcessStore = create<State & Action>()(
  persist(
    (set, get) => ({
      processes: [],
      addProcess(process: Process) {
        if (this.processes.find((that) => that.id === process.id)) return;
        set({
          processes: [...get().processes, process],
        });
      },
      removeProcess(process: Process) {
        set({
          processes: get().processes.filter((that) => that.id !== process.id),
        });
      },
      setProcesses(processes: Process[]) {
        set({
          processes: processes,
        });
      },
    }),
    {
      name: "syscrack__process-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
