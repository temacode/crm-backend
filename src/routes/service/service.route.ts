import {Express} from "express";
import {Client} from "pg";
import {API_V1} from "../../common";
import {getUserRoute} from "./user";

export const serviceRoute = (app: Express, postgres: Client) => {
	const domain = `/api/${API_V1}/service`;

	getUserRoute(app, postgres, domain);
};
