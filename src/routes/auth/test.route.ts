import {Express} from "express";
import {Client} from "pg";
import {authenticateToken} from "../../common";

export const testRoute = (app: Express, postgres: Client, domain: string) => {
	app.get(`/api/v1/test`, authenticateToken, (req, res) => {
		if (!res.locals.user) {
			return res.status(401).send({error: "Ошибка аутентификации"});
		}

		return res.status(200).send(new Date());
	});
};
