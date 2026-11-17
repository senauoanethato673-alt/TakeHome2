import { useState, useEffect } from "react";
import { api } from "../api.js";
import BookCard, { LOW_STOCK_LIMIT } from "../components/BookCard.jsx";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Runs once when the page opens
  useEffect(() => {
    api.getBooks()
      .then(setBooks)
      .catch(() => setError("Could not load books. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);
  const lowStock = books.filter((b) => b.quantity < LOW_STOCK_LIMIT);

  return (
    <>
      <h1>Dashboard</h1>
      <p className="subtitle">Current book availability at Tree of Life</p>

      {error && <div className="message error">{error}</div>}
      {loading && <p>Loading...</p>}

      {!loading && !error && (
        <>
          <div className="stats">
            <div className="stat"><div>Book titles</div><div className="number">{books.length}</div></div>
            <div className="stat"><div>Copies in stock</div><div className="number">{totalCopies}</div></div>
            <div className="stat warn"><div>Low stock titles</div><div className="number">{lowStock.length}</div></div>
          </div>

          {lowStock.length > 0 && (
            <div className="message error">
              ⚠️ Low stock (fewer than {LOW_STOCK_LIMIT} copies): {lowStock.map((b) => b.title).join(", ")}
            </div>
          )}

          <div className="book-grid">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
