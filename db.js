export const sql = `
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
	name VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
	phone VARCHAR(30) UNIQUE,
	role INTEGER NOT NULL,
	status INTEGER NOT NULL DEFAULT 0,
    created_on DATE NOT NULL DEFAULT NOW(),
	created_by VARCHAR(30) NOT NULL,
	updated_on DATE NOT NULL DEFAULT NOW(),
	updated_by VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS address(
	id SERIAL PRIMARY KEY,
	users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	room VARCHAR(100) NOT NULL,
	floor VARCHAR(100) NOT NULL,
	building VARCHAR(100) NOT NULL,
	estate VARCHAR(100) NOT NULL,
	street VARCHAR(100) NOT NULL,
	district VARCHAR(100) NOT NULL,
	sub_district VARCHAR(100) NOT NULL,
	region VARCHAR(100) NOT NULL,
	created_on DATE NOT NULL DEFAULT NOW(),
	created_by VARCHAR(30) NOT NULL,
	updated_on DATE NOT NULL DEFAULT NOW(),
	updated_by VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS event(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	description text NOT NULL,
	photo BYTEA,
	status INTEGER NOT NULL,
	created_on DATE NOT NULL,
	created_by VARCHAR(30) NOT NULL,
	updated_on DATE NOT NULL,
	updated_by VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS event_timeslot(
	id SERIAL PRIMARY KEY,
	event_id INTEGER REFERENCES event(id) ON DELETE CASCADE,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	status INTEGER NOT NULL,
	created_on DATE NOT NULL,
	created_by VARCHAR(30) NOT NULL,
	updated_on DATE NOT NULL,
	updated_by VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS souvenir(
	id SERIAL PRIMARY KEY,
	event_id INTEGER REFERENCES event(id) ON DELETE CASCADE,
	name VARCHAR(100) NOT NULL,
	description VARCHAR(300),
	photo BYTEA,
	price FLOAT NOT NULL,
	quantity INTEGER NOT NULL,
	status INTEGER NOT NULL,
	created_on DATE NOT NULL,
	created_by VARCHAR(30) NOT NULL,
	updated_on DATE NOT NULL,
	updated_by VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_invoice(
	id SERIAL PRIMARY KEY,
	event_id INTEGER REFERENCES event(id) ON DELETE CASCADE,
	users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	address_id INTEGER REFERENCES address(id) ON DELETE CASCADE,
	transaction_id VARCHAR(100) NOT NULL,
	payment_time DATE NOT NULL,
	status INTEGER NOT NULL,
	created_on DATE NOT NULL,
	created_by VARCHAR(30) NOT NULL,
	updated_on DATE NOT NULL,
	updated_by VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS event_order(
	id SERIAL PRIMARY KEY,
	payment_invoice INTEGER REFERENCES payment_invoice(id) ON DELETE CASCADE,
	event_timeslot_id INTEGER REFERENCES event_timeslot(id) ON DELETE CASCADE,
	status INTEGER NOT NULL,
	created_on DATE NOT NULL,
	created_by VARCHAR(30) NOT NULL,
	updated_on DATE NOT NULL,
	updated_by VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS souvenir_order(
	id SERIAL PRIMARY KEY,
	payment_invoice INTEGER REFERENCES payment_invoice(id) ON DELETE CASCADE,
	souvenir INTEGER REFERENCES souvenir(id) ON DELETE CASCADE,
	price FLOAT NOT NULL,
	quantity INTEGER NOT NULL,
	status INTEGER NOT NULL,
	created_on DATE NOT NULL,
	created_by VARCHAR(30) NOT NULL,
	updated_on DATE NOT NULL,
	updated_by VARCHAR(30) NOT NULL
);
`