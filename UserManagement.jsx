import { useState, useEffect } from "react";
import { api } from "../api.js";
import LoginForm from "../components/LoginForm.jsx";
import UserForm from "../components/UserForm.jsx";
import UserList from "../components/UserList.jsx";

function UserManagement({ user, onLogin }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  function loadUsers() {
    api.getUsers().then(setUsers).catch((e) => setMessage({ text: e.message, type: "error" }));
  }

  // Only admins need the user list
  useEffect(() => {
    if (user && user.role === "admin") loadUsers();
  }, [user]);

  async function addUser(data) {
    try {
      await api.addUser(data);
      setMessage({ text: "User added", type: "success" });
      loadUsers();
      return true;
    } catch (e) {
      setMessage({ text: e.message, type: "error" });
      return false;
    }
  }

  async function updateUser(id, data) {
    try {
      await api.updateUser(id, data);
      setMessage({ text: "User updated", type: "success" });
      loadUsers();
      return true;
    } catch (e) {
      setMessage({ text: e.message, type: "error" });
      return false;
    }
  }

  async function deleteUser(id) {
    try {
      await api.deleteUser(id);
      setMessage({ text: "User deleted", type: "success" });
      loadUsers();
    } catch (e) {
      setMessage({ text: e.message, type: "error" });
    }
  }

  // 1. Not logged in -> show the login form
  if (!user) return <LoginForm onLogin={onLogin} />;

  // 2. Logged in as a normal member -> simple account card
  if (user.role !== "admin") {
    return (
      <div className="card">
        <h2>My account</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Membership ID:</strong> {user.membership_id}</p>
        <p><strong>Role:</strong> <span className="badge member">member</span></p>
      </div>
    );
  }

  // 3. Admin view -> add / update / delete users
  return (
    <>
      <h1>User Management</h1>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="card">
        <h2>Add a new user</h2>
        <UserForm onSubmit={addUser} />
      </div>

      <div className="card">
        <h2>All users</h2>
        <UserList users={users} currentUser={user} onUpdate={updateUser} onDelete={deleteUser} />
      </div>
    </>
  );
}

export default UserManagement;
