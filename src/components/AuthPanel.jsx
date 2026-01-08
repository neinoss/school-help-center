import { useState } from "react";
import { login, signup } from "../api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    remember: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!EMAIL_RE.test(form.email)) return "Enter a valid email.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Use at least 6 characters.";
    if (mode === "signup" && form.password !== form.confirm) {
      return "Passwords do not match.";
    }
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const issue = validate();
    if (issue) {
      setError(issue);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
        remember: form.remember
      };

      const response = mode === "login" ? await login(payload) : await signup(payload);
      if (response.user) onAuth(response.user);
      setSuccess(mode === "login" ? "Welcome back." : "Account created.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-panel glow">
      <div className="auth-header">
        <h3>{mode === "login" ? "Login" : "Create account"}</h3>
        <p>Access saved resources and personalize your learning.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="At least 6 characters"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>

        {mode === "signup" && (
          <label className="auth-field">
            <span>Confirm password</span>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => updateField("confirm", e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </label>
        )}

        <label className="auth-remember">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(e) => updateField("remember", e.target.checked)}
          />
          Remember me
        </label>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
        </button>
      </form>

      <button
        type="button"
        className="auth-toggle"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError("");
          setSuccess("");
        }}
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}
