import { Route } from '../../lib/types/route.type'
import { Groups } from '@prisma/client'
import { fetchSchema } from '@/lib/schemas/fetch.schema'
import { ComputerData, findComputer } from '@/app/computer'
import { removeFromObject } from '@/lib/helpers'

const fetch = {

  settings: {
    groupOnly: Groups.User,
    title: 'View Homepage',
    description: 'Used in the internet browser, displays the computers homepage'
  },

  async get (req, res, error) {
    const body = await fetchSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)

    const { ip } = body.data
    const computer = await findComputer(ip)

    if (computer === null)
      return error('computer not found');

    let data = computer.data as ComputerData
    
    res.send({
      computer: removeFromObject(computer, ['software', 'hardware', 'process']),
      markdown: data.markdown,
      title: data.title || "Unknown Computer"
    })
  }
} satisfies Route

export default fetch
