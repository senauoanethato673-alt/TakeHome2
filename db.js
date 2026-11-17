// db.js - connects to MySQL, creates the tables, and adds starter data.
require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const DB_NAME = process.env.DB_NAME || "tree_of_life";

const dbSettings = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

// "pool" = a small group of reusable connections. Routes import this.
let pool;

async function initDb() {
  // Step 1: make sure the database exists
  const first = await mysql.createConnection(dbSettings);
  await first.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await first.end();

  // Step 2: open the pool that the rest of the app uses
  pool = mysql.createPool({ ...dbSettings, database: DB_NAME, connectionLimit: 10 });

  // Step 3: create tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      membership_id VARCHAR(30) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','member') NOT NULL DEFAULT 'member'
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      author VARCHAR(150) NOT NULL,
      genre VARCHAR(80) NOT NULL,
      isbn VARCHAR(20) NOT NULL UNIQUE,
      quantity INT NOT NULL DEFAULT 0,
      cover VARCHAR(200)
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      book_id INT NOT NULL,
      user_id INT NULL,
      type ENUM('add','borrow') NOT NULL,
      quantity INT NOT NULL,
      note VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`);

  await seedData();
  console.log("Database ready");
}

// Starter data - only added when the tables are empty.
async function seedData() {
  const [users] = await pool.query("SELECT COUNT(*) AS n FROM users");
  if (users[0].n === 0) {
    const hash = await bcrypt.hash("2003march", 10);
    await pool.query(
      "INSERT INTO users (name, membership_id, password, role) VALUES (?, ?, ?, ?)",
      ["Library Admin", "901020664", hash, "admin"]
    );
    console.log("Admin created -> membership ID 901020664");
  }

  const [books] = await pool.query("SELECT COUNT(*) AS n FROM books");
  if (books[0].n === 0) {
    // NOTE: the ISBNs below are sample values for the demo.
    const starter = [
      ["The Future CEO Is Female", "Rowena Rousseau", "Business", "9780000000011", 5, "/covers/future-ceo.jpg"],
      ["Single. On Purpose.", "John Kim", "Self-Help", "9780000000028", 1, "/covers/single-on-purpose.jpg"],
      ["The Millionaire Mind", "Thomas J. Stanley", "Finance", "9780000000035", 4, "/covers/millionaire-mind.jpg"],
      ["The Power of Action", "Brian Hayes", "Self-Help", "9780000000042", 3, "/covers/power-of-action.jpg"],
      ["The Power of Discipline", "Daniel Walter", "Self-Help", "9780000000059", 1, "/covers/power-of-discipline.jpg"],
      ["Life After 21 Days", "Plancourr", "Self-Help", "9780000000066", 6, "/covers/life-after-21-days.jpg"],
    ];
    await pool.query(
      "INSERT INTO books (title, author, genre, isbn, quantity, cover) VALUES ?",
      [starter]
    );
    console.log("Starter books added");
  }
}

// Routes call getPool() to run queries.
function getPool() {
  return pool;
}

module.exports = { initDb, getPool };
