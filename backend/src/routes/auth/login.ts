import { Route } from '../../utils/types/route.type'

const login = {

  settings: {
    groupOnly: 'guest'
  },

  async get(req, res, error) {
    res.send({
      signin: 'penis'
    })
  }
} satisfies Route

export default login
