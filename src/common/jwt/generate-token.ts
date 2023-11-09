import jwt from "jsonwebtoken";
import {User} from "../interfaces";

export const generateAccessToken = (user: User): string => {
	try {
		return jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: "3600s"});
	} catch (e) {
		console.log(e);

		return "Invalid Token";
	}
};

export const generateRefreshToken = (user: User): string => {
	try {
		return jwt.sign(user, process.env.TOKEN_SECRET, {
			expiresIn: "604800s",
		});
	} catch (e) {
		console.log("Generate Refresh Token Error", e);

		return "Invalid Token";
	}
};
