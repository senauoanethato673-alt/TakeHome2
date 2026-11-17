import { useState } from "react";
import BookForm from "./BookForm.jsx";

// Shows every book. Each row has "Update" (opens an edit form) and "Delete".
function BookList({ books, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null); // which book is being edited (null = none)

  async function saveEdit(id, updatedBook) {
    const ok = await onUpdate(id, updatedBook);
    if (ok) setEditingId(null);
    return ok;
  }

  if (books.length === 0) return <p>No books yet. Add your first one above 🌸</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th></th><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) =>
            editingId === book.id ? (
              <tr key={book.id}>
                <td colSpan="7">
                  <h3>Editing: {book.title}</h3>
                  <BookForm
                    initial={book}
                    submitLabel="Save changes"
                    onSubmit={(data) => saveEdit(book.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                </td>
              </tr>
            ) : (
              <tr key={book.id}>
                <td>{book.cover && <img className="thumb" src={book.cover} alt="" />}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-light btn-small" onClick={() => setEditingId(book.id)}>Update</button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => {
                        if (window.confirm(`Delete "${book.title}"?`)) onDelete(book.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
