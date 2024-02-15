import {Express} from "express";
import {Client} from "pg";
import {authenticateToken} from "../../common";
import {resetAutoincrement} from "../../postgres";

export const deleteColumnRoute = (app: Express, postgres: Client, domain: string) => {
	app.delete(`${domain}/delete-column`, authenticateToken, (req, res) => {
		if (!req.body.columnId) {
			res.status(400).json({error: "Не хватает данных"});
		}

		const columnId = req.body.columnId;

		return postgres
			.query(
				`
			DELETE FROM todo.columns WHERE id = $1
		`,
				[columnId]
			)
			.then(result => resetAutoincrement(postgres, "todo", "columns", "columns_id_seq", result))
			.then(result => {
				res.status(200).json(result.rows);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: "Что-то пошло не так"});
			})
			.finally(() => {
				res.send();
			});
	});
};
