import {Express} from "express";
import {Client} from "pg";
import {authenticateToken} from "../../common";

export const testRoute = (app: Express, postgres: Client, domain: string) => {
	app.get(`/api/v1/test`, authenticateToken, (req, res) => {
		const query = {
			text: `
                ALTER TABLE 
                    todo.columns RENAME COLUMN position2 TO position`,
		};

		postgres.query(query.text)
			.catch(e => console.log(e))
			.then(() => {
				res.status(200).send();
			});
	});
};
