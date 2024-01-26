import { Route } from '../../lib/types/route.type'
import { Groups } from '@prisma/client'
import { processSchema } from '@/lib/schemas/process.schema'
import { ProcessType, getProcessZodObject } from '@/app/process'
import processes from '@/app/processes'
import { getComputer } from '@/app/computer'
import { server } from '../../index'
import GameException from '@/lib/exceptions/game.exception'

const create = {

  settings: {
    groupOnly: Groups.User,
    title: 'Create Process',
    description: 'Will create a process'
  },

  async get (req, res, error) {
    const body = await processSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)
    if(!req.session.userId) return error('no user')

    const { type } = body.data

    if (processes[type as ProcessType] === undefined)
      return error('bad process type')

    let gameProcess = processes[type as ProcessType]
    let validation = await getProcessZodObject(type as ProcessType)
    const input = await validation.safeParseAsync(body.data)
    
    if (!input.success)
      return error(input.error)

    let targetComputer = null;

    if (gameProcess?.settings?.parameters?.computer)
      targetComputer = await getComputer((input as any).data.computerId)

    let before = await gameProcess.before(targetComputer,  targetComputer as any, input.data as any)

    if (!before)
      throw new GameException('process failsed to start')

    let delay = await gameProcess.delay(targetComputer, targetComputer as any, input.data as any)

    if (!targetComputer)
      return error('bad')

    let result = await server.prisma.process.create({
      data: {
        userId: req.session.userId,
        computerId: targetComputer.computerId,
        gameId: process.env.CURRENT_GAME_ID,
        type: type,
        completion: new Date(Date.now() + delay),
        data: input.data
      }
    })

    res.send({
      process: result
    })
  }
} satisfies Route

export default create
