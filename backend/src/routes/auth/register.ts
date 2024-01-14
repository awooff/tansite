import { Route } from '../../utils/types/route.type'
import { Groups } from '@prisma/client';

const register = {

  settings: {
    groupOnly: Groups.Guest,
    title: "Register User",
    description: "will register the user to syscrack"
  },

  async post(req, res, error) {

    let { username, password, email } = req.body;


  }
} satisfies Route

export default register
