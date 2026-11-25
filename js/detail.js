(function () {
  const contentEl = document.getElementById("detailContent");
  const notFoundEl = document.getElementById("notFound");

  // 1. Get Scholarship ID from URL
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const sch = scholarships.find((s) => s.id === id);

  if (!sch) {
    notFoundEl.hidden = false;
    return;
  }

  // 2. Check User Session & Vault
  const session = JSON.parse(localStorage.getItem("sr_session"));
  const vault = session && session.vault ? session.vault : {};

  // Helper to match doc names (e.g., "Aadhaar Card" matches "aadhaar")
  function getVaultFile(docName) {
    for (const key in vault) {
      if (docName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(docName.toLowerCase())) {
        return vault[key];
      }
    }
    return null;
  }

  // 3. Fill Basic Details
  document.title = `${sch.name} – ScholarshipReady`;
  document.getElementById("schName").textContent = sch.name;
  document.getElementById("schProvider").textContent = sch.provider;
  document.getElementById("schAmount").textContent = sch.amount;
  document.getElementById("schType").textContent = sch.type;
  
  const badge = document.getElementById("schBadge");
  badge.textContent = sch.type;
  badge.classList.add(sch.type.toLowerCase());

  const days = Math.ceil((new Date(sch.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const deadlineText = new Date(sch.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const deadlineEl = document.getElementById("schDeadline");
  deadlineEl.textContent = `${deadlineText}${days > 0 ? ` · ${days} days left` : " · closed"}`;
  if (days <= 30 && days > 0) deadlineEl.classList.add("urgent");

  document.getElementById("officialLink").href = sch.link;

  // 4. Render Document List with Statuses
  let missingCount = 0;
  const docListEl = document.getElementById("docList");
  
  docListEl.innerHTML = sch.documents.map((d) => {
    const uploadedFile = getVaultFile(d.name);
    const isReady = !!uploadedFile;
    if (!isReady) missingCount++;

    return `
      <li class="doc-item" style="border-left: 4px solid ${isReady ? 'var(--accent)' : 'var(--danger)'}; padding-left: 12px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="doc-name">${d.name}</div>
            <div class="doc-note">${d.note}</div>
            <div class="doc-rules" style="margin-top: 6px;">
              <span>Max size: ${d.maxKB} KB</span>
              ${d.validity !== "none" ? `<span>Validity: ${d.validity}</span>` : ""}
            </div>
          </div>
          <div style="text-align: right;">
            ${isReady 
              ? `<span style="color: var(--accent); font-weight: bold; font-size: 0.85rem;">✅ In Vault</span>` 
              : `<span style="color: var(--danger); font-weight: bold; font-size: 0.85rem;">❌ Missing</span>`}
          </div>
        </div>
      </li>
    `;
  }).join("");

  // 5. Handle Readiness Panel State
  const readinessPanel = document.getElementById("readinessPanel");
  const readyAction = document.getElementById("readyAction");
  const missingAlert = document.getElementById("missingDocsAlert");
  const readinessMsg = document.getElementById("readinessMsg");

  if (!session) {
    readinessMsg.textContent = "Log in to check if your documents are ready for this scholarship.";
    missingAlert.style.display = "block";
    missingAlert.innerHTML = `<p style="color: #7f1d1d; margin-bottom: 10px;">You must be logged in to verify your documents.</p><a href="login.html" class="btn-primary" style="display:inline-block; flex:none; background: #991b1b;">Log In Now</a>`;
  } else if (missingCount > 0) {
    readinessMsg.textContent = `You are missing ${missingCount} required document(s).`;
    missingAlert.style.display = "block";
  } else {
    readinessMsg.textContent = "All required documents found in your vault!";
    readyAction.style.display = "block";
    readinessPanel.style.background = "#f0fdf4";
    readinessPanel.style.borderColor = "#bbf7d0";
  }

  // 6. Generate Print Pack
  window.generatePack = function() {
    document.getElementById("printSchName").textContent = sch.name;
    document.getElementById("printProvider").textContent = sch.provider;
    document.getElementById("printDeadline").textContent = deadlineText;

    const tbody = document.getElementById("printTableBody");
    tbody.innerHTML = sch.documents.map(d => {
      const file = getVaultFile(d.name);
      return `
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">${d.name}</td>
          <td style="padding: 10px; border: 1px solid #ccc; font-family: monospace; font-size: 0.85rem;">${file}</td>
          <td style="padding: 10px; border: 1px solid #ccc; font-size: 0.85rem;">Upload to ${d.name} field. Ensure it is under ${d.maxKB} KB.</td>
        </tr>
      `;
    }).join("");

    // Trigger browser print dialog
    window.print();
  };

  contentEl.hidden = false;
})();