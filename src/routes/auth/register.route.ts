import {Client} from "pg";
import {Express} from "express";
import {RegisterCredentialFields, RegisterCredentials, encryptPasssword} from "../../common";
import {PostgresError} from "../../postgres";

export const registerRoute = (app: Express, postgres: Client, domain: string) => {
	app.post(`${domain}/register`, (req, res) => {
		const registerCredentials: RegisterCredentials = req.body;

		const dataLoss = Object.values(RegisterCredentialFields).find(key => {
			if (!registerCredentials[key as keyof RegisterCredentials]) {
				return true;
			}

			return false;
		});

		if (dataLoss) {
			return res.status(400).send({error: "Не хватает данных"});
		}

		const passwordHash = encryptPasssword(registerCredentials.password);

		const query = {
			text: `
                INSERT INTO 
                    auth.users(
                        name, 
                        surname,
						email,
                        nickname, 
                        password
                    ) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *`,
			values: [
				registerCredentials.name,
				registerCredentials.surname,
				registerCredentials.email,
				registerCredentials.nickname,
				passwordHash,
			],
		};

		postgres.query(query.text, query.values)
			.then(() => {
				res.status(200);
			})
			.catch((err: PostgresError) => {
				switch (err.code) {
					case "23505": {
						res.status(400);
						res.json({
							error: "Пользователь с таким ником или почтой уже существует",
						});
						break;
					}
					default: {
						console.log("Запрос в БД выполнен с ошибкой", err);
						res.status(500);
						break;
					}
				}
			})
			.finally(() => {
				res.send();
			});
	});
};
