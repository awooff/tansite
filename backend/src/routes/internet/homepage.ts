import { Route } from '../../lib/types/route.type'
import { Groups } from '@prisma/client'
import { fetchSchema } from '@/lib/schemas/fetch.schema'
import { ComputerData, findComputer } from '@/app/computer'
import { removeFromObject } from '@/lib/helpers'
import { AddressBook } from '@/app/addressbook'
import markdownit from 'markdown-it'
import fs from 'fs'

const fetch = {

  settings: {
    groupOnly: Groups.User,
    title: 'View Homepage',
    description: 'Used in the internet browser, displays the computers homepage'
  },

  async post (req, res, error) {
    const body = await fetchSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)

    const { ip } = body.data
    const computer = await findComputer(ip)
    const md = markdownit({
      html: true,
      linkify: true,
      typographer: true
    })
    
    if (computer === null)
      return error('computer not found');

    let data = computer.data as ComputerData

    if (!req.session.userId)
      throw new Error('invalid session')

    let addressBook = new AddressBook(req.session.userId)
    await addressBook.check();
    
    res.send({
      computer: removeFromObject(computer, ['software', 'hardware', 'process']),
      markdown: md.render(data.homepage ? fs.readFileSync(process.cwd() + '/resources/homepages/' + data.homepage.replace(/\/\\\./g, '') + '.md', {
        encoding: 'utf-8'
      }) : data.markdown || fs.readFileSync(process.cwd() + '/resources/homepages/default.md', {
        encoding: 'utf-8'
      }), {
        computer: computer,
        access: await addressBook.get(ip) || undefined
      }),
      access: await addressBook.get(ip) || undefined,
      title: data.title || "Unknown Computer"
    })
  }
} satisfies Route

export default fetch
