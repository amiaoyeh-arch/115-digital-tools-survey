# 學習共同體輔導團｜「數位工具教與學」前置問卷調查系統 工作紀錄 (agent.md)

## 📌 專案概述
- **專案名稱**：115數位工具教與學 前置問卷調查系統
- **目標用途**：學習共同體輔導團 2 小時「數位工具教與學」入校輔導前置教師使用情形調查（RWD 響應式網頁 + 講師分析儀表板 + Google 試算表後端）
- **發布網址**：https://amiaoyeh-arch.github.io/115-digital-tools-survey/
- **GitHub 儲存庫**：https://github.com/amiaoyeh-arch/115-digital-tools-survey
- **本機目錄**：`E:\2026AI_agent\115數位工具教與學`
- **雲端同步目錄**：`G:\我的雲端硬碟\202607_AI學習\115數位工具教與學`

---

## ✅ 本次完成事項
1. **RWD 響應式問卷網頁建置**：
   - 包含四大維度（基本背景、工具環境、學共卡點、研習期待）共 12 題核心設計。
   - 支援自動草稿暫存 (LocalStorage)、步驟式引導、即時防漏填驗證與流暢動畫。
2. **題目選項客製優化**：
   - 刪除付費軟體（LoiloNote, Kahoot, Quizizz, Blooket, Slido, Mentimeter）。
   - 新增主流生成式 AI 與免費普及工具（Gemini, NotebookLM, Microsoft Copilot, ChatGPT/GPT）。
3. **講師數據分析儀表板 (Dashboard)**：
   - 提供 4 大關鍵指標（KPI）與 5 大視覺化圖表（Chart.js）。
   - 支援 CSV (UTF-8 with BOM) 與 JSON 資料匯出、示範數據載入與教師個別提問留言看板。
4. **雲端後端整合 (Google Apps Script Webhook)**：
   - 串接專屬 Webhook，線上問卷送出時自動 1 秒內非同步寫入使用者的 Google 試算表（`115數位工具教與學_問卷回覆`）。
5. **部署與多重備份**：
   - 部署至 GitHub Pages 線上公開運作。
   - 完整同步鏡像至 Google 雲端硬碟。

---

## 🔮 下一步計畫 / 維護建議
- 研習前 3 天：於 Google 試算表或講師儀表板檢視問卷回收統計，掌握受輔導學校教師痛點。
- 研習當日：講師可直接運用儀表板視覺化圖表作為開場破冰與 2 小時模組時間調配依據。
