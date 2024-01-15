import { Process, ProcessParameters } from "@/lib/types/process.type";
import { SoftwareActions } from "@/lib/types/software.type";
import { Computer } from "../computer";
import settings from "../../settings";

export type ExecuteData = {
  softwareId: string
  action: keyof SoftwareActions
}

const action = {
  parameters: () => {
    return {
      computerId: true
    } as ProcessParameters
  },
  delay: async (computer: Computer, executor: Computer, data: ExecuteData) => {
    let hasher = computer.getFirstTypeInstalled('hasher');
    let cracker = executor.getFirstTypeInstalled('cracker');
    return hasher.getExecutionCost(data.action) + cracker.getExecutionCost('execute') + settings.operationCost.hack;
  },
  before: async (computer: Computer, executor: Computer, data: ExecuteData) => {

    let hasher = computer.getFirstTypeInstalled('hasher')
    let cracker = executor.getFirstTypeInstalled('cracker');

    if (hasher.level > cracker.level)
      return "your cracker is too weak to hack this"

    return true;
  },
  after: async (computer: Computer, executor: Computer, data: ExecuteData) => {

  }
} as Process
export default action;