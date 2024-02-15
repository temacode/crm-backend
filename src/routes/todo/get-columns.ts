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
				res.status(200).send(result.rows);
			})
			.catch(err => {
				res.status(500).send({error: "Что-то пошло не так"});
			});
	});
};
