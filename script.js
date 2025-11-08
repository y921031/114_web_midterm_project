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

// 收入/支出分類
const categories = {
  收入: ["薪水", "獎金", "投資", "其他收入"],
  支出: ["飲食", "交通", "娛樂", "生活用品"]
};

let records = JSON.parse(localStorage.getItem("records")) || [];
let currentType = "支出"; // 預設支出

// 初始化分類
function renderCategory() {
  categorySelect.innerHTML = "";
  categories[currentType].forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    categorySelect.appendChild(option);
  });
}
renderCategory();

// 初始化主題
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark-mode");
  modeToggle.textContent = "切換為淺色模式";
}

// 模式切換
modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const dark = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", dark);
  modeToggle.textContent = dark ? "切換為淺色模式" : "切換為深色模式";
});

// 收入/支出切換
incomeBtn.addEventListener("click", () => {
  currentType = "收入";
  incomeBtn.classList.add("active");
  expenseBtn.classList.remove("active");
  renderCategory();
});
expenseBtn.addEventListener("click", () => {
  currentType = "支出";
  expenseBtn.classList.add("active");
  incomeBtn.classList.remove("active");
  renderCategory();
});

// 新增分類
document.getElementById("addCategory").addEventListener("click", () => {
  const newCat = newCategoryInput.value.trim();
  if (newCat && !categories[currentType].includes(newCat)) {
    categories[currentType].push(newCat);
    renderCategory();
    newCategoryInput.value = "";
  }
});

// 表單送出
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = categorySelect.value;
  const date = document.getElementById("date").value;

  // UX 提示與金額限制
  if (!amount || !date) {
    formMessage.textContent = "金額不得為0！";
    formMessage.style.display = "block";
    return;
  } else if (amount <= 0) {
    formMessage.textContent = "金額必須大於 0！";
    formMessage.style.display = "block";
    return;
  }
  formMessage.style.display = "none";

  const record = { type: currentType, amount, category, date };
  records.unshift(record); // 新增在最上方
  localStorage.setItem("records", JSON.stringify(records));
  renderRecords();
  form.reset();
});

// 渲染紀錄
function renderRecords() {
  recordList.innerHTML = "";
  let incomeTotal = 0, expenseTotal = 0;

  records.forEach((r, i) => {
    if (r.type === "收入") incomeTotal += r.amount;
    else expenseTotal += r.amount;

    const div = document.createElement("div");
    div.classList.add("record-card");
    if (r.type === "收入") div.classList.add("income");
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

  totalIncomeEl.textContent = incomeTotal;
  totalExpenseEl.textContent = expenseTotal;

  const balance = incomeTotal - expenseTotal;
  document.getElementById("balance").textContent = balance.toFixed(0);

  updateCharts();
}

//美化餘額
const balanceEl = document.getElementById("balance");

if (balance >= 0) {
  balanceEl.style.color = "#2e9e53";
} else {
  balanceEl.style.color = "#d94a4a";
}


// 刪除紀錄
recordList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index;
    const card = e.target.closest(".record-card");
    card.classList.add("removing");
    setTimeout(() => {
      records.splice(index, 1);
      localStorage.setItem("records", JSON.stringify(records));
      renderRecords();
    }, 300); // 等動畫完成再刪除
  }
});

// 統計圖
let monthChart, yearChart;
function updateCharts() {
  const ctxM = document.getElementById("monthChart").getContext("2d");
  const ctxY = document.getElementById("yearChart").getContext("2d");

  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);
  const yearlyIncome = {};
  const yearlyExpense = {};

  records.forEach(r => {
    const date = new Date(r.date);
    const month = date.getMonth();
    const year = date.getFullYear();

    if (r.type === "收入") {
      monthlyIncome[month] += r.amount;
      yearlyIncome[year] = (yearlyIncome[year] || 0) + r.amount;
    } else {
      monthlyExpense[month] += r.amount;
      yearlyExpense[year] = (yearlyExpense[year] || 0) + r.amount;
    }
  });

  if (monthChart) monthChart.destroy();
  if (yearChart) yearChart.destroy();

  const isDark = body.classList.contains("dark-mode");

  // 月統計
  monthChart = new Chart(ctxM, {
    type: "bar",
    data: {
      labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      datasets: [
        { label: "收入", data: monthlyIncome, backgroundColor: isDark ? "#888" : "#4ea1d3" },
        { label: "支出", data: monthlyExpense, backgroundColor: isDark ? "#555" : "#a8d8ff" }
      ]
    }
  });

  // 年統計
  const years = Array.from(new Set([...Object.keys(yearlyIncome), ...Object.keys(yearlyExpense)]));
  const incomeData = years.map(y => yearlyIncome[y] || 0);
  const expenseData = years.map(y => yearlyExpense[y] || 0);

  yearChart = new Chart(ctxY, {
    type: "bar",
    data: {
      labels: years,
      datasets: [
        { label: "收入", data: incomeData, backgroundColor: isDark ? "#888" : "#4ea1d3" },
        { label: "支出", data: expenseData, backgroundColor: isDark ? "#555" : "#a8d8ff" }
      ]
    }
  });

  // 顯示總額文字
  document.getElementById("monthSummary").textContent =
    `本月收入：$${monthlyIncome.reduce((a, b) => a + b, 0)}, 本月支出：$${monthlyExpense.reduce((a, b) => a + b, 0)}`;
  document.getElementById("yearSummary").textContent =
    `本年收入：$${incomeData.reduce((a, b) => a + b, 0)}, 本年支出：$${expenseData.reduce((a, b) => a + b, 0)}`;
}

renderRecords();
