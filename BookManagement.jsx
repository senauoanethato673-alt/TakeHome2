import { useState, useEffect } from "react";
import { api } from "../api.js";
import BookForm from "../components/BookForm.jsx";
import BookList from "../components/BookList.jsx";

function BookManagement() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  function loadBooks() {
    api.getBooks().then(setBooks).catch((e) => setMessage({ text: e.message, type: "error" }));
  }

  useEffect(loadBooks, []);

  // Each handler returns true/false so the form knows whether to clear itself
  async function addBook(book) {
    try {
      await api.addBook(book);
      setMessage({ text: "Book added 🌸", type: "success" });
      loadBooks();
      return true;
    } catch (e) {
      setMessage({ text: e.message, type: "error" });
      return false;
    }
  }

  async function updateBook(id, book) {
    try {
      await api.updateBook(id, book);
      setMessage({ text: "Book updated", type: "success" });
      loadBooks();
      return true;
    } catch (e) {
      setMessage({ text: e.message, type: "error" });
      return false;
    }
  }

  async function deleteBook(id) {
    try {
      await api.deleteBook(id);
      setMessage({ text: "Book deleted", type: "success" });
      loadBooks();
    } catch (e) {
      setMessage({ text: e.message, type: "error" });
    }
  }

  return (
    <>
      <h1>Book Management</h1>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="card">
        <h2>Add a new book</h2>
        <BookForm onSubmit={addBook} />
      </div>

      <div className="card">
        <h2>All books</h2>
        <BookList books={books} onUpdate={updateBook} onDelete={deleteBook} />
      </div>
    </>
  );
}

export default BookManagement;
