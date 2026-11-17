import { useState } from "react";

const emptyUser = { name: "", membership_id: "", password: "", role: "member" };

// Add a new user, or edit an existing one (password can be left blank when editing)
function UserForm({ initial = emptyUser, onSubmit, onCancel, submitLabel = "Add User" }) {
  const isEditing = initial !== emptyUser;
  const [form, setForm] = useState({ ...initial, password: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/^\d{4,20}$/.test(form.membership_id)) newErrors.membership_id = "Membership ID must be 4-20 digits";
    if (!isEditing && form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (isEditing && form.password && form.password.length < 6) newErrors.password = "New password must be at least 6 characters";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const ok = await onSubmit(form);
    if (ok && !isEditing) setForm(emptyUser);
  }

  const idSuffix = initial.id || "new";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div>
          <label htmlFor={`name-${idSuffix}`}>Name</label>
          <input id={`name-${idSuffix}`} name="name" value={form.name} onChange={handleChange} className={errors.name ? "invalid" : ""} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`mid-${idSuffix}`}>Membership ID</label>
          <input id={`mid-${idSuffix}`} name="membership_id" value={form.membership_id} onChange={handleChange} className={errors.membership_id ? "invalid" : ""} />
          {errors.membership_id && <p className="field-error">{errors.membership_id}</p>}
        </div>
        <div>
          <label htmlFor={`pw-${idSuffix}`}>{isEditing ? "New password (optional)" : "Password"}</label>
          <input id={`pw-${idSuffix}`} name="password" type="password" value={form.password} onChange={handleChange} className={errors.password ? "invalid" : ""} />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        <div>
          <label htmlFor={`role-${idSuffix}`}>Role</label>
          <select id={`role-${idSuffix}`} name="role" value={form.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button className="btn" type="submit">{submitLabel}</button>
        {onCancel && <button className="btn btn-light" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default UserForm;
