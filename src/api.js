const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || "Request failed.";
    throw new Error(message);
  }
  return data;
}

export function getMe() {
  return apiRequest("/me", { method: "GET" });
}

export function login(payload) {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function signup(payload) {
  return apiRequest("/signup", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logout() {
  return apiRequest("/logout", { method: "POST" });
}

export function getResources(subject, grade) {
  const params = new URLSearchParams({
    subject,
    grade: String(grade)
  });
  return apiRequest(`/resources?${params.toString()}`, { method: "GET" });
}
