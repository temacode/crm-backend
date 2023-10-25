import shajs from "sha.js";

export const encryptPasssword = (str: string) => {
	return shajs("sha256").update(str).digest("hex");
};
