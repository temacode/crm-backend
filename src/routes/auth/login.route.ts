import {Client, QueryResult} from "pg";
import {Express} from "express";
import {LoginCredentials, PrivateUser, User, encryptPasssword, generateAccessToken, generateRefreshToken} from "../../common";

interface LoginResponse extends User {
	accessToken: string;
}

export const loginRoute = (app: Express, postgres: Client, domain: string) => {
	app.post<LoginCredentials>(`${domain}/login`, (req, res) => {
		const {email, password} = req.body;

		if (!email || !password) {
			res.status(400).send("Не хватает логина или пароля");
		}

		postgres.query(
			`
			SELECT 
				*
			FROM 
				auth.users 
			WHERE 
				email = $1
			`,
			[email]
		)
			.then((result: QueryResult<PrivateUser>) => {
				if (result.rowCount === 0) {
					res.status(400).json({
						error: "Такой пользователь не найден",
					});
				}

				let user: User;

				{
					// Создание пользователя с открытым паролем (privateUser) только
					// в одном блоке для исключения возможности использовать его дальше этого блока
					let privateUser = result.rows[0];
					const passwordHash = encryptPasssword(password);

					if (privateUser.password !== passwordHash) {
						res.status(400).json({
							error: "Неверный пароль",
						});
					}

					user = {
						id: privateUser.id,
						name: privateUser.name,
						surname: privateUser.surname,
						nickname: privateUser.nickname,
						email: privateUser.email,
					};
				}

				const accessToken = generateAccessToken(user);
				const refreshToken = generateRefreshToken(user);

				const loginResponse: LoginResponse = {
					...user,
					accessToken,
				};
				res.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					maxAge: 31536000,
				})
					.status(200)
					.json(loginResponse);
			})
			.catch(err => {
				if (err) {
					console.log(err);
				}
				res.status(500);
			})
			.finally(() => {
				res.send();
			});
	});
};
