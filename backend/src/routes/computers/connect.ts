import { Route } from '../../lib/types/route.type'
import { server } from '../../index'
import { Groups } from '@prisma/client'
import { getComputer } from '@/app/computer'
import { switchSchema } from '@/lib/schemas/switch.schema'

const connect = {

  settings: {
    groupOnly: Groups.User,
    title: 'Connect To Local Computer',
    description: 'Switch current computer to another computer'
  },

  async post(req, res, error) {
    const body = await switchSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)

    const { computerId } = body.data

    const result = await getComputer(computerId)

    if (result === null) { return error('computer does not exist') }

    if (result.computer.userId !== req.session.userId) { return error('user does not own this computer') }

    req.session.connections = req.session.connections || []

    if (req.session.connections.filter((that) => that.id === result.computerId).length !== 0)
      return error('already connected4')

    req.session.connections.push(result.computer)
    req.session.save()

    // logged new login
    result.log(`logged on at ${new Date(Date.now()).toString()}`)

    res.send({
      computer: result.computer
    })
  }
} satisfies Route

export default connect
