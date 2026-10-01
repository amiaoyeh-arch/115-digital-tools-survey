# 學習共同體輔導團｜「數位工具教與學」2小時到校輔導 前置教師問卷調查系統

本專案為學習共同體輔導團專屬打造的 **「數位工具教與學」2 小時入校輔導前置教師調查響應式網頁系統（RWD）**。
協助輔導團在入校輔導前，快速蒐集並掌握受輔導學校教師的數位成熟度、硬體環境、學共實踐卡點與研習模組期待，精準調配 2 小時研習的時間配比。

---

## 🌟 系統亮點特色

1. **RWD 跨裝置響應式設計**：
   - 手機、平板、電腦皆能以卡片式介面順暢填寫。
   - 採用學習共同體溫潤綠（Sage & Forest Green）視覺設計，字體清晰易讀。
2. **分步引導式填答 (Step-by-step Wizard)**：
   - 題目分為「基本背景」、「工具環境」、「學共卡點」、「研習期待」四大維度。
   - 支援進度百分比、即時必填驗證、本地自動草稿儲存（Auto-draft）。
3. **內建講師數據分析儀表板 (Dashboard)**：
   - 輔導團講師可於頂部一鍵切換「講師分析儀表板」。
   - 提供 4 大關鍵指標（KPI）與 5 大視覺化互動圖表（年段分佈、工具排行、硬體現況、痛點雷達、研習模組期待）。
   - 彙整教師個別提問留言板，利於研習現場逐一釋疑。
4. **多元資料儲存與匯出**：
   - **本機數據庫**：自動存於 LocalStorage，免伺服器即可離線或本機運作。
   - **Excel 相容匯出**：一鍵下載 CSV（內建 UTF-8 BOM，Excel 開啟絕不亂碼）與 JSON 格式。
   - **示範資料模式**：內建「載入示範資料」按鈕，方便輔導團出發前或簡報時演示圖表效果。
   - **Google 試算表串接 (可選)**：支援填入 Google Apps Script Webhook，問卷送出時自動同步至 Google 試算表。

---

## 📁 檔案結構

```
E:\2026AI_agent\115數位工具教與學\
├── index.html              # 主問卷與填答/儀表板入口 (雙擊即可在瀏覽器開啟)
├── css/
│   └── style.css           # 學共溫潤綠風格與 RWD 響應式佈局樣式
├── js/
│   ├── survey-data.js      # 問卷題目結構定義、預設選項與示範數據庫
│   ├── survey-app.js       # 表單渲染、步驟推進、草稿存取、送出邏輯
│   └── dashboard.js        # 講師分析儀表板 (Chart.js 圖表渲染與資料匯出)
└── README.md               # 專案說明與操作手冊
```

---

## 📋 問卷調查題目架構（12大核心題目）

### 第一部分：教師基本背景資料
- **Q1. 任教年段 / 職務**（低年級、中年級、高年級、國高中、科任、行政）
- **Q2. 主要授課領域**（國語、數學、英語、自然、社會、藝文、健體、綜合、科技等複選）
- **Q3. 教學年資**（初任 1~3 年、中生代 4~10 年、資深 11~20 年、資深領航 21 年以上）

### 第二部分：校園數位環境與常用工具現況
- **Q4. 常態授課教室硬體設備**（大觸控螢幕、投影機、1:1 iPad、1:1 Chromebook、小組共用平板等）
- **Q5. 常用教學軟體與平台**（Google Classroom、Padlet、Canva、Gemini、NotebookLM、Microsoft Copilot、ChatGPT / GPT、微軟Office、因材網等）
- **Q6. 生成式 AI 使用經驗**（從未接觸、初學體驗、個人備課、課堂教學融入、深度專家）

### 第三部分：學習共同體課堂融入與教學卡點
- **Q7. 最希望運用數位工具的學共環節**（自學預習、小組共學/互學、伸展跳躍任務、全班對話傾聽、歷程評量、AI解構備課）
- **Q8. 結合學共時的最大痛點/卡點**（最多選3項：載具分心、耗時壓縮對話、跳躍任務設計難、缺乏教材、連線問題、AI不知如何用、擔憂弱化傾聽關係）
- **Q9. 課堂操作數位載具整體信心度**（1~5分量表）
- **Q10. 運用數位工具/AI設計學共跳躍任務信心度**（1~5分量表）

### 第四部分：2小時入校輔導期待與現場提問
- **Q11. 最想學習/體驗的實作模組（可複選）**：
  - 【模組A】生成式 AI 輔助學共教案與跳躍任務命題實戰 (ChatGPT / Gemini / NotebookLM)
  - 【模組B】小組共學互學神器：Padlet 與免付費數位互動工具在學共課堂的實務操作
  - 【模組C】課堂傾聽與思維可視化：用數位工具記錄學生對話與高光頓悟
  - 【模組D】破除數位分心：學習共同體下的載具班級經營與課堂常規建立
  - 【模組E】分科領域實作工作坊：帶各領域老師產出下週就能上陣的數位學共教案
  - 【模組F】公開課課例示範與數位議課實踐
- **Q12. 現場想向講師請教的具體問題或難題**（開放式文字填答）

---

## 🚀 快速上手使用指引

### 1. 本機直接執行
- 直接雙擊開啟 [`index.html`](file:///E:/2026AI_agent/115數位工具教與學/index.html) 即可開始填寫或查看儀表板。

### 2. 發布給全校教師填寫
可使用以下方式發布網址給老師：
- **方式 A（推薦）：GitHub Pages**
  - 將本資料夾推播至 GitHub Repository 並開啟 Pages，即可取得公開網址（如 `https://<username>.github.io/<repo>/`）。
- **方式 B：學校內部網頁伺服器 / Netlify**
  - 將專案資料夾上傳至校內 Web Server 或 Netlify 拖曳部署。

### 3. 串接 Google 試算表 (Google Apps Script Webhook)
若希望老師填答後自動寫入 Google 試算表：
1. 建立一個 Google 試算表。
2. 點擊「擴充功能」>「Apps Script」，貼上下方程式碼並「部署為網頁應用程式」（存取權限設為「任何人」）：
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.id,
       data.timestamp,
       data.school_role,
       Array.isArray(data.teaching_subject) ? data.teaching_subject.join(";") : data.teaching_subject,
       data.teaching_years,
       Array.isArray(data.hardware_env) ? data.hardware_env.join(";") : data.hardware_env,
       Array.isArray(data.app_tools) ? data.app_tools.join(";") : data.app_tools,
       data.ai_experience,
       Array.isArray(data.slc_stages) ? data.slc_stages.join(";") : data.slc_stages,
       Array.isArray(data.pain_points) ? data.pain_points.join(";") : data.pain_points,
       data.confidence_digital,
       data.confidence_jumping_task,
       Array.isArray(data.workshop_modules) ? data.workshop_modules.join(";") : data.workshop_modules,
       data.specific_question
     ]);
     return ContentService.createTextOutput("OK");
   }
   ```
3. 在儀表板點擊「🔗 雲端同步設定」，貼上部署獲得的 Webhook URL 即可！

---

## 🛠️ 客製化修改題目

若需要調整問卷題目、新增年段或修改研習模組選項：
- 請開啟 [`js/survey-data.js`](file:///E:/2026AI_agent/115數位工具教與學/js/survey-data.js) 檔案，直接編輯 `SURVEY_CONFIG` 物件中的題目與選項文字即可。
