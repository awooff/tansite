import { Route } from '../../lib/types/route.type'
import { Groups } from '@prisma/client';
import { registerSchema } from '../../lib/schemas/register.schema';
import { server } from '../../index';
import bcrypt from 'bcrypt';

const register = {

  settings: {
    groupOnly: Groups.Guest,
    title: "Register User",
    description: "will register the user to syscrack"
  },

  async post(req, res, error) {

    let body = await registerSchema.safeParseAsync(req.body)

    if (!body.success)
      return error(body.error)

    let { username, password, email } = body.data;

    if (!!await server.prisma.user.findFirst({
      where: {
        OR: [{
          name: username
        }, {
          email: email
        }]
      }
    }))
      return error('username or email has already been taken')

    let salt = await bcrypt.genSalt()
    let saltedPassword = await bcrypt.hash(password, salt);

    await server.prisma.user.create({
      data: {
        password: saltedPassword,
        salt: salt,
        name: username,
        email
      }
    })

    res.send({
      success: true
    })
  }

} satisfies Route

export default register;
