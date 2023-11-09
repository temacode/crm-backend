import {Express} from "express";
import {Client} from "pg";
import {API_V1} from "../../common";
import {registerRoute} from "./register.route";
import {loginRoute} from "./login.route";
import {testRoute} from "./test.route";
import {refreshTokenRoute} from "./refresh-token.route";
import {checkNicknameRoute} from "./check-nickname.route";

export const authRoute = (app: Express, postgres: Client) => {
	const domain = `/api/${API_V1}/auth`;

	registerRoute(app, postgres, domain);
	loginRoute(app, postgres, domain);
	testRoute(app, postgres, domain);
	refreshTokenRoute(app, postgres, domain);
	checkNicknameRoute(app, postgres, domain);
};
