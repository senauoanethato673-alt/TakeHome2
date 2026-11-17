// One book on the dashboard. Fewer than 2 copies = highlighted as low stock.
export const LOW_STOCK_LIMIT = 2;

function BookCard({ book }) {
  const isLow = book.quantity < LOW_STOCK_LIMIT;

  return (
    <div className={`book-card ${isLow ? "low" : ""}`}>
      {book.cover && <img src={book.cover} alt={`Cover of ${book.title}`} />}
      <div className="book-info">
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <p>{book.genre}</p>
        <p className="stock">
          In stock: {book.quantity}
          {isLow && <span className="low-tag">Low stock</span>}
        </p>
      </div>
    </div>
  );
}

export default BookCard;
