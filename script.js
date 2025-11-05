const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const recordList = document.getElementById("record-list");
const totalAmount = document.getElementById("total-amount");
const themeBtn = document.getElementById("toggle-theme");

let records = JSON.parse(localStorage.getItem("records")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

if (darkMode) document.body.classList.add("dark");

updateList();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  const record = {
    id: Date.now(),
    title: titleInput.value.trim(),
    amount: parseFloat(amountInput.value),
    type: typeSelect.value,
  };

  records.push(record);
  saveAndRender();
  form.reset();
  form.classList.remove("was-validated");
});

function updateList() {
  recordList.innerHTML = "";
  let total = 0;

  records.forEach((r) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center fade-in";

    li.innerHTML = `
      <span>${r.title} <small class="${r.type}">
      (${r.type === "income" ? "+" : "-"}${r.amount})
      </small></span>
      <button class="btn btn-sm btn-outline-danger">刪除</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      records = records.filter((item) => item.id !== r.id);
      saveAndRender();
    });

    recordList.appendChild(li);
    total += r.type === "income" ? r.amount : -r.amount;
  });

  totalAmount.textContent = total;
}

function saveAndRender() {
  localStorage.setItem("records", JSON.stringify(records));
  updateList();
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkMode = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", darkMode);
  themeBtn.textContent = darkMode ? "☀️ 淺色模式" : "🌙 深色模式";
});