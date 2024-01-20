import { Route } from '../../lib/types/route.type'
import { server } from '../../index'
import { Groups } from '@prisma/client'
import { getComputer } from '@/app/computer'

const current = {

  settings: {
    groupOnly: Groups.User,
    title: 'Current Computers',
    description: 'Returns the current computers the user is connected too'
  },

  async get(req, res, error) {

    if (!req.session?.connections || req.session?.connections?.length === 0)
      return error('no connections')

    res.send({
      computers: req.session?.connections
    })
  }
} satisfies Route

export default current
