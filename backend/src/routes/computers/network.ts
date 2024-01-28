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

  async post(req, res, error) {

    const body = await paginationSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)

    const { page } = body.data

    let computers = await server.prisma.computer.findMany({
      where: {
        userId: req.session.userId
      },
      include: {
        hardware: true,
        process: true,
        software: true
      },
      skip: (page) * 32,
      take: 32
    })

    computers = computers.map((computer) => {
      if (!req.session.connections?.find((val) => val.id === computer.id))
        computer['software'] = []
      return computer
    })

    const count = await server.prisma.computer.count({
      where: {
        userId: req.session.userId
      }
    })

    res.send({
      computers,
      connections: req.session.connections?.slice(0 * page, 64),
      page,
      count: computers.length,
      pageMax: Math.floor(count / 64) + 1
    })
  }
} satisfies Route

export default network
