import { Route } from '../../lib/types/route.type'
import { server } from '../../index'
import { Groups } from '@prisma/client'
import { paginationSchema } from '@/lib/schemas/pagination.schema'

const network = {

  settings: {
    groupOnly: Groups.User,
    title: 'Computer Network',
    description: 'All the users current computers'
  },

  async get(req, res, error) {
    const body = await paginationSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)

    const { page } = body.data

    let computers = await server.prisma.computer.findMany({
      where: {
        userId: req.session.userId
      },
      include: {
        hardware: true
      },
      skip: page * 32,
      take: 32
    })

    let count = await server.prisma.computer.count({
      where: {
        userId: req.session.userId
      },
    })

    res.send({
      computers: computers,
      page: page,
      count: computers.length,
      pageMax: Math.floor(count / 64) + 1
    })
  }
} satisfies Route

export default network
