import express, { IRoute } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { Route } from './app/route';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import expressSession from 'express-session';
import dotenv from 'dotenv';
import { ExpressError } from './app/errors';

dotenv.config({
	override: true
})

export const application = express();

export const routes = [] as IRoute[];

(async () => {

	application.use(helmet());
	application.use(morgan('dev'));
	application.use(compression());
	application.use(expressSession({ secret: process.env.SESSION_SECRET }));


	let files = await glob([path.join(__dirname, 'routes', '**/*.ts'), path.join(__dirname, 'routes', '**/*.js')]);

	/**
	 * Load Routes
	 */
	await Promise.all(files.map(async (file) => {
		let route = await require(file) as Route;
		route = (route as any).default || (route as any).route;

		if (!route?.settings)
			route.settings = {};

		if (route.settings?.route === undefined) {

			let parsedPath = path.parse(file);
			route.settings.route = file.replace(path.join(__dirname, 'routes'), '').replace(parsedPath.ext, '')
		}

		let newRoute = application.route(route.settings.route);

		if (route.get) {

			if (route?.settings?.groupOnly)
				newRoute.get((req, res, next) => {

					//check jwt here
				})

			newRoute.get(route.get);
		}


		if (route.post)
			newRoute.post(route.post);

		console.log(`registered ${typeof route.settings.route === 'string'
			? route.settings.route : JSON.stringify(route.settings.route, null, 2)}`)

		routes.push(newRoute);
	}));

	/**
	 * Error Handler
	 */
	application.use((err, req, res, next) => {
		if (typeof err === 'string')
			err = new ExpressError(err);

		if (err instanceof ExpressError) {
			res.status(err.status).send({
				body: req.body || {},
				parameters: req.params,
				headers: req.headers,
				message: err.toString()
			})
		} else {
			res.status(err.status).send({
				error: 'internal server error'
			})
		}
	});

	application.listen(process.env.PORT, () => {
		console.log(`online @ ${process.env.PUBLIC_URL}:${process.env.PORT}`)
	})
})();


