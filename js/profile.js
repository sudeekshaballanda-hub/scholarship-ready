// 1. Check if user is logged in
const session = JSON.parse(localStorage.getItem("sr_session"));
if (!session) window.location.href = "login.html";

// 2. Setup Personal Details
document.getElementById("greeting").textContent = `Hi, ${session.name}`;
const form = document.getElementById("profileForm");
const levelInput = document.getElementById("profLevel");
const categoryInput = document.getElementById("profCategory");
const incomeInput = document.getElementById("profIncome");

if (session.profile) {
  levelInput.value = session.profile.level || "";
  categoryInput.value = session.profile.category || "";
  incomeInput.value = session.profile.income || "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  session.profile = {
    level: levelInput.value,
    category: categoryInput.value,
    income: incomeInput.value
  };
  saveSession();
  showToast("Personal details saved!");
});

// 3. Setup Document Vault
const standardDocs = [
  { id: "aadhaar", name: "Aadhaar Card", note: "Images auto-compress. (Max 200KB)" },
  { id: "income", name: "Income Certificate", note: "Images auto-compress. (Max 200KB)" },
  { id: "caste", name: "Caste Certificate", note: "Images auto-compress. (Max 200KB)" },
  { id: "marksheet", name: "Last Marksheet", note: "Images auto-compress. (Max 500KB)" },
  { id: "bank", name: "Bank Passbook", note: "Images auto-compress. (Max 300KB)" },
  { id: "photo", name: "Passport Photo", note: "Images auto-compress. (Max 50KB)" }
];

if (!session.vault) session.vault = {};
const vaultList = document.getElementById("vaultList");

// Size limits in KB for validation
const sizeLimits = {
  aadhaar: 200,
  income: 200,
  caste: 200,
  marksheet: 500,
  bank: 300,
  photo: 50
};

function renderVault() {
  vaultList.innerHTML = standardDocs.map(doc => {
    const uploadedFile = session.vault[doc.id];
    const isUploaded = !!uploadedFile;
    
    return `
      <div class="vault-card ${isUploaded ? 'uploaded' : ''}">
        ${isUploaded ? '<span class="status-icon">✅</span>' : ''}
        <h4>${doc.name}</h4>
        <p>${doc.note}</p>
        
        <input type="file" id="file-${doc.id}" class="file-input" accept=".pdf,.jpg,.png" onchange="handleUpload('${doc.id}', this)" />
        
        <div style="display: flex; gap: 8px; justify-content: center; margin-top: 10px;">
          <button class="upload-btn" onclick="document.getElementById('file-${doc.id}').click()">
            ${isUploaded ? 'Replace' : 'Upload'}
          </button>
          ${isUploaded ? `<button class="upload-btn" style="color:var(--danger); border-color:var(--danger);" onclick="removeDoc('${doc.id}')">Remove</button>` : ''}
        </div>
        
        ${isUploaded ? `<div style="font-size:0.7rem; color:var(--muted); margin-top:8px; word-break:break-all;">${uploadedFile}</div>` : ''}
      </div>
    `;
  }).join("");
}

// --- ROBUST IMAGE COMPRESSION LOGIC ---
function compressImage(file, maxSizeKB, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      // Step 1: Scale down physical dimensions if the image is huge
      const maxDimension = 1200; 
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Step 2: Reduce quality until it fits under maxSizeKB
      let quality = 0.9; 
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      let currentSizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);

      // Loop down quality by 10% each time until it fits
      while (currentSizeKB > maxSizeKB && quality > 0.1) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
        currentSizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
      }

      // Step 3: If it's STILL too big, shrink dimensions further
      while (currentSizeKB > maxSizeKB && width > 300) {
        width = Math.round(width * 0.8); 
        height = Math.round(height * 0.8);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        currentSizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
      }

      // Clean up the file name
      const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const newName = originalNameWithoutExt + '_compressed.jpg';
      
      callback(newName, currentSizeKB, dataUrl);
    };
  };
}

// Handle the file upload
window.handleUpload = function(docId, inputElement) {
  const file = inputElement.files[0];
  if (!file) return;

  // Format check
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    showToast("❌ Invalid format. Please upload PDF, JPG, or PNG.", true);
    inputElement.value = "";
    return;
  }

  const maxSizeKB = sizeLimits[docId] || 200;
  const fileSizeKB = Math.round(file.size / 1024);

  // IF FILE IS AN IMAGE AND IS TOO LARGE -> COMPRESS
  if (file.type.startsWith("image/") && fileSizeKB > maxSizeKB) {
    showToast("⚙️ Image is too large. Auto-compressing...", false);
    
    // setTimeout allows the UI to update the toast before the browser freezes to compress
    setTimeout(() => {
      compressImage(file, maxSizeKB, (newName, newSizeKB, dataUrl) => {
        session.vault[docId] = `${newName} (${newSizeKB} KB - Auto-Compressed)`;
        
        try {
          localStorage.setItem(`sr_file_${session.email}_${docId}`, dataUrl);
        } catch (e) {
          console.warn("LocalStorage full, but file name saved.");
        }

        saveSession();
        renderVault();
        showToast(`✅ Compressed to ${newSizeKB} KB and saved!`);
      });
    }, 100);
    return;
  }

  // IF FILE IS A PDF AND IS TOO LARGE -> REJECT
  if (file.type === "application/pdf" && fileSizeKB > maxSizeKB) {
    showToast(`❌ PDF is too large (${fileSizeKB}KB). Max allowed is ${maxSizeKB}KB.`, true);
    inputElement.value = "";
    return;
  }

  // IF FILE IS ALREADY SMALL ENOUGH -> SAVE DIRECTLY
  session.vault[docId] = `${file.name} (${fileSizeKB} KB)`;
  saveSession();
  renderVault();
  showToast("✅ Document uploaded successfully!");
};

// Handle Document Removal
window.removeDoc = function(docId) {
  if(confirm("Are you sure you want to remove this document?")) {
    delete session.vault[docId];
    localStorage.removeItem(`sr_file_${session.email}_${docId}`); 
    saveSession();
    renderVault();
    showToast("🗑️ Document removed.");
  }
};

// Helper to save session
function saveSession() {
  localStorage.setItem("sr_session", JSON.stringify(session));
  let users = JSON.parse(localStorage.getItem("sr_users"));
  const userIndex = users.findIndex(u => u.email === session.email);
  if (userIndex !== -1) {
    users[userIndex] = session;
    localStorage.setItem("sr_users", JSON.stringify(users));
  }
}

// Toast notification
// Toast notification
function showToast(message, isError = false) {
  // Forcefully remove ANY existing toasts
  document.querySelectorAll(".custom-toast").forEach(el => el.remove());

  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: ${isError ? '#fee2e2' : '#dcfce7'}; 
    color: ${isError ? '#991b1b' : '#166534'};
    padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; transition: opacity 0.3s;
    border: 1px solid ${isError ? '#f87171' : '#bbf7d0'};
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => { 
    toast.style.opacity = '0'; 
    setTimeout(() => toast.remove(), 300); 
  }, 3000); // Disappears after 3 seconds
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("sr_session");
  window.location.href = "index.html";
});

// Initial render
renderVault();