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
1. **Google 試算表即時雙向同步機制（純唯讀保證）**：
   - Apps Script 新增 `doGet(e)` 函式，自動輪詢試算表內所有學校分頁（Tabs），將全體教師回覆整合為 JSON API。
   - 講師端 `admin.html` 與 `dashboard.js` 實現開頁自動同步、手動「🔄 同步試算表數據」與離線快取功能。
   - 完全移除清除資料按鈕，網頁端只進行即時唯讀檢視、圖表統計與 CSV/JSON 匯出，絕對不修改/刪除試算表原始資料。
2. **加入專屬品牌 Logo 視覺**：
   - 於頂部導覽列、問卷橫幅（Hero Banner）與 Favicon 置入 `數位工具教與學圖像.PNG`。
3. **雲端與 GitHub 同步更新**：
   - 完成 Git Commit 並推播至 GitHub Pages。
   - 使用 Robocopy 完整同步至 Google 雲端硬碟備份。

---

## 🔮 下一步計畫 / 操作指引
- 請於 Google 試算表「擴充功能」>「Apps Script」貼上包含 `doGet` 與 `doPost` 的完整最新程式碼，並點擊「部署」>「管理部署作業」>「編輯」> 選擇「新版本」完成發布。
