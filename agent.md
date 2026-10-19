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

## 🖥️ 簡報大螢幕投影（86吋大屏）視認性規範【永久自動遵循】

為符合研習現場 86 吋大型觸控螢幕與後排學員觀看需求，**未來每次產生或調整任何學校的簡報檔 (PPTX) 與 PDF 檔時，必須永久自動遵循 `scripts/deck_theme.py` 規範，無須使用者重複提醒**：

1. **字級強制下限**：
   - **封面主標題**：`38 ~ 44 pt`（加粗，對比鮮明）
   - **頁面大標題**：`26 ~ 32 pt`（加粗，深墨綠 `#1b4332`）
   - **卡片/內容大標**：`20 ~ 24 pt`（加粗）
   - **正文條列重點**：`15 ~ 18 pt`（**絕對禁止低於 13 pt**）
   - **表格內文**：`14 ~ 15 pt`
   - **關鍵數據 KPI**：`36 ~ 52 pt`（巨型數字衝擊）
   - **HTML / PDF 向量畫布 (1920x1080)**：正文一律 `20 ~ 24 px`，標題 `42 ~ 54 px`，**禁止低於 18 px**。
2. **自動化工具庫**：
   - 核心標準設定：`[scripts/deck_theme.py](file:///E:/2026AI_agent/115數位工具教與學/scripts/deck_theme.py)`
   - 自動生成與檢核腳本：`[scripts/generate_workshop_deck.py](file:///E:/2026AI_agent/115數位工具教與學/scripts/generate_workshop_deck.py)`
   - 產出後自動執行 `validate_pptx_typography()` 確保全簡報符合視認性標準。

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
4. **二橋國小 2 小時到校輔導教案簡報與 PDF 產出（大字大屏版）**：
   - 深度解析二橋國小 19 位教師前置問卷診斷（年資 95% 中生代與資深、100% 內建 86 吋觸控螢幕、載具分心 53%、跳躍任務信心 2.68 分偏低）。
   - 依大螢幕規範產出 16:9 專業大字版 PowerPoint 簡報檔：`新北市二橋國小_數位工具教與學_2小時到校輔導教案簡報.pptx`。
   - 產出 16:9 大字高解析向量 PDF 簡報檔：`新北市二橋國小_數位工具教與學_2小時到校輔導教案簡報.pdf`。
   - 同步備份至 Google 雲端硬碟 `G:\我的雲端硬碟\202607_AI學習\115數位工具教與學\`。
5. **模組化腳本固化（Scripts）**：
   - 建立 `scripts/deck_theme.py`、`scripts/generate_workshop_deck.py` 與 `scripts/README.md`，將大螢幕投影字級規範直接程式化，後續產生各校簡報時一鍵套用且品質一致。
6. **雲端與 GitHub 同步更新**：
   - 程式碼、腳本庫與簡報檔已全數推播至 GitHub Pages。
   - 檔案已透過 Robocopy 完整備份至 Google 雲端硬碟。

---

## 🔮 下一步計畫 / 備忘
- 未來若有其他學校需產出教案簡報，直接執行 `python scripts/generate_workshop_deck.py` 即可自動產出合規大字版 PPTX 與 PDF。
- 輔導團夥伴行前備課時，可直接投影播放或分享 PDF / PPTX 簡報檔。
