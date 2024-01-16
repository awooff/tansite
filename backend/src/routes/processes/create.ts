import { Route } from '../../lib/types/route.type'
import { server } from '../../index'
import { Groups } from '@prisma/client'

const create = {

  settings: {
    groupOnly: Groups.User,
    title: 'Create Process',
    description: 'Will create a process on the current computer'
  },

  async get (req, res, error) {
    await server.prisma.session.deleteMany({
      where: {
        id: req.sessionID
      }
    })

    // destroy session data
    await new Promise((resolve) => req.session.destroy(resolve))
    // regenerate the session
    await new Promise((resolve) => req.session.regenerate(resolve))

    res.send({
      success: true
    })
  }
} satisfies Route

export default create
