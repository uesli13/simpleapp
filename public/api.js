const API_BASE = ""; // same origin, served by Express

const storage = {
  get token() { return localStorage.getItem("token"); },
  set token(v) { v ? localStorage.setItem("token", v) : localStorage.removeItem("token"); }
};

async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && storage.token) headers["Authorization"] = `Bearer ${storage.token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// Users
async function signup({ username, email, password }) {
  return api("/api/users", { method: "POST", body: { username, email, password } });
}
async function login({ email, password }) {
  return api("/api/users/login", { method: "POST", body: { email, password } });
}

// Posts
async function getPosts() {
  return api("/api/posts");
}
async function createPost({ content }) {
  return api("/api/posts", { method: "POST", body: { content }, auth: true });
}