Добавить для конкретного столбца в таблице ограничение UNIQUE

```typescript
postgres.query(`ALTER TABLE auth.users ADD CONSTRAINT login_unique UNIQUE (login)`)
	.then(() => {
		res.status(200);
	})
	.catch((err) => {
		console.log(err);
		res.status(500);
	})
	.finally(() => {
		res.send();
	});
```

Создать таблицу, если такой не существует с автоматически увеличивающимся столбцом id и ограничение на уникальность столбца login

```typescript
postgres.query(
	`
            CREATE TABLE IF NOT EXISTS
                auth.users (
                    id serial,
                    name varchar(50) NOT NULL,
                    surname varchar(100) NOT NULL,
                    login varchar(50) NOT NULL,
                    password varchar(64) NOT NULL,
                    PRIMARY KEY (id)
                )
			CONSTRAINT login_unique UNIQUE (login)
            `,
)
	.then((result) => {
		console.log(result);
		res.status(200);
	})
	.catch((err) => {
		console.log(err);
		res.status(500);
	})
	.finally(() => {
		return res.send();
	});
```

```typescript
export function addColumn(postgres: Client) {
	return postgres.query(`ALTER TABLE auth.users
	ADD COLUMN email varchar(150), ADD CONSTRAINT email_unique UNIQUE (email);`);
}

export function makeEmailNotNUll(postgres: Client) {
	return postgres.query(`ALTER TABLE auth.users
	ALTER COLUMN email SET NOT NULL`);
}
```
