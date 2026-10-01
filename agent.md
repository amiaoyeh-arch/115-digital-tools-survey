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

## ✅ 完成事項
1. **Logo 品牌視覺整合**：
   - 頂部導覽列、問卷橫幅（Hero Banner）與瀏覽器頁籤（Favicon）已全面置入專屬圓角陰影 Logo（`數位工具教與學圖像.PNG`）。
2. **題目結構優化（標準 14 題）**：
   - 常用數位工具清單首項新增「AI Agent (例如：Google Antigravity、ChatGPT (OpenAI)、Claude (Anthropic)、Microsoft Copilot Studio)」。
   - 移除自填題目，精簡填答體驗，題號依序重新編排為 Q1~Q14。
3. **Google 試算表即時雙向同步機制（純唯讀保證）**：
   - Apps Script 部署 `doGet(e)` 與 `doPost(e)`，支援依學校自動建立工作表分頁並支援即時 JSON 讀取 API。
   - 講師分析端（`admin.html`）實現自動開頁同步、手動「🔄 同步試算表數據」、最後同步時間指示與離線快取保護。
   - 完全移除清除數據功能，確保後端試算表資料 100% 唯讀安全，不被修改或刪除。
4. **雲端與 GitHub 同步更新**：
   - 程式碼已全數推播至 GitHub Pages。
   - 檔案已透過 Robocopy 完整備份至 Google 雲端硬碟。

---

## 🔮 下一步計畫 / 備忘
- 研習現場或行前會議時，講師可直接開啟 `admin.html`，透過「🏫 學校下拉選單」切換檢視特定學校之教師問卷統計與痛點分析。
