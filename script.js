function showSection(id) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

document.getElementById('uploadBtn').addEventListener('click', () => {
  const file = document.getElementById('csvFile').files[0];
  if (!file) { alert("Please select a CSV file!"); return; }

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      const data = results.data.filter(r => r.Category && r.Amount);
      if (data.length === 0) { alert("CSV must have Category and Amount columns."); return; }
      showSection('insights');
      generateInsights(data);
      updateCibilScore();
    }
  });
});

function generateInsights(data) {
  let categoryTotals = {}, totalAmount = 0, amounts = [];
  data.forEach(row => {
    categoryTotals[row.Category] = (categoryTotals[row.Category] || 0) + row.Amount;
    totalAmount += row.Amount;
    amounts.push(row.Amount);
  });

  let tableHTML = "<table><tr><th>Category</th><th>Total Amount</th></tr>";
  for (let c in categoryTotals) {
    tableHTML += `<tr><td>${c}</td><td>${categoryTotals[c]}</td></tr>`;
  }
  tableHTML += `<tr><th>Total</th><th>${totalAmount}</th></tr></table>`;
  document.getElementById("summary").innerHTML = tableHTML;

  const avg = (totalAmount / amounts.length).toFixed(2);
  const max = Math.max(...amounts);
  const min = Math.min(...amounts);
  const top3 = Object.entries(categoryTotals).sort((a,b)=>b[1]-a[1]).slice(0,3);
  document.getElementById("extraInsights").innerHTML = `
    <p><strong>Average Transaction:</strong> ${avg}</p>
    <p><strong>Highest Transaction:</strong> ${max}</p>
    <p><strong>Lowest Transaction:</strong> ${min}</p>
    <p><strong>Top 3 Categories:</strong> ${top3.map(t=>t[0]).join(", ")}</p>
  `;

  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: { labels: Object.keys(categoryTotals), datasets: [{ data: Object.values(categoryTotals), backgroundColor: ["#e74c3c","#3498db","#2ecc71","#f1c40f","#9b59b6","#e67e22"] }] }
  });

  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: { labels: Object.keys(categoryTotals), datasets: [{ label: "Amount by Category", data: Object.values(categoryTotals), backgroundColor: "#1abc9c" }] },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

let cibilChart;

function generateCibilScore() {
  return Math.floor(Math.random() * (900 - 300 + 1)) + 300;
}

