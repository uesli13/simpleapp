function qs(sel) { return document.querySelector(sel); }
function on(id, ev, fn) { const el = qs(id); if (el) el.addEventListener(ev, fn); return el; }
function redirect(path) { window.location.href = path; }
function setError(msg) { const el = qs(".error"); if (el) el.textContent = msg || ""; }

async function handleLoginSubmit(e) {
  e.preventDefault();
  setError("");
  const email = qs("#email").value.trim();
  const password = qs("#password").value;
  try {
    const res = await login({ email, password });
    storage.token = res.token;
    redirect("/"); // index.html
  } catch (err) { setError(err.message); }
}

async function handleSignupSubmit(e) {
  e.preventDefault();
  setError("");
  const username = qs("#username").value.trim();
  const email = qs("#email").value.trim();
  const password = qs("#password").value;
  try {
    await signup({ username, email, password });
    // optional: auto-login by calling login() now; minimal flow redirects to login or home
    const res = await login({ email, password });
    storage.token = res.token;
    redirect("/");
  } catch (err) { setError(err.message); }
}

async function loadHome() {
  setError("");
  const list = qs("#posts");
  const form = qs("#new-post-form");
  const logoutBtn = qs("#logout");

  if (logoutBtn) {
    logoutBtn.onclick = () => { storage.token = null; redirect("/login.html"); };
  }

  // show/hide new post form based on auth
  if (form) form.style.display = storage.token ? "grid" : "none";

  // load posts
  try {
    const posts = await getPosts();
    list.innerHTML = "";
    posts.forEach(p => {
      const div = document.createElement("div");
      div.className = "post";
      const user = p.user ? (p.user.username || p.user.email) : "unknown";
      const ts = new Date(p.createdAt).toLocaleString();
      div.innerHTML = `
        <div class="muted">${user} • ${ts}</div>
        <div>${escapeHtml(p.content)}</div>
      `;
      list.appendChild(div);
    });
  } catch (err) { setError(err.message); }

  // create post
  on("#new-post-form", "submit", async (e) => {
    e.preventDefault();
    setError("");
    const content = qs("#content").value.trim();
    if (!content) return;
    try {
      await createPost({ content });
      qs("#content").value = "";
      await loadHome(); // reload list
    } catch (err) { setError(err.message); }
  });
}

// tiny HTML escaper
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c =>
    ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

// router by page
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "login") {
    on("#login-form", "submit", handleLoginSubmit);
    on("#to-signup", "click", () => redirect("/signup.html"));
  } else if (page === "signup") {
    on("#signup-form", "submit", handleSignupSubmit);
    on("#to-login", "click", () => redirect("/login.html"));
  } else if (page === "home") {
    // if not logged in, still allow viewing posts. keep create form hidden.
    loadHome();
  }
});