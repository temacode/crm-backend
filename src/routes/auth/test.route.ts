import {Express, RequestHandler} from "express";
import {Client} from "pg";
import {LoginCredentials, TokenData, User} from "../../common";
import jwt from "jsonwebtoken";

export const authorizeToken: RequestHandler = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.status(401).send({error: "Отсутствует Bearer токен"});

	jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenData) => {
		if (err) {
			return res.status(401).send({error: "Токен пользователя недействителен"});
		}

		res.locals.user = tokenData as TokenData;

		next();

		/* User.findOne({login: (tokenData as TokenData).login}).exec((err, user) => {
			if (err) {
				console.warn(err);
				return res.status(500).send("Ошибка поиска пользователя");
			}

			if (!user) {
				return res.status(400).send("Пользователь не найден");
			}

			if (user.permissions !== Permissions.ADMIN) {
				return res.status(405).send("Недостаточно прав");
			}

			req.authenticatedUserData = user as UserCredentials;

			next();
		}); */
	});
};

export const testRoute = (app: Express, postgres: Client, domain: string) => {
	app.get(`/api/v1/test`, authorizeToken, (req, res) => {
		if (!res.locals.user) {
			return res.status(401).send({error: "Ошибка аутентификации"});
		}

		return res.status(200).send(new Date());
	});
};
