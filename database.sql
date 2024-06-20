CREATE TABLE users (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY;
	username varchar(50) NOT NULL,
	email varchar(100) NOT NULL UNIQUE,
	password varchar(100) NOT NULL,
	forgotpasswordcode varchar(6),
	expirationtimeinunix varchar(40)
)

CREATE TABLE tasks (
	task_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	task_name varchar(20) NOT NULL,
	task_text varchar(60),
	user_id uuid,
	FOREIGN KEY (user_id) REFERENCES users(id)
)

CREATE TABLE notes (
	notes_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	notes_title varchar(50) NOT NULL,
	notes_text varchar(255) NOT NULL,
	user_id uuid,
	timestamp varchar(100) DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id)
)

CREATE TABLE notification (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title varchar(100),
    message varchar(500),
    timestamp varchar(50) DEFAULT CURRENT_TIMESTAMP
)