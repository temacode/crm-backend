import jwt from "jsonwebtoken";

export const generateAccessToken = (login: string): string => {
	try {
		return jwt.sign({login}, process.env.TOKEN_SECRET, {expiresIn: "10s"});
	} catch (e) {
		console.log(e);

		return "Invalid Token";
	}
};

export const generateRefreshToken = (login: string): string => {
	try {
		return jwt.sign({login}, process.env.TOKEN_SECRET, {
			expiresIn: "604800s",
		});
	} catch (e) {
		console.log("Generate Refresh Token Error", e);

		return "Invalid Token";
	}
};
