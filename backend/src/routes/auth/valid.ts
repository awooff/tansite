import { Route } from '../../lib/types/route.type'
import { server } from '../../index'
import { Groups } from '@prisma/client'

const valid = {

  settings: {
    groupOnly: Groups.User,
    title: 'Valid',
    description: 'check if the user is logged in or not, will return session and userobject if true'
  },

  async get (req, res, error) {
    const user = server.prisma.user.findFirstOrThrow({
      where: {
        id: req.session.userId
      },
      select: {
        name: true,
        email: true,
        group: true,
        id: true,
        creation: true
      }
    })
    res.send({
      user,
      session: req.session
    })
  }
} satisfies Route

export default valid
