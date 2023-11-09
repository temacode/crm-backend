import {Client} from "pg";
import {Express, RequestHandler} from "express";
import {TokenData, generateAccessToken, generateRefreshToken} from "../../common";
import jwt from "jsonwebtoken";

export const authenticateRefreshToken: RequestHandler<{
	allowedToGenerate: boolean;
	tokenData: TokenData;
}> = (req, res, next) => {
	if (!req.cookies) {
		return res.status(401).send({error: "Отсутсвуют Cookies пользователя"});
	}

	const refreshToken = req.cookies["refreshToken"] as string;

	if (!refreshToken) return res.status(401).send({error: "Отсутствует токен"});

	jwt.verify(refreshToken, process.env.TOKEN_SECRET, (err, tokenData) => {
		if (err) {
			return res.status(401).send({error: "Токен пользователя недействителен"});
		}

		res.locals.tokenData = tokenData as TokenData;

		next();
	});
};

export const refreshTokenRoute = (app: Express, postgres: Client, domain: string) => {
	app.get(`${domain}/refresh-token`, authenticateRefreshToken, (req, res) => {
		const accessToken = generateAccessToken(res.locals.tokenData.nickname);
		const refreshToken = generateRefreshToken(res.locals.tokenData.nickname);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			maxAge: 31536000,
		})
			.status(200)
			.send({accessToken});
	});
};
