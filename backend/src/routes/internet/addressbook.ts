import { Route } from '../../lib/types/route.type'
import { Groups } from '@prisma/client'
import { paginationSchema } from '@/lib/schemas/pagination.schema'
import { AddressBook } from '@/app/addressbook'

const addressBook = {

  settings: {
    groupOnly: Groups.User,
    title: 'Get User Address Book',
    description: 'Will fetch a users address book, is paged'
  },

  async get (req, res, error) {
    const body = await paginationSchema.safeParseAsync(req.body)

    if (!body.success) return error(body.error)

    const { page } = body.data

    if (!req.session.userId)
      throw new Error('no userid')
    
    let addressBook = new AddressBook(req.session.userId);
    await addressBook.check();

    let results = await addressBook.fetch(64, page)
  
    
    res.send({
      success: true,
      addresses: results
    })
  }
} satisfies Route

export default addressBook
