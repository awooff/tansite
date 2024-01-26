import { Route } from '../../lib/types/route.type'
import { Groups } from '@prisma/client'
import { Computer,findComputer, getComputer } from '@/app/computer'
import { isConnectedToMachine, removeFromObject } from '@/lib/helpers'
import { connectionSchema } from '@/lib/schemas/connection.schema'

const fetch = {

  settings: {
    groupOnly: Groups.User,
    title: 'Fetch Computer',
    description: 'Used to externally view a computer, you must already be logged into that computer and have it in your address book'
  },

  async get (req, res, error) {
  const body = await connectionSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)
    if(!req.session.userId) return error('no user')

    const { ip, connectionId } = body.data
    const computer = await findComputer(ip)

    if (!computer)
      return error('computer invalid')

    if (!req.session.connections?.find((element) => element.id === connectionId))
      return error('not connected to that current computer')

    let target = null;
    if (!req.session.connections?.find((element) => element.id === connectionId))
      return error('not connected to that current computer')
    
    const executor = await getComputer(connectionId)

    if (!executor)
      throw new Error('bad computer')

    target = new Computer(computer?.id, computer)

    if (!isConnectedToMachine(req, executor, target))
      return error('your current computer must be connected to this computer')
  
    res.send({
      computer: removeFromObject(target.computer, ['process']),
      logs: await target.getLogs()
    })
  }
} satisfies Route

export default fetch