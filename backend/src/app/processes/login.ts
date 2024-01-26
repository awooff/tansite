import { Process, ProcessData, ProcessSettings } from '@/lib/types/process.type'
import { Computer } from '../computer'
import GameException from '@/lib/exceptions/game.exception'
import { AddressBook } from '../addressbook'
import { server } from 'index'
import e from 'express'

const login = {
  settings: {
    parameters: {
      ipAddress: true,
      sessionId: true
    }
  },
  before: async (computer: Computer | null, executor: Computer, data: ProcessData) => {

    if (!computer || !executor.computer)
      throw new Error('invalid computer')

    let addressBook = new AddressBook(executor.computer?.userId);
    await addressBook.check()

    if (!addressBook.findInAddressBook(data.ipAddress))
      throw new GameException('you must hack this computer first')

    return true
  },
  after: async (computer: Computer | null, executor: Computer, data: ProcessData) => {
    if (!computer?.computer || !executor.computer)
      throw new Error('invalid computer')

    let request = server.request[data.sessionId];
    request.session.logins = request.session.logins || {}
    request.session.logins[executor.computerId] = request.session.logins[executor.computerId] || []
    request.session.logins[executor.computerId].push(computer.computer)

    computer.log('remote session created', executor)
    executor.log('remote session handshake', computer)
  }
} satisfies Process
export default login
