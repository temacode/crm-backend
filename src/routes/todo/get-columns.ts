import {Express} from "express";
import {Client} from "pg";
import {authenticateToken} from "../../common";

export const getColumnsRoute = (app: Express, postgres: Client, domain: string) => {
	app.get(`${domain}/get-columns`, authenticateToken, (req, res) => {
		postgres.query(
			`
			SELECT * FROM todo.columns
		`
		)
			.then(result => {
				res.status(200).json({test: "test"});
			})
			.catch(err => {
				res.status(500).json({error: "Что-то пошло не так"});
			})
			.finally(() => {
				res.send();
			});
	});
};
