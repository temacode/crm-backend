import {Express, Request} from "express";
import {Client} from "pg";
import {authenticateToken} from "../../common";
import {PostgresError, resetAutoincrement} from "../../postgres";

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

		postgres.query(`
		CREATE TABLE IF NOT EXISTS 
				todo.columns (
					id serial,
					title varchar(50) NOT NULL,
					PRIMARY KEY (id),
					CONSTRAINT title_unique UNIQUE (title)
				);
		`);

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
		)
			.then(result => {
				res.status(200).json(result);
			})
			.catch((err: PostgresError) => {
				if (err.code === "23505") {
					res.status(500).json({
						error: "Колонка с таким названием уже существует",
					});

					return;
				}

				res.status(500).json({error: "Что-то пошло не так"});

				return resetAutoincrement(postgres, "todo", "columns", "columns_id_seq");
			})
			.finally(() => {
				return res.send();
			});
	});
};
