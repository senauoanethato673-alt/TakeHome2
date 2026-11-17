import { useState } from "react";
import UserForm from "./UserForm.jsx";

function UserList({ users, currentUser, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  async function saveEdit(id, data) {
    const ok = await onUpdate(id, data);
    if (ok) setEditingId(null);
    return ok;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u) =>
            editingId === u.id ? (
              <tr key={u.id}>
                <td colSpan="4">
                  <h3>Editing: {u.name}</h3>
                  <UserForm
                    initial={u}
                    submitLabel="Save changes"
                    onSubmit={(data) => saveEdit(u.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                </td>
              </tr>
            ) : (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.membership_id}</td>
                <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                <td>
                  <div className="actions">
                    <button className="btn btn-light btn-small" onClick={() => setEditingId(u.id)}>Update</button>
                    {/* You cannot delete yourself, otherwise you would lock yourself out */}
                    {u.id !== currentUser.id && (
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => {
                          if (window.confirm(`Delete ${u.name}?`)) onDelete(u.id);
                        }}
                      >
                        Delete
                      </button>
                    )}
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

export default UserList;
