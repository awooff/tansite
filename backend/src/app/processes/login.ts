import { Process, ProcessData } from '@/lib/types/process.type'
import { Computer } from '../computer'
import GameException from '@/lib/exceptions/game.exception'
import { AddressBook } from '../addressbook'
import { server } from 'index'

const login = {
  settings: {
    parameters: {
      ip: true,
      sessionId: true
    }
  },
  before: async (computer: Computer | null, executor: Computer, data: ProcessData) => {

    if (!computer || !executor.computer)
      throw new Error('invalid computer')

    if (computer.computerId === executor.computerId)
      throw new GameException('cannot logout of the same computer you own')
    
    let addressBook = new AddressBook(executor.computer?.userId);
    await addressBook.check()

    if (!addressBook.findInAddressBook(data.ip))
      throw new GameException('you must hack this computer first')

    return true
  },
  after: async (computer: Computer | null, executor: Computer, data: ProcessData) => {
    if (!computer?.computer || !executor.computer)
      throw new Error('invalid computer')

    let req = server.request[data.sessionId];

    req.session.logins = req.session.logins || {}
    req.session.logins[executor.computerId] = req.session.logins[executor.computerId] || []
    req.session.logins[executor.computerId].push(computer.computer)
    req.session.save()

    computer.log('remote session created', executor)
    executor.log('remote session handshake', computer)
  }
} satisfies Process
export default login
