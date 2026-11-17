import { useState } from "react";
import { api } from "../api.js";

function LoginForm({ onLogin }) {
  // Controlled inputs: React state always holds what is typed in the box
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading
    setError("");

    // Validation
    if (!membershipId.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      const user = await api.login({ membership_id: membershipId.trim(), password });
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card login-box">
      <h2>🌸 Welcome back</h2>
      <p className="subtitle">Log in to Tree of Life Library</p>

      {error && <div className="message error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="membershipId">Membership ID</label>
          <input
            id="membershipId"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
            placeholder="e.g. 901020664"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </div>
        <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
