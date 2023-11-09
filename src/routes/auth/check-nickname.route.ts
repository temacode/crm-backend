import {Client} from "pg";
import {Express} from "express";

export const checkNicknameRoute = (app: Express, postgres: Client, domain: string) => {
	app.post(`${domain}/check-nickname`, (req, res) => {
		if (!req.body.nickname || typeof req.body.nickname !== "string") {
			return res.status(400).send({error: "Имя пользователя не предоставлено"});
		}

		const nickname = req.body.nickname;

		postgres.query(`SELECT id FROM auth.users WHERE nickname = $1`, [nickname])
			.then(result => {
				if (result.rowCount > 0) {
					res.status(400).json({
						error: "Этот ник недоступен",
					});
				}
				res.status(200).json(true);
			})
			.catch(err => {
				console.log(err);
				res.status(500);
			})
			.finally(() => {
				res.send();
			});
	});
};
