import { Route } from '../../lib/types/route.type'
import { Groups } from '@prisma/client'
import { processCreateSchema } from '@/lib/schemas/process.schema'
import { ProcessType, getProcessZodObject } from '@/app/process'
import processes from '@/app/processes'
import { Computer, findComputer, getComputer } from '@/app/computer'
import { server } from '../../index'
import GameException from '@/lib/exceptions/game.exception'
import { Process, ProcessData, ProcessParameters  } from '@/lib/types/process.type'
import { isConnectedToMachine } from '@/lib/helpers'
import { Software } from '@/app/software'
import { SoftwareAction } from '@/lib/types/software.type'

const create = {

  settings: {
    groupOnly: Groups.User,
    title: 'Create Process',
    description: 'Will create a process'
  },

  async get (req, res, error) {
    const body = await processCreateSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)
    if(!req.session.userId) return error('no user')

    const { type, connectionId } = body.data

    if (processes[type as ProcessType] === undefined)
      return error('bad process type')

    const gameProcess = processes[type as ProcessType] as Process
    let validation = await getProcessZodObject(type as ProcessType)
    let input = await validation.safeParseAsync(body.data)

    if (!input.success)
      return error(input.error)

    let data = { ...input.data } as ProcessData

    if (gameProcess.settings?.parameters?.softwareId && data.softwareId && data.custom.action)  {
      
      let software = new Software(data.softwareId);
      await software.load();

      if (!software.software)
        throw new Error('bad software');

      let actions = (software.action?.settings?.parameters as any)[data.custom.action] as ProcessParameters

      if (actions) {
          validation = await getProcessZodObject(type as ProcessType, actions)
          input = await validation.safeParseAsync(body.data)

          if (!input.success)
            return error(input.error)

          data = { ...input.data } as ProcessData
      }
    }

    let target = null;
    if (!req.session.connections?.find((element) => element.id === connectionId))
      return error('not connected to that current computer')
    
    const executor = await getComputer(connectionId)

    if (!executor)
      throw new Error('bad computer')

    if (gameProcess?.settings?.parameters?.computer && data.computer)
      target = await getComputer(data.computer)

    if (gameProcess?.settings?.parameters?.ipAddress && data.ipAddress)
    {
         
      let computer = await findComputer(data.ipAddress)

      if (!computer)
        return error('bad computer')
      
      target = new Computer(computer.id, computer)
    }

    if (gameProcess.settings?.parameters?.sessionId)
      data.sessionId = req.sessionID

    if (target && !gameProcess.settings?.external && !isConnectedToMachine(req, executor, target)) 
      return error('your current computer must be connected to this computer')

    const before = await gameProcess.before(target, executor, {
      data,
      custom: data
    } as any)

    if (!before)
      throw new GameException('process failed to start')

    const delay = gameProcess.delay ? await gameProcess.delay(target, executor, {
      ...input.data,
      custom: input.data
    } as any) : 0

    const result = await server.prisma.process.create({
      data: {
        userId: req.session.userId,
        computerId:  executor.computerId,
        gameId: process.env.CURRENT_GAME_ID,
        type: type,
        ip: target ? target.ip : executor.ip,
        completion: new Date(Date.now() + delay),
        data: {
          ...input.data,
          custom: input.data
        }
      }
    })

    res.send({
      process: result
    })
  }
} satisfies Route

export default create
