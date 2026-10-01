# 學習共同體輔導團｜「數位工具教與學」前置問卷調查系統 工作紀錄 (agent.md)

## 📌 專案概述
- **專案名稱**：115數位工具教與學 前置問卷調查系統
- **目標用途**：學習共同體輔導團 2 小時「數位工具教與學」入校輔導前置教師使用情形調查（RWD 響應式網頁 + 講師分析儀表板 + Google 試算表多學校分流後端）
- **教師填答網址**：https://amiaoyeh-arch.github.io/115-digital-tools-survey/
- **講師分析後端**：https://amiaoyeh-arch.github.io/115-digital-tools-survey/admin.html
- **GitHub 儲存庫**：https://github.com/amiaoyeh-arch/115-digital-tools-survey
- **本機目錄**：`E:\2026AI_agent\115數位工具教與學`
- **雲端同步目錄**：`G:\我的雲端硬碟\202607_AI學習\115數位工具教與學`

---

## ✅ 本次完成事項
1. **數位工具選項升級**：
   - 常用數位工具清單首項加入「AI Agent (例如：Google Antigravity、ChatGPT (OpenAI)、Claude (Anthropic)、Microsoft Copilot Studio)」。
   - 移除原第 8 題「其他您常使用的數位工具或 App 名稱（選填）」，精簡填答流程。
   - 問卷題號全面依序重新編排為 Q1~Q14（共 14 題標準架構）。
2. **前後端整合與代碼校準**：
   - `survey-data.js`：更新題目結構、選項與清空示範數據。
   - `dashboard.js`：移除已刪除欄位之引用，更新 CSV 匯出欄位對齊 14 題格式。
   - `README.md`：同步更新 14 題架構說明與對應之 Google Apps Script 多學校工作表分流程式碼。
3. **雲端與 GitHub 同步更新**：
   - 完成 Git Commit 並推播至 GitHub Pages。
   - 使用 Robocopy 完整同步至 Google 雲端硬碟備份。

---

## 🔮 下一步計畫 / 維護建議
- 請於 Google 試算表「擴充功能」>「Apps Script」中更新為最新分流程式碼（共 16 欄位對齊 14 題）。
- 研習前透過 `admin.html` 依學校篩選該校資料，即時調整 2 小時課程模組比重。
