# 記帳工具

## 組員分工
| 組員 | 負責項目 |
|------|------------|
| 黃俞媞 | HTML 結構設計、Bootstrap 版面配置、JavaScript 互動功能、localStorage、表單驗證 |
| 簡宥莉 | CSS 設計、深色模式 |
| 蒲羿妃 | CSS 設計、RWD、JavaScript 互動功能 |

---

## 專案簡介
這是一個以 HTML+CSS+JavaScript 製作的互動式記帳工具，支援：收入與支出分類統計、深淺色主題切換、資料永久儲存(localStorage) 、每月與年度圖表分析。
版面設計以淺色以藍色系為主，深色以深灰色為主，簡約清晰並適配所有螢幕比例。

---

## 使用技術
- HTML5 + Bootstrap 5  
- CSS3（RWD、深色模式、動畫）
- JavaScript（DOM操作、Constraint Validation API、localStorage）

---

## 功能特色
1. 表單即時驗證（空白、金額需大於0）
2. 新增「收入」或「支出」紀錄，並且以顏色標記區分
1. 刪除記帳項目
2. 可自訂分類（如新增「投資」、「旅遊」等）
3. 自動計算結餘、本月與本年收入、支出總額
4. 以圖表呈現每月與年度的統計結果
5. 支援 localStorage，自動保存紀錄，下次開啟不會消失

---

## GitHub Pages 展示
> https://y921031.github.io/114_web_midterm_project/index.html

---

## 專案結構
```
midterm_project/
├── index.html
├── style.css
├── script.js
├── screenshots/
└── README.md
```

---

## 加分項目
- 深色/淺色模式切換（會記錄使用者偏好）
- localStorage儲存資料
- 雙統計圖表（每月、每年：收入+支出）
- 自動RWD適應各種螢幕比例
