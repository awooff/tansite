import { Route } from '../../utils/types/route.type'
import { server } from '../../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { removeFromObject } from '../../utils/helpers';
import { Groups } from '@prisma/client';

const login = {

  settings: {
    groupOnly: Groups.Guest,
    title: "Login User",
    description: "will login the user to syscrack"
  },

  async post(req, res, next) {

    let { email, password } = req.body;

    //check if email exists
    let user = await server.prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (!user)
      return next("email doesn't exist")

    if (await bcrypt.hash(password, user.salt) !== user.password)
      return next("password incorrect")

    //reload the session
    await (new Promise((resolve) => {
      req.session.reload(resolve)
    }));

    //create a JWT Token
    let token = jwt.sign(
      {
        userId: user.id,
        userEmail: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )

    //delete previous sessions
    await server.prisma.session.deleteMany({
      where:
      {
        userId: user.id
      }
    });

    //create new session
    await server.prisma.session.create({
      data: {
        id: req.sessionID,
        userId: user.id,
        lastAction: new Date(Date.now())
      }
    })

    //set the session data
    req.session.userId = user.id;
    req.session.group = user.group;
    req.session.currentWebToken = token;

    //send it back
    res.send({
      user: removeFromObject(user, [
        "password",
        "salt"
      ]),
      sessionId: req.sessionID,
      token
    })
  }
} satisfies Route

export default login
