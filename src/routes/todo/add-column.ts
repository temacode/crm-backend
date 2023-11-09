import {Express, Request} from "express";
import {Client} from "pg";
import {authenticateToken} from "../../common";

interface AddColumnRequest {
	title: string;
}

interface Column {
	id: number;
	title: string;
}

export const addColumnRoute = (app: Express, postgres: Client, domain: string) => {
	app.post(`${domain}/add-column`, authenticateToken, (req, res) => {
		if (!req.body.title) {
			res.status(400).json({error: "Не хватает данных"});
		}

		const columnTitle = req.body.title;

		postgres.query(
			`
			INSERT INTO 
				todo.columns(
					title
			) 
			VALUES ($1) 
			RETURNING *
		`,
			[columnTitle]
		);
	});
};
