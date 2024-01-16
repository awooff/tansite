import { Route } from '../../lib/types/route.type'
import { server } from '../../index'
import { Groups } from '@prisma/client'
import { getComputer } from '@/app/computer'
import { switchSchema } from '@/lib/schemas/switch.schema'

const local = {

  settings: {
    groupOnly: Groups.User,
    title: 'Switch Computer',
    description: 'Switch current computer to another computer'
  },

  async get (req, res, error) {
    const body = await switchSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)

    const { computerId } = body.data

    const result = await getComputer(computerId)

    if (result === null) { return error('computer does not exist') }

    if (result.computer.userId !== req.session.userId) { return error('user does not own this computer') }

    req.session.currentComputerId = result.computerId

    // logged new login
    result.log(`logged on at ${new Date(Date.now()).toString()}`)

    res.send({
      computer: result.computer
    })
  }
} satisfies Route

export default local
