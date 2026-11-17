# 🌸 Tree of Life Library (TakeHome2)

A library management app. React (Vite) frontend, Express backend, MySQL database.

```
TakeHome2/
├── backend/    Express API + MySQL
└── frontend/   React app
```

## How to run it

You need Node.js and MySQL installed and running.

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # then open .env and type your MySQL password
npm start
```
On first start the server creates the `tree_of_life` database, the tables, six starter books
and the admin account. It runs at http://localhost:5000.

### 2. Frontend (open a second terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

## Admin login
| Membership ID | Password   |
|---------------|------------|
| 901020664     | 2003march  |

## What is where

| Requirement | File(s) |
|---|---|
| Book CRUD | `backend/routes/books.js`, `frontend/src/pages/BookManagement.jsx`, `BookForm.jsx`, `BookList.jsx` |
| Stock + transactions | `backend/routes/transactions.js`, `frontend/src/pages/Transactions.jsx` |
| User CRUD + login | `backend/routes/users.js`, `frontend/src/pages/UserManagement.jsx`, `LoginForm.jsx`, `UserForm.jsx`, `UserList.jsx` |
| Dashboard + low stock (< 2) | `frontend/src/pages/Dashboard.jsx`, `BookCard.jsx` |
| React Router | `frontend/src/App.jsx` |
| Fetch API | `frontend/src/api.js` |
| Middleware (`express.json`, `cors`) | `backend/server.js` |

## API endpoints
- `GET/POST /books`, `GET/PUT/DELETE /books/:id`
- `GET/POST /users`, `PUT/DELETE /users/:id`, `POST /users/login`
- `GET/POST /transactions`, `PUT/DELETE /transactions/:id`

## Notes
- Passwords are stored hashed (bcrypt), never as plain text.
- Admins see all pages. Members can view the dashboard and borrow books.
- The ISBNs on the six starter books are sample numbers, not the real ones.
