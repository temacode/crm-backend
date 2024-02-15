import jwt from "jsonwebtoken";
import {User} from "../interfaces";

export const generateAccessToken = (user: User): string => {
	try {
		return jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: 3600});
	} catch (e) {
		console.log("Generate Access Token Error:", e);

		return "Invalid Access Token";
	}
};

export const generateRefreshToken = (user: User): string => {
	try {
		return jwt.sign(user, process.env.TOKEN_SECRET, {
			expiresIn: 604800,
		});
	} catch (e) {
		console.log("Generate Refresh Token Error:", e);

		return "Invalid Refresh Token";
	}
};
