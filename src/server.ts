import express, {Express} from "express";
import dotenv from "dotenv";
import {Client} from "pg";
import {authRoute, serviceRoute, todoRoute} from "./routes";
import cookieParser from "cookie-parser";
const postgres = new Client({
	user: "artem",
	password: "",
	database: "artemcrm",
	port: 5432,
});

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

postgres.connect().then(
	() => {
		console.log("\nПодключение к PostgreSQL успешно установлено");

		authRoute(app, postgres);
		todoRoute(app, postgres);
		serviceRoute(app, postgres);

		app.listen(port, () => {
			console.log(`\nСервер успешно запущен по адресу http://localhost:${port}\n`);
		});
	},
	() => {
		console.log("Не удалось установить подключение к PostgresSQL");
	}
);
