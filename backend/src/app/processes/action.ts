import { Process, ProcessData, ProcessSettings } from '@/lib/types/process.type'
import { SoftwareAction } from '@/lib/types/software.type'
import { Computer } from '../computer'
import settings from '../../settings'
import GameException from '@/lib/exceptions/game.exception'

export type ExecuteData = {
  custom: {
    action: keyof SoftwareAction
  }
} & ProcessData

const action = {
  settings: {
    parameters: {
      custom: {
        action: (z) => {
          return z.string().trim().max(16)
        }
      },
      softwareId: true,
      ipAddress: true
    }
  },
  delay: async (computer: Computer | null, executor: Computer, data: ExecuteData) => {
    if (computer === null) { throw new Error('no computer') }

    const software = computer.getSoftware(data.softwareId)
    return software.getExecutionCost(data.custom.action) + settings.operationCost.action
  },
  before: async (computer: Computer | null, executor: Computer, data: ExecuteData) => {
    if (computer === null) { throw new Error('no computer') }

    let software;
    if (data.custom.action === 'upload')
      software = executor.getSoftware(data.softwareId)
    else
      software = computer.getSoftware(data.softwareId);

    if (!software)
      throw new GameException('invalid software');

    if (data.custom.action === 'execute' && software.action.settings?.localExecutionOnly && computer.computerId !== executor.computerId) { throw new GameException('can only be executed on your machine locally') }

    // check if the software can do this action
    return await software.preExecute(data.custom.action, executor, data)
  },
  after: async (computer: Computer | null, executor: Computer, data: ExecuteData) => {
    if (computer === null) { throw new Error('no computer') }

    let software;
    if (data.custom.action === 'upload')
      software = executor.getSoftware(data.softwareId)
    else
      software = computer.getSoftware(data.softwareId);

    return await software.execute(data.custom.action, executor)
  }
} satisfies Process
export default action
