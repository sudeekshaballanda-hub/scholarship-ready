const scholarships = [
  {
    id: 1,
    name: "National Scholarship Portal – Pre-Matric Scholarship (SC/ST)",
    provider: "Government of India",
    type: "Government",
    amount: "₹3,500 – ₹7,000/year",
    deadline: "2026-10-31",
    level: ["Class 9", "Class 10"],
    category: ["SC", "ST"],
    incomeLimit: 250000,
    documents: [
      { name: "Aadhaar Card", type: "pdf,jpg,png", maxKB: 500, note: "Front and back on one page", validity: "none" },
      { name: "Income Certificate", type: "pdf", maxKB: 200, note: "Issued in current financial year", validity: "1year" },
      { name: "Caste Certificate", type: "pdf", maxKB: 200, note: "SC/ST certificate from competent authority", validity: "none" },
      { name: "Bank Passbook", type: "pdf,jpg", maxKB: 300, note: "First page showing account number and IFSC", validity: "none" },
      { name: "Previous Marksheet", type: "pdf", maxKB: 500, note: "Last passed class marksheet", validity: "none" }
    ],
    link: "https://scholarships.gov.in"
  },
  {
    id: 2,
    name: "Post-Matric Scholarship for OBC Students",
    provider: "Ministry of Social Justice",
    type: "Government",
    amount: "₹5,000 – ₹15,000/year",
    deadline: "2026-11-15",
    level: ["Class 11", "Class 12", "UG", "PG"],
    category: ["OBC"],
    incomeLimit: 250000,
    documents: [
      { name: "Aadhaar Card", type: "pdf,jpg,png", maxKB: 500, note: "Front and back on one page", validity: "none" },
      { name: "Income Certificate", type: "pdf", maxKB: 200, note: "Issued in current financial year", validity: "1year" },
      { name: "OBC Certificate", type: "pdf", maxKB: 200, note: "Non-creamy layer certificate", validity: "none" },
      { name: "Fee Receipt", type: "pdf,jpg", maxKB: 300, note: "Current academic year fee receipt", validity: "none" },
      { name: "Bank Passbook", type: "pdf,jpg", maxKB: 300, note: "First page showing account number and IFSC", validity: "none" }
    ],
    link: "https://scholarships.gov.in"
  },
  {
    id: 3,
    name: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    type: "Private",
    amount: "Up to ₹2,00,000",
    deadline: "2026-12-10",
    level: ["UG"],
    category: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    incomeLimit: 1500000,
    documents: [
      { name: "Aadhaar Card", type: "pdf,jpg,png", maxKB: 500, note: "Front and back on one page", validity: "none" },
      { name: "Income Certificate", type: "pdf", maxKB: 200, note: "Issued in current financial year", validity: "1year" },
      { name: "Class 12 Marksheet", type: "pdf", maxKB: 500, note: "Board marksheet", validity: "none" },
      { name: "Admission Proof", type: "pdf", maxKB: 300, note: "Admission/fee receipt from current institution", validity: "none" },
      { name: "Bank Passbook", type: "pdf,jpg", maxKB: 300, note: "First page showing account number and IFSC", validity: "none" }
    ],
    link: "https://www.scholarships.reliancefoundation.org"
  },
  {
    id: 4,
    name: "Kotak Kanya Scholarship",
    provider: "Kotak Education Foundation",
    type: "Private",
    amount: "₹1,50,000/year",
    deadline: "2026-09-30",
    level: ["UG"],
    category: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    incomeLimit: 600000,
    documents: [
      { name: "Aadhaar Card", type: "pdf,jpg,png", maxKB: 500, note: "Front and back on one page", validity: "none" },
      { name: "Income Certificate", type: "pdf", maxKB: 200, note: "Issued in current financial year", validity: "1year" },
      { name: "Class 12 Marksheet", type: "pdf", maxKB: 500, note: "Board marksheet", validity: "none" },
      { name: "Admission Proof", type: "pdf", maxKB: 300, note: "Admission/fee receipt from current institution", validity: "none" },
      { name: "Bank Passbook", type: "pdf,jpg", maxKB: 300, note: "First page showing account number and IFSC", validity: "none" },
      { name: "Passport Photo", type: "jpg,png", maxKB: 200, note: "Recent passport-size photo, plain background", validity: "none" }
    ],
    link: "https://www.kotakeducation.org"
  },
  {
    id: 5,
    name: "INSPIRE Scholarship (SHE)",
    provider: "Department of Science & Technology",
    type: "Government",
    amount: "₹80,000/year",
    deadline: "2026-08-31",
    level: ["UG", "PG"],
    category: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    incomeLimit: null,
    documents: [
      { name: "Aadhaar Card", type: "pdf,jpg,png", maxKB: 500, note: "Front and back on one page", validity: "none" },
      { name: "Class 12 Marksheet", type: "pdf", maxKB: 500, note: "Board marksheet", validity: "none" },
      { name: "Admission Proof", type: "pdf", maxKB: 300, note: "Admission/fee receipt from current institution", validity: "none" },
      { name: "Bank Passbook", type: "pdf,jpg", maxKB: 300, note: "First page showing account number and IFSC", validity: "none" }
    ],
    link: "https://online-inspire.gov.in"
  },
  {
    id: 6,
    name: "Maharashtra State Scholarship (Rajarshi Chhatrapati Shahu Maharaj)",
    provider: "Government of Maharashtra",
    type: "State",
    amount: "₹10,000 – ₹50,000/year",
    deadline: "2026-10-15",
    level: ["UG", "PG"],
    category: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    incomeLimit: 800000,
    documents: [
      { name: "Aadhaar Card", type: "pdf,jpg,png", maxKB: 500, note: "Front and back on one page", validity: "none" },
      { name: "Domicile Certificate", type: "pdf", maxKB: 200, note: "Maharashtra domicile certificate", validity: "none" },
      { name: "Income Certificate", type: "pdf", maxKB: 200, note: "Issued in current financial year", validity: "1year" },
      { name: "Fee Receipt", type: "pdf,jpg", maxKB: 300, note: "Current academic year fee receipt", validity: "none" },
      { name: "Bank Passbook", type: "pdf,jpg", maxKB: 300, note: "First page showing account number and IFSC", validity: "none" }
    ],
    link: "https://mahadbt.maharashtra.gov.in"
  },
  {
    id: 7,
    name: "Central Sector Scheme of Scholarship (CSSS)",
    provider: "Ministry of Education",
    type: "Government",
    amount: "₹12,000/year",
    deadline: "2026-10-31",
    level: ["UG", "PG"],
    category: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    incomeLimit: 450000,
    documents: [
      { name: "Aadhaar Card", type: "pdf,jpg,png", maxKB: 500, note: "Front and back on one page", validity: "none" },
      { name: "Income Certificate", type: "pdf", maxKB: 200, note: "Issued in current financial year", validity: "1year" },
      { name: "Class 12 Marksheet", type: "pdf", maxKB: 500, note: "Board marksheet", validity: "none" },
      { name: "Bank Passbook", type: "pdf,jpg", maxKB: 300, note: "First page showing account number and IFSC", validity: "none" }
    ],
    link: "https://scholarships.gov.in"
  },
  {
    id: 8,
    name: "Tata Capital Pankh Scholarship",
    provider: "Tata Capital",
    type: "Private",
    amount: "Up to ₹50,000",
    deadline: "2026-11-20",
    level: ["Class 11", "Class 12", "UG"],
    category: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    incomeLimit: 400000,
    documents: [
      { name: "Aadhaar Card", type: "pdf,jpg,png", maxKB: 500, note: "Front and back on one page", validity: "none" },
      { name: "Income Certificate", type: "pdf", maxKB: 200, note: "Issued in current financial year", validity: "1year" },
      { name: "Previous Marksheet", type: "pdf", maxKB: 500, note: "Last passed class marksheet", validity: "none" },
      { name: "Fee Receipt", type: "pdf,jpg", maxKB: 300, note: "Current academic year fee receipt", validity: "none" },
      { name: "Bank Passbook", type: "pdf,jpg", maxKB: 300, note: "First page showing account number and IFSC", validity: "none" }
    ],
    link: "https://www.buddy4study.com"
  }
];