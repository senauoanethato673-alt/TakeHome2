// api.js - one small helper around fetch() so every page talks to the backend the same way.
const API_URL = "http://localhost:5000";

async function request(path, method = "GET", body) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(API_URL + path, options);
  const data = await response.json();

  // If the server answered with an error, throw it so the page can show the message
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  login: (credentials) => request("/users/login", "POST", credentials),

  getBooks: () => request("/books"),
  addBook: (book) => request("/books", "POST", book),
  updateBook: (id, book) => request(`/books/${id}`, "PUT", book),
  deleteBook: (id) => request(`/books/${id}`, "DELETE"),

  getUsers: () => request("/users"),
  addUser: (user) => request("/users", "POST", user),
  updateUser: (id, user) => request(`/users/${id}`, "PUT", user),
  deleteUser: (id) => request(`/users/${id}`, "DELETE"),

  getTransactions: () => request("/transactions"),
  addTransaction: (t) => request("/transactions", "POST", t),
  deleteTransaction: (id) => request(`/transactions/${id}`, "DELETE"),
};
