import { Process, ProcessData } from '@/lib/types/process.type'
import { Computer } from '../../computer'
import GameException from '@/lib/exceptions/game.exception'
import { AddressBook } from '../../addressbook'
import { server } from '../../../index'
import settings from '../../../settings'


const wipe = {
  settings: {
    parameters: {
      ip: true,
    }
  },
  delay: async (computer: Computer | null, executor: Computer, data: ProcessData) => {
    return Math.abs((( computer?.getCombinedHardwareStrength('HDD') || 5120 ) * settings.hddNerf) - ((executor.getCombinedHardwareStrength('CPU') || 124) / settings.cpuNerf)) * 1000
  },
  before: async (computer: Computer | null, executor: Computer, data: ProcessData) => {

    if (!computer || !executor.computer)
      throw new Error('invalid computer')

    let addressBook = new AddressBook(executor.computer?.userId);
    await addressBook.check()

    if (!await addressBook.findInAddressBook(data.ip) && executor.computerId !== computer.computerId)
      throw new GameException('you must hack this computer first')

    if (await computer.getLogCount() === 0)
      return false

    return true
  },
  after: async (computer: Computer | null, executor: Computer, data: ProcessData) => {
    if (!computer || !executor.computer)
      throw new Error('invalid computer')

    await server.prisma.logs.deleteMany({
      where: {
        computerId: computer.computerId,
        gameId: process.env.CURRENT_GAME_ID
      }
    })
  }
} satisfies Process
export default wipe
