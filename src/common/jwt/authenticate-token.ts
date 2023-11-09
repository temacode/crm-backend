import {TokenData} from "./token.interface";
import jwt from "jsonwebtoken";
import {RequestHandler} from "express";
import {User} from "..";

export const authenticateToken: RequestHandler = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.status(401).send({error: "Отсутствует Bearer токен"});

	jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenData) => {
		if (err) {
			return res.status(401).send({error: "Токен пользователя недействителен"});
		}

		const data = tokenData as TokenData;

		const user: User = {
			id: data.id,
			name: data.name,
			surname: data.surname,
			nickname: data.nickname,
			email: data.email,
		};

		res.locals.user = user;

		next();
	});
};

/* export const authenticateToken: RequestHandler = (req: Request & {authenticatedUserData?: any}, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.status(401).send();

	jwt.verify(token, process.env.TOKEN_SECRET, (jsonParseError, tokenData) => {
		if (jsonParseError) {
			return res.status(403).send("Токен пользователя недействителен");
		}
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
	});
}; */
