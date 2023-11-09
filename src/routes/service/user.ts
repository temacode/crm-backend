import {Express} from "express";
import {Client} from "pg";
import {authenticateToken} from "../../common";

export const getUserRoute = (app: Express, postgres: Client, domain: string) => {
	app.get(`${domain}/user`, authenticateToken, (req, res) => {
		res.status(200).send(res.locals.user);
	});
};
