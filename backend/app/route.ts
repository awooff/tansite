import { Response, Request, RequestHandler } from "express";
import { ExpressError } from "./errors";


export interface Route {
	settings?: {
		groupOnly?: 'user' | 'guest' | 'admin';
		route?: string | string[];
	},

	get?: RequestHandler;

	post?: RequestHandler;
}
