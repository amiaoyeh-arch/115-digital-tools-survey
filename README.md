# 學習共同體輔導團｜「數位工具教與學」2小時到校輔導 前置教師問卷調查系統

本專案為學習共同體輔導團專屬打造的 **「數位工具教與學」2 小時入校輔導前置教師調查響應式網頁系統（RWD）**。
協助輔導團在入校輔導前，快速蒐集並掌握受輔導學校教師的數位成熟度、硬體環境、工具使用頻率、學共實踐卡點與研習模組期待，精準調配 2 小時研習的時間配比。

---

## 🌟 系統特色與架構

1. **教師端純淨填答介面 (`index.html`)**：
   - 專為受訪教師設計，無任何後端統計干擾，手機/平板/電腦完美適配。
   - 包含學校名稱、年段（已排除國高中）、學科領域、年資、硬體環境、數位載具使用頻率、常用軟體與 AI 工具、學共卡點與 2 小時研習模組期待。
   - 支援自動草稿暫存與即時防漏填驗證。
2. **講師專屬分析後端 (`admin.html`)**：
   - 僅供輔導團講師檢視與分析，不向填寫教師公開。
   - **支援「依學校名稱下拉篩選」**（可檢視全體彙整或單一學校數據）。
   - 提供 4 大關鍵指標（KPI）與 6 大視覺化互動圖表（年段、使用頻率、工具排行、硬體現況、痛點雷達、模組期待）。
   - 一鍵匯出該校 Excel CSV (UTF-8 BOM) 或 JSON 備份檔。
3. **Google 試算表多學校工作表 (Tab) 自動分流**：
   - 填寫問卷時，系統會依據教師填寫的「學校名稱」（如：新北市文林國小），自動於 Google 試算表中建立專屬的工作表 Tab 並寫入資料！

---

## 📁 檔案結構

```
E:\2026AI_agent\115數位工具教與學\
├── index.html              # 教師填答入口 (公開分享給各校老師)
├── admin.html              # 講師專屬後端分析儀表板 (講師專用，依學校篩選與匯出)
├── css/
│   └── style.css           # 學共溫潤綠風格與 RWD 樣式
├── js/
│   ├── survey-data.js      # 問卷題目定義與示範資料庫
│   ├── survey-app.js       # 表單渲染與 Webhook 同步邏輯 (教師端)
│   └── dashboard.js        # 講師分析儀表板與學校篩選邏輯 (admin端)
└── README.md               # 專案說明與 Apps Script 部署指引
```

---

## 📋 問卷調查題目架構（15大核心題目）

### 第一部分：教師基本背景資料
- **Q1. 服務學校全銜**（文字輸入，例如：新北市文林國小）
- **Q2. 主要任教年段 / 職務**（低年級、中年級、高年級、專任科任、兼任行政）
- **Q3. 主要授課領域**（國語、數學、英語、自然、社會、藝文、健體、綜合、科技等複選）
- **Q4. 教學年資**（初任 1~3 年、中生代 4~10 年、資深 11~20 年、資深領航 21 年以上）

### 第二部分：校園數位環境與工具使用現況
- **Q5. 常態授課教室硬體設備**（大觸控螢幕、投影機、1:1 iPad、1:1 Chromebook、小組共用平板等）
- **Q6. 使用數位載具/工具頻率**（每堂課4次以上、每週2~3次、每週1次、每月1~2次、極少/僅公開課、從未使用）
- **Q7. 常用教學工具與 AI 平台**（Gemini、NotebookLM、Copilot、ChatGPT、Padlet、Canva、Classroom、Office等）
- **Q8. 其他常用工具名稱**（自填文字，例如：Wordwall, Quizizz, Kahoot 等）
- **Q9. 生成式 AI 使用經驗**（從未接觸、初學體驗、個人備課、課堂教學融入、深度專家）

### 第三部分：學習共同體課堂融入與教學卡點
- **Q10. 最希望運用數位工具的學共環節**（自學預習、小組共學/互學、伸展跳躍任務、全班對話傾聽、歷程評量、AI解構備課）
- **Q11. 結合學共時的最大痛點/卡點**（最多選3項：載具分心、耗時壓縮對話、跳躍任務設計難、缺乏教材、連線問題、AI不知如何用、擔憂弱化傾聽關係）
- **Q12. 課堂操作數位載具整體信心度**（1~5分量表）
- **Q13. 運用數位工具/AI設計學共跳躍任務信心度**（1~5分量表）

### 第四部分：2小時入校輔導期待與現場提問
- **Q14. 最想學習/體驗的實作模組（可複選）**：
  - 【模組A】生成式 AI 輔助學共教案與跳躍任務命題實戰 (ChatGPT / Gemini / NotebookLM)
  - 【模組B】小組共學互學神器：Padlet 與免付費數位互動工具在學共課堂的實務操作
  - 【模組C】課堂傾聽與思維可視化：用數位工具記錄學生對話與高光頓悟
  - 【模組D】破除數位分心：學習共同體下的載具班級經營與課堂常規建立
  - 【模組E】分科領域實作工作坊：帶各領域老師產出下週就能上陣的數位學共教案
  - 【模組F】公開課課例示範與數位議課實踐
- **Q15. 現場想向講師請教的具體問題或難題**（開放式文字填答）

---

## ⚙️ Google Apps Script 多學校工作表分流程式碼

請於您的 Google 試算表「擴充功能」>「Apps Script」中貼上下方程式碼並**重新部署**，即可達成「依學校名稱自動建立專屬工作表 Tab」：

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    
    // 取得學校名稱（若未填則預設為 "一般回覆"）
    var schoolName = (data.school_name || "一般回覆").trim().replace(/[\/\\?*:[\]]/g, "_");
    
    // 尋找或建立該學校的工作表
    var sheet = ss.getSheetByName(schoolName);
    if (!sheet) {
      sheet = ss.insertSheet(schoolName);
      // 新增標題列
      sheet.appendRow([
        "填寫ID", "填寫時間", "學校名稱", "任教年段", "主要領域", 
        "教學年資", "硬體設備現況", "數位工具使用頻率", "常用數位工具類別與名稱", 
        "其他工具名稱", "AI使用經驗", "學共融入環節", "最大卡點痛點", 
        "數位操作信心度(1-5)", "跳躍任務信心度(1-5)", "期待研習模組", "現場提問與難題"
      ]);
      sheet.setFrozenRows(1);
    }
    
    // 寫入資料
    sheet.appendRow([
      data.id || "",
      data.timestamp || new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }),
      data.school_name || "",
      data.school_role || "",
      Array.isArray(data.teaching_subject) ? data.teaching_subject.join("、") : (data.teaching_subject || ""),
      data.teaching_years || "",
      Array.isArray(data.hardware_env) ? data.hardware_env.join("、") : (data.hardware_env || ""),
      data.tool_frequency || "",
      Array.isArray(data.app_tools) ? data.app_tools.join("、") : (data.app_tools || ""),
      data.other_tools || "",
      data.ai_experience || "",
      Array.isArray(data.slc_stages) ? data.slc_stages.join("、") : (data.slc_stages || ""),
      Array.isArray(data.pain_points) ? data.pain_points.join("、") : (data.pain_points || ""),
      data.confidence_digital || "",
      data.confidence_jumping_task || "",
      Array.isArray(data.workshop_modules) ? data.workshop_modules.join("、") : (data.workshop_modules || ""),
      data.specific_question || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```
