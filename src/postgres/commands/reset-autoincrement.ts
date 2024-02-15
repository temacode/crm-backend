import {Client} from "pg";

export function resetAutoincrement<T>(postgres: Client, schema: string, table: string, sequence: string, prevResult?: T): Promise<T> {
	return postgres
		.query(
			`
				BEGIN;
					-- protect against concurrent inserts while you update the counter
					LOCK TABLE ${schema}.${table} IN EXCLUSIVE MODE;
					-- Update the sequence
					SELECT setval('${schema}.${sequence}', COALESCE((SELECT MAX(id)+1 FROM ${schema}.${table}), 1), false);
				COMMIT;
				`
		)
		.then(() => {
			return prevResult as T;
		});
}
