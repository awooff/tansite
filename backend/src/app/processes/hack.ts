import { Process, ProcessParameters } from '@/lib/types/process.type'
import { SoftwareActions } from '@/lib/types/software.type'
import { Computer } from '../computer'
import settings from '../../settings'

export interface ExecuteData {
  softwareId: string
  action: keyof SoftwareActions
}

const action = {
  parameters: () => {
    return {
      computerId: true
    } satisfies ProcessParameters
  },
  delay: async (computer: Computer, executor: Computer, data: ExecuteData) => {
    const hasher = computer.getFirstTypeInstalled('hasher')
    const cracker = executor.getFirstTypeInstalled('cracker')
    return hasher.getExecutionCost(data.action) + cracker.getExecutionCost('execute') + settings.operationCost.hack
  },
  before: async (computer: Computer, executor: Computer, data: ExecuteData) => {
    const hasher = computer.getFirstTypeInstalled('hasher')
    const cracker = executor.getFirstTypeInstalled('cracker')

    if (hasher.level > cracker.level) { return 'your cracker is too weak to hack this' }

    return true
  },
  after: async (computer: Computer, executor: Computer, data: ExecuteData) => {

  }
} satisfies Process
export default action
