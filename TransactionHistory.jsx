// The transaction log table
function TransactionHistory({ transactions, isAdmin, onDelete }) {
  if (transactions.length === 0) return <p>No transactions yet.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Book</th><th>Type</th><th>Qty</th><th>By</th><th>Note</th>
            {isAdmin && <th></th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.created_at).toLocaleString()}</td>
              <td>{t.book_title}</td>
              <td>
                <span className={`badge ${t.type}`}>{t.type === "add" ? "Stock added" : "Borrowed"}</span>
              </td>
              <td>{t.type === "add" ? "+" : "-"}{t.quantity}</td>
              <td>{t.user_name || "System"}</td>
              <td>{t.note}</td>
              {isAdmin && (
                <td>
                  <button className="btn btn-danger btn-small" onClick={() => onDelete(t.id)}>Remove</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;
