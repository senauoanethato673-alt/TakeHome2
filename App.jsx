import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BookManagement from "./pages/BookManagement.jsx";
import Transactions from "./pages/Transactions.jsx";
import UserManagement from "./pages/UserManagement.jsx";

function App() {
  // The logged-in user lives here. We also save it in localStorage so a refresh keeps you logged in.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("tolUser");
    return saved ? JSON.parse(saved) : null;
  });

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    localStorage.setItem("tolUser", JSON.stringify(loggedInUser));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("tolUser");
  }

  // If nobody is logged in, send them to the login page.
  // If the page is admin-only and the user is not an admin, send them to the dashboard.
  function guard(element, adminOnly = false) {
    if (!user) return <Navigate to="/users" replace />;
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
    return element;
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={guard(<Dashboard />)} />
          <Route path="/books" element={guard(<BookManagement />, true)} />
          <Route path="/transactions" element={guard(<Transactions user={user} />)} />
          <Route path="/users" element={<UserManagement user={user} onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
