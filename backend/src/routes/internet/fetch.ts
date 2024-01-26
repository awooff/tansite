import { Route } from '../../lib/types/route.type'
import { Groups } from '@prisma/client'
import { fetchSchema } from '@/lib/schemas/fetch.schema'
import { findComputer } from '@/app/computer'

const fetch = {

  settings: {
    groupOnly: Groups.User,
    title: 'Fetch Computer',
    description: 'Will fetch a computer through their IP address'
  },

  async get (req, res, error) {
    const body = await fetchSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)

    const { ip } = body.data

    let computer = await findComputer(ip)

    if (computer === null)
      return error('computer not found');

    res.send({
      computer: computer
    })
  }
} satisfies Route

export default fetch
