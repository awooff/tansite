import { Computer } from "./types/computer.type";
import { Process } from "./types/process.type";
import { Software } from "./types/software";

export type ActionFunc = (
  software: Software,
  computer: Computer,
  executor: Computer,
  process: Process,
  navigate: (to: string, data?: { state: object }) => void
) => void | Promise<void>;

/**
 * Called when an action is complete, each method is dependant on the action
 */
export const actions = {
  collector: {
    execute: async (software, computer, executor, process, navigate) => {},
  },
} as Record<string, Record<string, ActionFunc>>;

/**
 * Run an action, has to be after a completed process
 * @param action
 * @param software
 * @param computer
 * @param executor
 * @param process
 * @param navigate
 * @returns
 */
export const run = async (
  action: string,
  software: Software,
  computer: Computer,
  executor: Computer,
  process: Process,
  navigate: (to: string, data?: { state: object }) => void
) => {
  if (!actions?.[software.type]?.[action]) return;
  await actions[software.type][action](
    software,
    computer,
    executor,
    process,
    navigate
  );
};
