import { Process, ProcessData } from '@/lib/types/process.type'
import { Computer } from '../computer'
import GameException from '@/lib/exceptions/game.exception'
import { AddressBook } from '../addressbook'
import { server } from 'index'

const logout = {
  settings: {
    parameters: {
      ipAddress: true,
      sessionId: true
    }
  },
  before: async (computer: Computer | null, executor: Computer, data: ProcessData) => {

    if (!computer?.computer || !executor.computer)
      throw new Error('invalid computer')

    let addressBook = new AddressBook(executor.computer?.userId);
    await addressBook.check()

    if (!addressBook.findInAddressBook(data.ipAddress))
      throw new GameException('you must hack this computer first')

    let request = server.request[data.sessionId];

    if (!request.session.logins || !request.session.logins?.[executor.computerId]  || !request.session.logins[executor.computerId].find((val) => val.id === computer.computerId))
      return false;


    return true
  },
  after: async (computer: Computer | null, executor: Computer, data: ProcessData) => {
    if (!computer?.computer || !executor.computer)
      throw new Error('invalid computer')

    let request = server.request[data.sessionId];

    if (!request.session.logins || !request.session.logins?.[executor.computerId] || !request.session.logins[executor.computerId].find((val) => val.id === computer.computerId))
    {
      //
    } else
      request.session.logins[executor.computerId] = request.session.logins[executor.computerId].filter((val) => val.id !== computer.computerId)

    executor.log('remote session terminated', computer)
  }
} satisfies Process
export default logout
