// 1. Check User Session (Must be first so other scripts can use it)
const session = JSON.parse(localStorage.getItem("sr_session"));
const userProfile = session && session.profile ? session.profile : null;

// 2. Dynamic Navbar Logic
const navEl = document.getElementById("mainNav");
if (navEl) {
  if (session) {
    navEl.innerHTML = `
      <a href="index.html" class="active">Dashboard</a>
      <a href="profile.html">My Profile</a>
      <a href="#" id="logoutBtn" style="background:#fee2e2; color:#b91c1c; padding: 6px 14px; border-radius: 999px; font-weight: 600;">Log Out</a>
    `;
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("sr_session");
      window.location.href = "index.html";
    });
  } else {
    navEl.innerHTML = `
      <a href="index.html" class="active">Dashboard</a>
      <a href="login.html" style="color: var(--primary); font-weight: 600;">Log In / Sign Up</a>
    `;
  }
}

// 3. Dashboard State
const state = { search: "", level: "", category: "", type: "", income: "", sort: "deadline" };

const els = {
  search: document.getElementById("search"),
  level: document.getElementById("level"),
  category: document.getElementById("category"),
  type: document.getElementById("type"),
  income: document.getElementById("income"),
  sort: document.getElementById("sort"),
  reset: document.getElementById("resetFilters"),
  list: document.getElementById("scholarshipList"),
  count: document.getElementById("resultCount"),
  empty: document.getElementById("emptyState"),
};

// 4. Show Smart Match Banner if Profile Exists
if (userProfile && document.querySelector(".hero .container")) {
  const heroContainer = document.querySelector(".hero .container");
  const banner = document.createElement("div");
  banner.style.cssText = "background: #dcfce7; color: #166534; padding: 10px 16px; border-radius: 8px; margin-top: 16px; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;";
  banner.innerHTML = `
    <span>✨ <strong>Smart Match Active:</strong> Showing scholarships for ${userProfile.level} · ${userProfile.category} · Under ₹${Number(userProfile.income).toLocaleString("en-IN")}</span>
    <a href="profile.html" style="color: #166534; font-weight: bold; text-decoration: underline;">Edit Profile</a>
  `;
  heroContainer.appendChild(banner);
}

// 5. Helper Functions
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

// 6. Filtering Logic
function getFiltered() {
  let list = scholarships.filter((s) => {
    // Search & Type (Manual)
    const matchesSearch = !state.search || s.name.toLowerCase().includes(state.search.toLowerCase()) || s.provider.toLowerCase().includes(state.search.toLowerCase());
    const matchesType = !state.type || s.type === state.type;
    
    // Level, Category, Income (Profile defaults, overridden by manual dropdown if changed)
    const targetLevel = state.level || (userProfile ? userProfile.level : "");
    const targetCategory = state.category || (userProfile ? userProfile.category : "");
    const targetIncome = state.income || (userProfile ? userProfile.income : "");

    const matchesLevel = !targetLevel || s.level.includes(targetLevel);
    const matchesCategory = !targetCategory || s.category.includes(targetCategory);
    const matchesIncome = !targetIncome || (s.incomeLimit !== null && s.incomeLimit >= Number(targetIncome));

    return matchesSearch && matchesType && matchesLevel && matchesCategory && matchesIncome;
  });

  // Sorting
  if (state.sort === "deadline") list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  if (state.sort === "amount") list.sort((a, b) => b.amount.localeCompare(a.amount));
  if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  
  return list;
}

// 7. Render Cards
function render() {
  const list = getFiltered();
  els.count.textContent = `${list.length} scholarship${list.length !== 1 ? "s" : ""} found`;
  els.empty.hidden = list.length !== 0;

  const vault = session && session.vault ? session.vault : {};

  els.list.innerHTML = list.map((s) => {
    const days = daysLeft(s.deadline);
    const urgency = days <= 30 ? "⚠️ " : "";
    
    return `
      <article class="card">
        <div class="card-top">
          <h3>${s.name}</h3>
          <span class="badge ${s.type.toLowerCase()}">${s.type}</span>
        </div>
        <p class="provider">${s.provider}</p>
        <div class="meta">
          <span><strong>Amount:</strong> ${s.amount}</span>
          <span><strong>Level:</strong> ${s.level.join(", ")}</span>
        </div>
        <p class="deadline">${urgency}Deadline: ${formatDate(s.deadline)} (${days > 0 ? days + " days left" : "closed"})</p>
        <div class="docs">
          ${s.documents.slice(0, 4).map((d) => {
            const isReady = Object.keys(vault).some(k => d.name.toLowerCase().includes(k.toLowerCase()));
            return `<span style="${isReady ? 'background:#dcfce7; color:#166534; border:1px solid #bbf7d0;' : ''}">${d.name} ${isReady ? '✓' : ''}</span>`;
          }).join("")}
          ${s.documents.length > 4 ? `<span>+${s.documents.length - 4} more</span>` : ""}
        </div>
        <div class="actions">
          <button class="btn-primary" onclick="viewDetails(${s.id})">View Details</button>
          <a class="btn-ghost" href="${s.link}" target="_blank" rel="noopener">Official Site</a>
        </div>
      </article>
    `;
  }).join("");
}

// 8. Navigation
function viewDetails(id) {
  window.location.href = `view.html?id=${id}`;
}

// 9. Event Listeners
["search", "level", "category", "type", "income", "sort"].forEach((key) => {
  if (els[key]) {
    els[key].addEventListener("input", (e) => {
      state[key] = e.target.value;
      render();
    });
  }
});

if (els.reset) {
  els.reset.addEventListener("click", () => {
    Object.assign(state, { search: "", level: "", category: "", type: "", income: "", sort: "deadline" });
    if(els.search) els.search.value = ""; 
    if(els.level) els.level.value = ""; 
    if(els.category) els.category.value = "";
    if(els.type) els.type.value = ""; 
    if(els.income) els.income.value = ""; 
    if(els.sort) els.sort.value = "deadline";
    render();
  });
}

// 10. Initial Render
if (els.list) {
  render();
}