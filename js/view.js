console.log("detail.js loaded");

(function () {
  console.log("URL:", window.location.href);

  const contentEl = document.getElementById("detailContent");
  const notFoundEl = document.getElementById("notFound");

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  console.log("ID Param:", idParam);

  if (!idParam) {
    console.log("No ID in URL, showing error.");
    notFoundEl.hidden = false;
    document.querySelector("#notFound h2").textContent = "No scholarship selected";
    document.querySelector("#notFound p").textContent = "Please go back to the dashboard and click 'View Details' on a card.";
    return;
  }

  const id = Number(idParam);
  console.log("Searching for ID:", id);
  console.log("Data available:", typeof scholarships);

  const sch = scholarships.find((s) => s.id === id);
  console.log("Found scholarship:", sch ? sch.name : "NONE");

  if (!sch) {
    notFoundEl.hidden = false;
    document.querySelector("#notFound h2").textContent = "Scholarship not found";
    document.querySelector("#notFound p").textContent = "The ID in the URL does not match any scholarship in our database.";
    return;
  }

  const session = JSON.parse(localStorage.getItem("sr_session"));
  const vault = session && session.vault ? session.vault : {};

  function getVaultFile(docName) {
    for (const key in vault) {
      if (docName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(docName.toLowerCase())) {
        return vault[key];
      }
    }
    return null;
  }

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

  const readyAction = document.getElementById("readyAction");
  const missingAlert = document.getElementById("missingDocsAlert");
  const readinessMsg = document.getElementById("readinessMsg");
  const readinessPanel = document.getElementById("readinessPanel");

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

    window.print();
  };

  contentEl.hidden = false;
})();