function updateCibilScore() {
  const finalScore = generateCibilScore();
  const scoreElem = document.getElementById("cibilScoreValue");
  const statusElem = document.getElementById("cibilStatus");
  let currentScore = 300;

  let statusText = "", color = "";
  if (finalScore >= 750) {
    statusText = "Excellent ✅ Keep it up!";
    color = "green";
  } else if (finalScore >= 650) {
    statusText = "Fair 🙂 Improve by paying dues on time.";
    color = "orange";
  } else {
    statusText = "Poor ⚠ Work on reducing debt & improving payments.";
    color = "red";
  }

  statusElem.textContent = statusText;
  statusElem.style.color = color;

  if (!cibilChart) {
    cibilChart = new Chart(document.getElementById("cibilChart"), {
      type: "doughnut",
      data: {
        labels: ["Score", "Remaining"],
        datasets: [{
          data: [0, 100],
          backgroundColor: [color, "#ecf0f1"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }

  let interval = setInterval(() => {
    if (currentScore >= finalScore) {
      clearInterval(interval);
    } else {
      currentScore += 5;
      if (currentScore > finalScore) currentScore = finalScore;
    }

    scoreElem.textContent = currentScore;
    const percentage = ((currentScore - 300) / (900 - 300)) * 100;
    cibilChart.data.datasets[0].data = [percentage, 100 - percentage];
    cibilChart.data.datasets[0].backgroundColor = [color, "#ecf0f1"];
    cibilChart.update();
  }, 20);
}

const taxQuestions = [
  "What are the income tax slabs for individuals?",
  "What is Section 80C and how much can I claim?",
  "How does double taxation avoidance agreement (DTAA) work?",
  "What is capital gains tax?",
  "What are the tax benefits of health insurance?",
  "When is the income tax return filing deadline?",
  "What is Form 16?",
  "What expenses are tax deductible?",
  "What is GST and how does it work?",
  "What are the latest corporate tax rates?",
  "How do I claim a tax refund?",
  "What is advance tax?",
  "What are HRA exemptions?",
  "What is TDS?",
  "What is MAT (Minimum Alternate Tax)?",
  "What are tax implications for freelancers?",
  "What are long-term vs short-term capital gains?",
  "What is tax residency?",
  "How do I avoid double taxation as an NRI?",
  "What are tax-saving fixed deposits?",
  "What is the penalty for late tax filing?",
  "What is presumptive taxation?",
  "What are education loan tax benefits?",
  "What are agricultural income tax rules?",
  "How does inflation indexation work for capital gains?"
];

const taxAnswers = {
  "income tax slabs": `📊 Income tax slabs vary yearly. For FY ${new Date().getFullYear()-1}-${new Date().getFullYear()}, check official govt website.`,
  "80c": "💰 Section 80C allows deductions up to ₹1.5 lakh for PPF, ELSS, Life Insurance, etc.",
  "double taxation": "🌍 DTAA prevents you from being taxed twice on the same income in two countries.",
  "capital gains": "📈 Capital gains tax is applied when you sell assets like property, stocks, or gold.",
  "health insurance": "🏥 Premiums on health insurance qualify for tax deduction under Section 80D.",
  "deadline": "🗓️ Usually July 31 is the ITR filing deadline in many countries (varies locally).",
  "form 16": "📄 Form 16 is issued by employers summarizing TDS for employees.",
  "deductible": "✅ Tax deductible expenses include investments, donations, and medical insurance.",
  "gst": "💡 Goods & Services Tax (GST) is an indirect tax on supply of goods & services.",
  "corporate tax": "🏢 Corporate tax rates differ globally; check official finance ministry updates.",
  "refund": "💵 File your ITR to claim any tax refunds due to excess TDS.",
  "advance tax": "💰 Advance tax is payable if your tax liability exceeds a threshold (like ₹10,000 in India).",
  "hra": "🏠 HRA exemption depends on rent, salary, and city of residence.",
  "tds": "🔖 Tax Deducted at Source (TDS) is deducted by the payer before payment.",
  "mat": "⚖️ MAT ensures companies with zero tax liability still pay a minimum tax.",
  "freelancers": "💻 Freelancers must pay tax on income after expenses; advance tax may apply.",
  "long-term": "📊 Long-term CG is taxed at a lower rate; short-term is taxed as per slab.",
  "residency": "🌍 Residency depends on no. of days spent in a country during financial year.",
  "nri": "🌎 NRIs can avoid double taxation via DTAA treaties.",
  "fixed deposits": "🏦 Tax-saving FDs (5-year lock-in) qualify under Section 80C.",
  "penalty": "⚠️ Late filing may attract penalties and interest on tax due.",
  "presumptive": "📘 Simplified scheme for small businesses to declare income at fixed % of turnover.",
  "education loan": "🎓 Interest on education loans eligible for deduction under Section 80E.",
  "agricultural": "🌱 Agricultural income is exempt in many countries, subject to limits.",
  "indexation": "📉 Indexation adjusts asset cost with inflation for capital gains tax."
};
const dropdown = document.getElementById("taxDropdown");
taxQuestions.forEach(q => {
  let opt = document.createElement("option");
  opt.value = q;
  opt.textContent = q;
  dropdown.appendChild(opt);
});
document.getElementById('askBtn').addEventListener('click', () => {
  let q = document.getElementById('taxQuestion').value || dropdown.value;
  const replyDiv = document.getElementById('taxReply');
  if (!q) { replyDiv.innerHTML = "⚠️ Please select or type a question."; return; }
  const key = Object.keys(taxAnswers).find(k => q.toLowerCase().includes(k));
  let ans = key ? taxAnswers[key] : "❓ Sorry, I don’t have";
  replyDiv.innerHTML = ans;
});
