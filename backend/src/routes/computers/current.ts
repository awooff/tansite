import { Route } from '../../lib/types/route.type'
import { server } from '../../index'
import { Groups } from '@prisma/client'
import { getComputer } from '@/app/computer'

const current = {

  settings: {
    groupOnly: Groups.User,
    title: 'Current Computer',
    description: 'The users current local computer'
  },

  async get (req, res, error) {
    if (!req.session.currentComputerId) { return error('you do not have a current computer') }

    const result = await getComputer(req.session.currentComputerId)

    if (result === null) { return error('computer does not exist') }

    res.send({
      computer: result.computer
    })
  }
} satisfies Route

export default current
