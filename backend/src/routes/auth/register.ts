import { Route } from '../../lib/types/route.type'
import { Groups } from '@prisma/client'
import { registerSchema } from '../../lib/schemas/register.schema'
import { server } from '../../index'
import bcrypt from 'bcrypt'
import { Preferences } from '@/lib/types/preferences.type'

const register = {

  settings: {
    groupOnly: Groups.Guest,
    title: 'Register User',
    description: 'will register the user to syscrack'
  },

  async post(req, res, error) {
    const body = await registerSchema.safeParseAsync(req.body)

    if (!body.success) { return error(body.error) }

    const { username, password, email } = body.data

    if ((await server.prisma.user.findFirst({
      where: {
        OR: [{
          name: username
        }, {
          email
        }]
      }
    })) != null) { return error('username or email has already been taken') }

    const salt = await bcrypt.genSalt()
    const saltedPassword = await bcrypt.hash(password, salt)

    const user = await server.prisma.user.create({
      data: {
        password: saltedPassword,
        salt,
        name: username,
        email
      }
    })

    // Create preferences for the user
    await server.prisma.preferences.create({
      data: {
        userId: user.id,
        gameId: process.env.CURRENT_GAME_ID,
        data: {
          tutorial: {
            currentTutorial: 'welcome',
            completed: false
          }
        } satisfies Preferences
      }
    })

    res.send({
      success: true
    })
  }

} satisfies Route

export default register
