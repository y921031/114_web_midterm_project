const body = document.body;
const modeToggle = document.getElementById("modeToggle");
const incomeBtn = document.getElementById("incomeBtn");
const expenseBtn = document.getElementById("expenseBtn");
const form = document.getElementById("recordForm");
const recordList = document.getElementById("recordList");
const categorySelect = document.getElementById("category");
const newCategoryInput = document.getElementById("newCategory");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");

let records = JSON.parse(localStorage.getItem("records")) || [];
let currentType = "收入";

// 初始化主題
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark-mode");
  modeToggle.textContent = "淺色模式";
}

// 模式切換
modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const dark = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", dark);
  modeToggle.textContent = dark ? "淺色模式" : "深色模式";
});

// 收入 / 支出切換
incomeBtn.addEventListener("click", () => {
  currentType = "收入";
  incomeBtn.classList.add("active");
  expenseBtn.classList.remove("active");
});
expenseBtn.addEventListener("click", () => {
  currentType = "支出";
  expenseBtn.classList.add("active");
  incomeBtn.classList.remove("active");
});

// 新增分類
document.getElementById("addCategory").addEventListener("click", () => {
  const newCat = newCategoryInput.value.trim();
  if (newCat) {
    const option = document.createElement("option");
    option.value = newCat;
    option.textContent = newCat;
    categorySelect.appendChild(option);
    newCategoryInput.value = "";
  }
});

// 表單送出
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = categorySelect.value;
  const date = document.getElementById("date").value;
  if (!amount || !date) return alert("請輸入金額與日期！");
  const record = { type: currentType, amount, category, date };
  records.push(record);
  localStorage.setItem("records", JSON.stringify(records));
  renderRecords();
  form.reset();
});

// 渲染記錄
function renderRecords() {
  recordList.innerHTML = "";
  let income = 0, expense = 0;
  records.forEach((r, i) => {
    if (r.type === "收入") income += r.amount;
    else expense += r.amount;

    const div = document.createElement("div");
    div.classList.add("record-card");
    div.innerHTML = `
      <div class="record-info">
        <strong>${r.type}</strong>
        <span>分類：${r.category}</span>
        <span>日期：${r.date}</span>
      </div>
      <div>
        <span style="font-weight:bold;">$${r.amount}</span>
        <button class="delete-btn" data-index="${i}">刪除</button>
      </div>
    `;
    recordList.appendChild(div);
  });
  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  updateCharts();
}

// 刪除紀錄
recordList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index;
    records.splice(index, 1);
    localStorage.setItem("records", JSON.stringify(records));
    renderRecords();
  }
});

// 📊 統計圖
let monthChart, yearChart;
function updateCharts() {
  const ctxM = document.getElementById("monthChart").getContext("2d");
  const ctxY = document.getElementById("yearChart").getContext("2d");
  const monthly = Array(12).fill(0);
  const yearly = {};

  records.forEach(r => {
    const date = new Date(r.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    if (r.type === "支出") monthly[month] += r.amount;
    yearly[year] = (yearly[year] || 0) + r.amount;
  });

  if (monthChart) monthChart.destroy();
  if (yearChart) yearChart.destroy();

  monthChart = new Chart(ctxM, {
    type: "bar",
    data: {
      labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
      datasets: [{ label: "每月支出", data: monthly, backgroundColor: "#a8d8ff" }]
    }
  });

  yearChart = new Chart(ctxY, {
    type: "bar",
    data: {
      labels: Object.keys(yearly),
      datasets: [{ label: "年度總支出", data: Object.values(yearly), backgroundColor: "#a8d8ff" }]
    }
  });
}

renderRecords();
