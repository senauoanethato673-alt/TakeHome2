-- Tree of Life Library - database schema (MySQL)
-- You do NOT have to run this by hand: db.js runs the same steps when the server starts.
-- It is here so markers can see the table design.

CREATE DATABASE IF NOT EXISTS tree_of_life;
USE tree_of_life;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  membership_id VARCHAR(30)  NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,          -- stored as a bcrypt hash
  role          ENUM('admin','member') NOT NULL DEFAULT 'member'
);

CREATE TABLE IF NOT EXISTS books (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  title    VARCHAR(200) NOT NULL,
  author   VARCHAR(150) NOT NULL,
  genre    VARCHAR(80)  NOT NULL,
  isbn     VARCHAR(20)  NOT NULL UNIQUE,
  quantity INT NOT NULL DEFAULT 0,              -- current stock level
  cover    VARCHAR(200)                         -- e.g. /covers/future-ceo.jpg
);

CREATE TABLE IF NOT EXISTS transactions (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  book_id    INT NOT NULL,
  user_id    INT NULL,
  type       ENUM('add','borrow') NOT NULL,     -- add = new stock, borrow = stock goes down
  quantity   INT NOT NULL,
  note       VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
