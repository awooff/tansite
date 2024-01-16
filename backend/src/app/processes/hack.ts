import { Process, ProcessData, ProcessSettings } from '@/lib/types/process.type'
import { Computer } from '../computer'
import settings from '../../settings'
import GameException from '@/lib/exceptions/game.exception'

const action = {
  settings: {
    parameters: {
      computer: true
    }
  },
  delay: async (computer: Computer | null, executor: Computer, data: ProcessData) => {
    if (computer === null) { throw new Error('no computer') }

    const hasher = computer.getFirstTypeInstalled('hasher')
    const cracker = executor.getFirstTypeInstalled('cracker')
    return hasher.getExecutionCost('execute') + cracker.getExecutionCost('execute') + settings.operationCost.hack
  },
  before: async (computer: Computer | null, executor: Computer, data: ProcessData) => {
    if (computer === null) { throw new Error('no computer') }

    const hasher = computer.getFirstTypeInstalled('hasher')
    const cracker = executor.getFirstTypeInstalled('cracker')

    if (hasher.level > cracker.level) { throw new GameException('your cracker is too weak') }

    return true
  },
  after: async (computer: Computer | null, executor: Computer, data: ProcessData) => {

  }
} satisfies Process
export default action
