import { Route } from '../../utils/types/route.type'
import { Groups } from '@prisma/client';

const login = {

  settings: {
    groupOnly: Groups.Guest,
    title: "Register User",
    description: "will register the user to syscrack"
  },

  async get(req, res, error) {

    let { username, password, email } = req.body;


  }
} satisfies Route

export default login
