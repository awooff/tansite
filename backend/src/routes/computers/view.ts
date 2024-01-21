import { Route } from '../../lib/types/route.type'
import { server } from '../../index'
import { Groups } from '@prisma/client'
import { getComputer } from '@/app/computer'
import { switchSchema } from '@/lib/schemas/switch.schema'

const connect = {

  settings: {
    groupOnly: Groups.User,
    title: 'View A Computer',
    description: 'Must be a computer you own or you have a connection too'
  },

  async post(req, res, error) {
    const body = await switchSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)

    const { computerId } = body.data
    const computer = await getComputer(computerId)

    if (computer === null) { return error('computer does not exist') }

    if (computer.computer.userId !== req.session.userId) { return error('user does not own this computer') }

    res.send({
      computer: computer.computer
    })
  }
} satisfies Route

export default connect
