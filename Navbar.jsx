import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function logout() {
    onLogout();
    navigate("/users");
  }

  return (
    <nav className="navbar">
      <div className="brand">🌸 Tree of Life Library</div>

      <div className="nav-links">
        {user && (
          <>
            <NavLink to="/" end>Dashboard</NavLink>
            {user.role === "admin" && <NavLink to="/books">Books</NavLink>}
            <NavLink to="/transactions">Transactions</NavLink>
          </>
        )}
        <NavLink to="/users">{user && user.role === "admin" ? "Users" : "Account"}</NavLink>
      </div>

      {user && (
        <div className="nav-user">
          <span>Hi, {user.name}</span>
          <button className="btn btn-light btn-small" onClick={logout}>Log out</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
