import { Groups, Route } from '../../utils/types/route.type'

const login = {

  settings: {
    groupOnly: Groups.USER,
    title: "Logout User",
    description: "will logout the user from syscrack"
  },

  async get(req, res, error) {
    res.send({
      signin: 'penis'
    })
  }
} satisfies Route

export default login
