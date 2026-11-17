// server.js - starts the Express app
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");

const app = express();

// Middleware
app.use(cors());          // lets the React app (port 5173) call this API (port 5000)
app.use(express.json());  // reads JSON bodies sent with fetch()

// Routes
app.use("/books", require("./routes/books"));
app.use("/users", require("./routes/users"));
app.use("/transactions", require("./routes/transactions"));

app.get("/", (req, res) => res.json({ message: "Tree of Life Library API is running" }));

// Catch-all error handler so one bad request does not crash the server
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "That value already exists (duplicate ISBN or membership ID)." });
  }
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("Could not start. Check your MySQL details in backend/.env\n", err.message);
    process.exit(1);
  });
