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
1. **背景資料題目優化**：
   - 新增「學校名稱（例如：新北市文林國小）」必填欄位。
   - 年段選項移除「國中/高中部」，聚焦國小學段。
2. **工具使用現況深化**：
   - 新增「使用數位載具/工具頻率」單選評估。
   - 明確常用軟體與生成式 AI 工具（Gemini, NotebookLM, Copilot, ChatGPT 等），並增加其他工具自填欄位。
3. **前瞻架構：前後端頁面分離**：
   - `index.html`：純淨教師填答端，無任何後端儀表板與數據干擾。
   - `admin.html`：講師專屬分析後端，支援「依學校名稱下拉篩選」、6大視覺化圖表與 Excel CSV 匯出。
4. **Google 試算表多學校工作表 (Tab) 自動分流**：
   - 提供依 `school_name` 自動建立與寫入專屬 Sheet 的 Google Apps Script 程式碼。
5. **雲端與 GitHub 同步更新**：
   - 推播至 GitHub Pages 與 Google 雲端硬碟。

---

## 🔮 下一步計畫 / 維護建議
- 請於 Google 試算表更新 Apps Script 程式碼為多工作表分流版本。
- 研習前透過 `admin.html` 篩選該受輔導學校，即時掌握教師痛點與工具偏好。
