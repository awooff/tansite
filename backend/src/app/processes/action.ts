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
      custom: {
        action: 'string'
      },
      softwareId: true
    } satisfies ProcessParameters
  },
  delay: async (computer: Computer, executor: Computer, data: ExecuteData) => {
    const software = computer.getSoftware(data.softwareId)
    return software.getExecutionCost(data.action) + settings.operationCost.action
  },
  before: async (computer: Computer, executor: Computer, data: ExecuteData) => {
    const software = computer.getSoftware(data.softwareId)

    if (data.action === 'execute' && software.actions.settings?.localExecutionOnly && computer.computerId !== executor.computerId) { return 'can only be executed locally' }

    return true
  },
  after: async (computer: Computer, executor: Computer, data: ExecuteData) => {
    const software = computer.getSoftware(data.softwareId)
    await software.execute(data.action, executor)
  }
} satisfies Process
export default action
