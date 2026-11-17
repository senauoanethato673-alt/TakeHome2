import { useState } from "react";

// Used for BOTH adding a new book and editing an existing one.
// "initial" holds the starting values, "onSubmit" is run when the form is valid.
const emptyBook = { title: "", author: "", genre: "", isbn: "", quantity: "" };

function BookForm({ initial = emptyBook, onSubmit, onCancel, submitLabel = "Add Book" }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  // One change handler for every input - it uses the input's "name" to know which field to update
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.author.trim()) newErrors.author = "Author is required";
    if (!form.genre.trim()) newErrors.genre = "Genre is required";
    if (!/^\d{10}(\d{3})?$/.test(String(form.isbn).replace(/-/g, ""))) {
      newErrors.isbn = "ISBN must be 10 or 13 digits";
    }
    const q = Number(form.quantity);
    if (form.quantity === "" || !Number.isInteger(q) || q < 0) {
      newErrors.quantity = "Enter a whole number (0 or more)";
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // stop if anything is wrong

    const succeeded = await onSubmit({ ...form, quantity: Number(form.quantity) });
    if (succeeded && initial === emptyBook) setForm(emptyBook); // clear the form after adding
  }

  // Small helper so we do not repeat the same input markup five times
  function field(name, label, type = "text") {
    return (
      <div>
        <label htmlFor={`${name}-${initial.id || "new"}`}>{label}</label>
        <input
          id={`${name}-${initial.id || "new"}`}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          className={errors[name] ? "invalid" : ""}
        />
        {errors[name] && <p className="field-error">{errors[name]}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {field("title", "Title")}
        {field("author", "Author")}
        {field("genre", "Genre")}
        {field("isbn", "ISBN")}
        {field("quantity", initial === emptyBook ? "Initial Quantity" : "Quantity", "number")}
      </div>
      <div className="form-actions">
        <button className="btn" type="submit">{submitLabel}</button>
        {onCancel && (
          <button className="btn btn-light" type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

export default BookForm;
