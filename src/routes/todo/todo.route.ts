import {Express} from "express";
import {Client} from "pg";
import {API_V1} from "../../common";
import {getColumnsRoute} from "./get-columns";
import {addColumnRoute} from "./add-column";

export const todoRoute = (app: Express, postgres: Client) => {
	const domain = `/api/${API_V1}/todo`;

	addColumnRoute(app, postgres, domain);
	getColumnsRoute(app, postgres, domain);
};
