import { useState, useEffect } from "react";
import { api } from "../api.js";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionHistory from "../components/TransactionHistory.jsx";

function Transactions({ user }) {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const isAdmin = user.role === "admin";

  // Reload both lists (stock changes after every transaction)
  function loadData() {
    api.getBooks().then(setBooks).catch((e) => setMessage({ text: e.message, type: "error" }));
    api.getTransactions().then(setTransactions).catch((e) => setMessage({ text: e.message, type: "error" }));
  }

  useEffect(loadData, []);

  async function addTransaction(data) {
    try {
      await api.addTransaction({ ...data, user_id: user.id });
      setMessage({ text: "Transaction recorded ✔", type: "success" });
      loadData();
      return true;
    } catch (e) {
      setMessage({ text: e.message, type: "error" });
      return false;
    }
  }

  async function deleteTransaction(id) {
    if (!window.confirm("Remove this log entry? (Stock will not change)")) return;
    try {
      await api.deleteTransaction(id);
      loadData();
    } catch (e) {
      setMessage({ text: e.message, type: "error" });
    }
  }

  return (
    <>
      <h1>Transactions</h1>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="card">
        <h2>{isAdmin ? "Add or deduct stock" : "Borrow a book"}</h2>
        <TransactionForm books={books} isAdmin={isAdmin} onSubmit={addTransaction} />
      </div>

      <div className="card">
        <h2>Transaction history</h2>
        <TransactionHistory transactions={transactions} isAdmin={isAdmin} onDelete={deleteTransaction} />
      </div>
    </>
  );
}

export default Transactions;
