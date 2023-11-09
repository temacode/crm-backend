import {User} from "..";

export interface TokenData extends User {
	iat: number;
	exp: number;
}
