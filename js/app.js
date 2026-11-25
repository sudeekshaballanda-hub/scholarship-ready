const state = {
  search: "",
  level: "",
  category: "",
  type: "",
  income: "",
  sort: "deadline",
};
// Check if user is logged in
const session = JSON.parse(localStorage.getItem("sr_session"));

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

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(dateStr) {
  const diff = Math.ceil(
    (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24),
  );
  return diff;
}

function getFiltered() {
  let list = scholarships.filter((s) => {
    const matchesSearch =
      !state.search ||
      s.name.toLowerCase().includes(state.search.toLowerCase()) ||
      s.provider.toLowerCase().includes(state.search.toLowerCase());
    const matchesLevel = !state.level || s.level.includes(state.level);
    const matchesCategory =
      !state.category || s.category.includes(state.category);
    const matchesType = !state.type || s.type === state.type;
    const matchesIncome =
      !state.income ||
      (s.incomeLimit !== null && s.incomeLimit <= Number(state.income));
    return (
      matchesSearch &&
      matchesLevel &&
      matchesCategory &&
      matchesType &&
      matchesIncome
    );
  });

  if (state.sort === "deadline")
    list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  if (state.sort === "amount")
    list.sort((a, b) => b.amount.localeCompare(a.amount));
  if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function render() {
  const list = getFiltered();
  els.count.textContent = `${list.length} scholarship${list.length !== 1 ? "s" : ""} found`;
  els.empty.hidden = list.length !== 0;

  els.list.innerHTML = list
    .map((s) => {
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
          ${s.documents
            .slice(0, 4)
            .map((d) => {
              // Check if the user has this document in their vault
              // (We do a simple text match: "Aadhaar Card" matches "aadhaar")
              const isReady =
                session &&
                session.vault &&
                Object.keys(session.vault).some((k) =>
                  d.name.toLowerCase().includes(k.toLowerCase()),
                );
              return `<span style="${isReady ? "background:#dcfce7; color:#166534; border:1px solid #bbf7d0;" : ""}">${d.name} ${isReady ? "✓" : ""}</span>`;
            })
            .join("")}
          ${s.documents.length > 4 ? `<span>+${s.documents.length - 4} more</span>` : ""}
        </div>
        <div class="actions">
          <button class="btn-primary" onclick="viewDetails(${s.id})">View Details</button>
          <a class="btn-ghost" href="${s.link}" target="_blank" rel="noopener">Official Site</a>
        </div>
      </article>`;
    })
    .join("");
}

function viewDetails(id) {
  window.location.href = `detail.html?id=${id}`;
}

// Event wiring
["search", "level", "category", "type", "income", "sort"].forEach((key) => {
  els[key].addEventListener("input", (e) => {
    state[key] = e.target.value;
    render();
  });
});

els.reset.addEventListener("click", () => {
  Object.assign(state, {
    search: "",
    level: "",
    category: "",
    type: "",
    income: "",
    sort: "deadline",
  });
  els.search.value = "";
  els.level.value = "";
  els.category.value = "";
  els.type.value = "";
  els.income.value = "";
  els.sort.value = "deadline";
  render();
});

render();
