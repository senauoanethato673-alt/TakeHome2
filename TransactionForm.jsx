import { useState } from "react";

// Form to add stock (admin only) or record a borrowed book.
function TransactionForm({ books, isAdmin, onSubmit }) {
  const [bookId, setBookId] = useState("");
  const [type, setType] = useState(isAdmin ? "add" : "borrow");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!bookId) return setError("Please choose a book.");
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return setError("Quantity must be a whole number of 1 or more.");
    }

    const ok = await onSubmit({ book_id: Number(bookId), type, quantity: Number(quantity), note });
    if (ok) {
      setQuantity(1);
      setNote("");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="message error">{error}</div>}

      <div className="form-grid">
        <div>
          <label htmlFor="t-book">Book</label>
          <select id="t-book" value={bookId} onChange={(e) => setBookId(e.target.value)}>
            <option value="">-- choose a book --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>{b.title} (stock: {b.quantity})</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="t-type">Action</label>
          <select id="t-type" value={type} onChange={(e) => setType(e.target.value)}>
            {isAdmin && <option value="add">Add stock (new books arrived)</option>}
            <option value="borrow">Borrow (deduct stock)</option>
          </select>
        </div>

        <div>
          <label htmlFor="t-qty">Quantity</label>
          <input id="t-qty" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <div>
          <label htmlFor="t-note">Note (optional)</label>
          <input id="t-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Delivery from supplier" />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn" type="submit">Record transaction</button>
      </div>
    </form>
  );
}

export default TransactionForm;
