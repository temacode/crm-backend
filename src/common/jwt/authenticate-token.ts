import {TokenData} from "./token.interface";
import jwt from "jsonwebtoken";
import {RequestHandler, Request} from "express";

export const authenticateToken: RequestHandler = (req: Request & {authenticatedUserData?: any}, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.status(401).send();

	jwt.verify(token, process.env.TOKEN_SECRET, (jsonParseError, tokenData) => {
		if (jsonParseError) {
			return res.status(403).send("Токен пользователя недействителен");
		}

		/* Поиск пользователя по логину */
		/* User.findOne({login: (tokenData as TokenData).login})
			.exec()
			.then((user) => {
				if (!user) {
					return res.status(400).send("Пользователь не найден");
				} else {
					req.authenticatedUserData = user as UserCredentials;

					next();
				}
			})
			.catch((err) => {
				if (err) {
					return res.status(500).send("Ошибка поиска пользователя");
				}
			}); */
	});
};

export const authenticateAdminToken: RequestHandler = (req: Request & {authenticatedUserData?: any}, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.status(401).send();

	jwt.verify(token, process.env.TOKEN_SECRET, (jsonParseError, tokenData) => {
		if (jsonParseError) {
			return res.status(403).send("Токен пользователя недействителен");
		}

		/* User.findOne({login: (tokenData as TokenData).login})
			.exec()
			.then((user) => {
				if (!user) {
					return res.status(400).send("Пользователь не найден");
				}

				if (user.permissions !== Permissions.ADMIN) {
					return res.status(405).send("Недостаточно прав");
				}

				req.authenticatedUserData = user as UserCredentials;

				next();
			})
			.catch((err) => {
				if (err) {
					console.warn(err);
					return res.status(500).send("Ошибка поиска пользователя");
				}
			}); */
	});
};
