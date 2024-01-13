import { ExpressError } from "../../app/errors";
import { Route } from "../../app/route";
import { routes } from '../../index';

const login = {

	settings: {
		groupOnly: 'guest'
	},

	async get(req, res, error) {

		res.send({
			signin: "penis"
		})
	},
} satisfies Route;

export default login;

