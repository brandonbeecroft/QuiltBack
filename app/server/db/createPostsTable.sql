CREATE TABLE posts(
    post_id SERIAL,
    post_title VARCHAR(50),
    post_date TIMESTAMP,
    deleted INT,
    owner_id SERIAL REFERENCES users (id),
    post_text VARCHAR,
    flagged BOOLEAN
);