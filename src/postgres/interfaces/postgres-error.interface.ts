import {PostgressErrorCode} from "../types";

export interface PostgresError extends Error {
	code: PostgressErrorCode;
}
