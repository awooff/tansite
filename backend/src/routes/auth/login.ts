import { Groups, Route } from '../../utils/types/route.type'

const login = {

  settings: {
    groupOnly: Groups.GUEST,
    title: "Login User",
    description: "will login the user to syscrack"
  },

  async get(req, res, error) {
    res.send({
      signin: 'penis'
    })
  }
} satisfies Route

export default login
