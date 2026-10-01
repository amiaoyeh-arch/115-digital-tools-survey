/**
 * 學共輔導團「數位工具教與學」講師數據分析儀表板 (admin.html 專用)
 * 基於 Chart.js 實現即時統計、依學校分流篩選與資料視覺化
 * 具備與 Google 試算表 (Google Apps Script) 即時雙向讀取同步功能（純唯讀，不破壞後端數據）
 */

const STORAGE_KEY_CLOUD_CACHE = "slc_digital_survey_cloud_cache_v1";
const STORAGE_KEY_LOCAL_RESPONSES = "slc_digital_survey_responses_v1";
const STORAGE_KEY_WEBHOOK = "slc_survey_webhook_url";
const DEFAULT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzBTtOKUlpt13xESLsU1z-IhaUUmVwMw6bQfNCKdhD_aWYXvLqQTm0vZTvDIyXboJgeXA/exec";

class SurveyDashboard {
  constructor() {
    this.charts = {};
    this.allData = [];
    this.filteredData = [];
    this.selectedSchool = "ALL";
    this.isSyncing = false;

    this.initElements();
    this.bindEvents();
    
    // 優先讀取本地快取以便立即呈現畫面
    this.loadCachedData();

    // 隨後自動連線 Google 試算表拉取最新雲端數據
    this.syncFromCloud(false);
  }

  initElements() {
    this.kpiTotalEl = document.getElementById("kpi-total-responses");
    this.kpiAvgDigEl = document.getElementById("kpi-avg-digital");
    this.kpiAvgJumpEl = document.getElementById("kpi-avg-jumping");
    this.kpiAiExpEl = document.getElementById("kpi-ai-readiness");
    this.kpiSchoolInfoEl = document.getElementById("kpi-school-info");
    this.questionsFeedEl = document.getElementById("dashboard-questions-feed");
    this.dataSourceBadge = document.getElementById("data-source-badge");
    this.schoolFilterSelect = document.getElementById("school-filter");

    this.btnSyncCloud = document.getElementById("btn-sync-cloud");
    this.btnExportCsv = document.getElementById("btn-export-csv");
    this.btnExportJson = document.getElementById("btn-export-json");
    this.btnSetWebhook = document.getElementById("btn-set-webhook");

    this.syncStatusText = document.getElementById("sync-status-text");
    this.syncLastTime = document.getElementById("sync-last-time");
    this.statusDot = document.getElementById("status-dot");
    this.toastEl = document.getElementById("toast");
  }

  bindEvents() {
    if (this.schoolFilterSelect) {
      this.schoolFilterSelect.addEventListener("change", (e) => {
        this.selectedSchool = e.target.value;
        this.applyFilterAndRender();
      });
    }

    if (this.btnSyncCloud) {
      this.btnSyncCloud.addEventListener("click", () => this.syncFromCloud(true));
    }

    if (this.btnExportCsv) this.btnExportCsv.addEventListener("click", () => this.exportCSV());
    if (this.btnExportJson) this.btnExportJson.addEventListener("click", () => this.exportJSON());
    if (this.btnSetWebhook) this.btnSetWebhook.addEventListener("click", () => this.configureWebhook());
  }

  showToast(msg, duration = 3000) {
    if (!this.toastEl) return;
    this.toastEl.innerHTML = `<span>💬</span> <span>${msg}</span>`;
    this.toastEl.classList.add("show");
    setTimeout(() => {
      this.toastEl.classList.remove("show");
    }, duration);
  }

  loadCachedData() {
    try {
      // 優先讀取雲端快取，若無則讀取本機填寫資料
      let raw = localStorage.getItem(STORAGE_KEY_CLOUD_CACHE) || localStorage.getItem(STORAGE_KEY_LOCAL_RESPONSES);
      if (raw) {
        let parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // 清除任何 demo- 開頭之示範資料
          parsed = parsed.filter(d => d && d.id && !String(d.id).startsWith("demo-"));
          this.allData = parsed;
          if (this.allData.length > 0) {
            if (this.dataSourceBadge) this.dataSourceBadge.textContent = `快取數據 (${this.allData.length} 筆)`;
            if (this.syncStatusText) this.syncStatusText.textContent = `已載入快取資料（共 ${this.allData.length} 筆）`;
          }
        }
      }
    } catch (e) {
      console.warn("讀取快取失敗:", e);
      this.allData = [];
    }

    this.populateSchoolOptions();
    this.applyFilterAndRender();
  }

  /**
   * 從 Google 試算表 Web App (doGet) 拉取所有學校工作表之最新數據
   * 具備純即時讀取特性，100% 不會更動試算表內容
   */
  async syncFromCloud(isManual = false) {
    if (this.isSyncing) return;
    this.isSyncing = true;

    if (this.btnSyncCloud) this.btnSyncCloud.classList.add("syncing");
    if (this.statusDot) this.statusDot.className = "status-dot syncing";
    if (this.syncStatusText) this.syncStatusText.textContent = "正在從 Google 試算表同步資料...";

    const webhookUrl = (localStorage.getItem(STORAGE_KEY_WEBHOOK) || DEFAULT_WEBHOOK_URL).trim();

    try {
      const fetchUrl = webhookUrl + (webhookUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result && result.status === "success" && Array.isArray(result.data)) {
        // 過濾可能存在的 demo 數據
        const validData = result.data.filter(d => d && d.id && !String(d.id).startsWith("demo-"));
        this.allData = validData;

        // 儲存至雲端快取
        localStorage.setItem(STORAGE_KEY_CLOUD_CACHE, JSON.stringify(this.allData));

        if (this.statusDot) this.statusDot.className = "status-dot online";
        if (this.syncStatusText) this.syncStatusText.textContent = `已成功連線 Google 試算表（共 ${this.allData.length} 筆實際填答）`;
        if (this.syncLastTime) this.syncLastTime.textContent = `最後同步：${new Date().toLocaleTimeString("zh-TW")}`;
        if (this.dataSourceBadge) this.dataSourceBadge.textContent = `試算表即時數據 (${this.allData.length} 筆)`;

        this.populateSchoolOptions();
        this.applyFilterAndRender();

        if (isManual) {
          this.showToast(`✅ 同步完成！共取得 ${this.allData.length} 筆最新回覆。`);
        }
      } else {
        throw new Error((result && result.message) || "試算表回傳格式錯誤");
      }
    } catch (err) {
      console.warn("無法從 Google 試算表拉取資料:", err);
      if (this.statusDot) this.statusDot.className = "status-dot";
      if (this.syncStatusText) {
        this.syncStatusText.textContent = this.allData.length > 0 
          ? `連線中斷，顯示快取 (${this.allData.length} 筆)`
          : `尚無法連線試算表（請確認 Apps Script 已部署 doGet）`;
      }
      
      if (isManual) {
        alert(`無法從 Google 試算表同步資料，可能原因：\n1. Google Apps Script 尚未部署為包含「doGet」的新版本。\n2. 試算表 Webhook 網址設定有誤或瀏覽器快取尚未更新。\n\n詳細錯誤：${err.message || err}\n\n目前畫面已為您保留最近一次的填答紀錄。`);
      }
    } finally {
      this.isSyncing = false;
      if (this.btnSyncCloud) this.btnSyncCloud.classList.remove("syncing");
    }
  }

  populateSchoolOptions() {
    if (!this.schoolFilterSelect) return;

    // 取得所有獨立學校名稱
    const schools = Array.from(new Set(this.allData.map(d => (d.school_name || "未指定學校").trim()))).filter(Boolean);

    let html = `<option value="ALL">全部學校 (${this.allData.length} 份回覆)</option>`;
    schools.forEach(sch => {
      const count = this.allData.filter(d => (d.school_name || "未指定學校").trim() === sch).length;
      html += `<option value="${this.escapeHtml(sch)}">${this.escapeHtml(sch)} (${count} 份)</option>`;
    });

    this.schoolFilterSelect.innerHTML = html;
    if (this.selectedSchool !== "ALL" && !schools.includes(this.selectedSchool)) {
      this.selectedSchool = "ALL";
    }
    this.schoolFilterSelect.value = this.selectedSchool;
  }

  refresh() {
    this.loadCachedData();
  }

  applyFilterAndRender() {
    if (this.selectedSchool === "ALL") {
      this.filteredData = this.allData;
      if (this.kpiSchoolInfoEl) this.kpiSchoolInfoEl.textContent = "全體學校彙整樣本數";
    } else {
      this.filteredData = this.allData.filter(d => (d.school_name || "未指定學校").trim() === this.selectedSchool);
      if (this.kpiSchoolInfoEl) this.kpiSchoolInfoEl.textContent = `【${this.selectedSchool}】樣本數`;
    }

    this.renderKPIs();
    this.renderCharts();
    this.renderQuestionsList();
  }

  renderKPIs() {
    const data = this.filteredData;
    const total = data.length;

    if (total === 0) {
      if (this.kpiTotalEl) this.kpiTotalEl.textContent = "0 位";
      if (this.kpiAvgDigEl) this.kpiAvgDigEl.textContent = "--";
      if (this.kpiAvgJumpEl) this.kpiAvgJumpEl.textContent = "--";
      if (this.kpiAiExpEl) this.kpiAiExpEl.textContent = "--";
      return;
    }

    if (this.kpiTotalEl) this.kpiTotalEl.textContent = `${total} 位`;

    // 計算平均信心度
    const digSum = data.reduce((acc, cur) => acc + (Number(cur.confidence_digital) || 0), 0);
    const avgDig = (digSum / total).toFixed(1);
    if (this.kpiAvgDigEl) this.kpiAvgDigEl.textContent = `${avgDig} / 5.0`;

    const jumpSum = data.reduce((acc, cur) => acc + (Number(cur.confidence_jumping_task) || 0), 0);
    const avgJump = (jumpSum / total).toFixed(1);
    if (this.kpiAvgJumpEl) this.kpiAvgJumpEl.textContent = `${avgJump} / 5.0`;

    // 計算曾使用過 AI 的比例
    const aiUsers = data.filter(cur => cur.ai_experience && !cur.ai_experience.includes("從未接觸")).length;
    const aiPct = Math.round((aiUsers / total) * 100);
    if (this.kpiAiExpEl) this.kpiAiExpEl.textContent = `${aiPct}%`;
  }

  renderCharts() {
    const data = this.filteredData;
    if (typeof Chart === "undefined") return;

    if (data.length === 0) {
      Object.keys(this.charts).forEach(key => {
        if (this.charts[key]) {
          this.charts[key].destroy();
          this.charts[key] = null;
        }
      });
      return;
    }

    this.renderRoleChart(data);
    this.renderFrequencyChart(data);
    this.renderToolsChart(data);
    this.renderHardwareChart(data);
    this.renderPainPointsChart(data);
    this.renderModulesChart(data);
  }

  renderRoleChart(data) {
    const ctx = document.getElementById("chart-roles");
    if (!ctx) return;

    const counts = {};
    data.forEach(d => {
      const role = d.school_role || "未填寫";
      counts[role] = (counts[role] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    if (this.charts.roles) this.charts.roles.destroy();

    this.charts.roles = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            "#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2", "#d8f3dc"
          ],
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" }
        }
      }
    });
  }

  renderFrequencyChart(data) {
    const ctx = document.getElementById("chart-frequency");
    if (!ctx) return;

    const freqOrder = [
      "幾乎每堂課使用 (每週 4 次以上)",
      "經常使用 (每週 2~3 次)",
      "偶爾使用 (每週 1 次)",
      "較少使用 (每月 1~2 次)",
      "極少使用 / 僅公開授課時使用",
      "目前從未使用"
    ];

    const counts = {};
    freqOrder.forEach(f => counts[f] = 0);

    data.forEach(d => {
      if (d.tool_frequency) {
        counts[d.tool_frequency] = (counts[d.tool_frequency] || 0) + 1;
      }
    });

    if (this.charts.frequency) this.charts.frequency.destroy();

    this.charts.frequency = new Chart(ctx, {
      type: "bar",
      data: {
        labels: freqOrder.map(f => f.split(" (")[0]),
        datasets: [{
          label: "教師人數",
          data: freqOrder.map(f => counts[f]),
          backgroundColor: "#52b788",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  renderToolsChart(data) {
    const ctx = document.getElementById("chart-tools");
    if (!ctx) return;

    const counts = {};
    data.forEach(d => {
      const tools = Array.isArray(d.app_tools) ? d.app_tools : (d.app_tools ? [d.app_tools] : []);
      tools.forEach(t => {
        const clean = t.split(" (")[0].trim();
        counts[clean] = (counts[clean] || 0) + 1;
      });
    });

    // 依使用人數排序
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(s => s[0]);
    const values = sorted.map(s => s[1]);

    if (this.charts.tools) this.charts.tools.destroy();

    this.charts.tools = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "使用人數",
          data: values,
          backgroundColor: "#2d6a4f",
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  renderHardwareChart(data) {
    const ctx = document.getElementById("chart-hardware");
    if (!ctx) return;

    const counts = {};
    data.forEach(d => {
      const hw = Array.isArray(d.hardware_env) ? d.hardware_env : (d.hardware_env ? [d.hardware_env] : []);
      hw.forEach(h => {
        const clean = h.split(" (")[0].trim();
        counts[clean] = (counts[clean] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(s => s[0]);
    const values = sorted.map(s => s[1]);

    if (this.charts.hardware) this.charts.hardware.destroy();

    this.charts.hardware = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "教室數量/人數",
          data: values,
          backgroundColor: "#457b9d",
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  renderPainPointsChart(data) {
    const ctx = document.getElementById("chart-painpoints");
    if (!ctx) return;

    const counts = {};
    data.forEach(d => {
      const pts = Array.isArray(d.pain_points) ? d.pain_points : (d.pain_points ? [d.pain_points] : []);
      pts.forEach(p => {
        const shortLabel = p.length > 12 ? p.substring(0, 12) + "..." : p;
        counts[shortLabel] = (counts[shortLabel] || 0) + 1;
      });
    });

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    if (this.charts.painpoints) this.charts.painpoints.destroy();

    this.charts.painpoints = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [{
          label: "痛點提及次數",
          data: values,
          backgroundColor: "rgba(231, 111, 81, 0.2)",
          borderColor: "#e76f51",
          pointBackgroundColor: "#e76f51",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

  renderModulesChart(data) {
    const ctx = document.getElementById("chart-modules");
    if (!ctx) return;

    const counts = {};
    data.forEach(d => {
      const mods = Array.isArray(d.workshop_modules) ? d.workshop_modules : (d.workshop_modules ? [d.workshop_modules] : []);
      mods.forEach(m => {
        // 抓取 【模組X】 簡短標題
        const match = m.match(/【模組[A-Z]】[^：:]*/);
        const title = match ? match[0] : (m.length > 15 ? m.substring(0, 15) + "..." : m);
        counts[title] = (counts[title] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(s => s[0]);
    const values = sorted.map(s => s[1]);

    if (this.charts.modules) this.charts.modules.destroy();

    this.charts.modules = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "票選期待度",
          data: values,
          backgroundColor: "#e76f51",
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  renderQuestionsList() {
    if (!this.questionsFeedEl) return;

    const data = this.filteredData.filter(d => d.specific_question && d.specific_question.trim().length > 0);

    if (data.length === 0) {
      this.questionsFeedEl.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 30px;">
          <span>💬</span> 目前在此篩選範圍下尚無填寫個別提問。
        </div>
      `;
      return;
    }

    let html = "";
    data.forEach(d => {
      const schoolTag = d.school_name ? `<span class="q-tag" style="background:#e8f5e9; color:#2d6a4f;">${this.escapeHtml(d.school_name)}</span>` : "";
      const roleTag = d.school_role ? `<span class="q-tag">${this.escapeHtml(d.school_role)}</span>` : "";
      const subj = Array.isArray(d.teaching_subject) ? d.teaching_subject.join(" / ") : (d.teaching_subject || "");
      const subjTag = subj ? `<span class="q-tag">${this.escapeHtml(subj)}</span>` : "";

      html += `
        <div class="question-item">
          <div class="q-text">「${this.escapeHtml(d.specific_question)}」</div>
          <div class="q-meta">
            ${schoolTag}
            ${roleTag}
            ${subjTag}
            <span style="font-size: 0.75rem; color: var(--text-light);">${this.escapeHtml(d.timestamp || "")}</span>
          </div>
        </div>
      `;
    });

    this.questionsFeedEl.innerHTML = html;
  }

  escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  configureWebhook() {
    const current = localStorage.getItem(STORAGE_KEY_WEBHOOK) || DEFAULT_WEBHOOK_URL;
    const input = prompt("請輸入 Google Apps Script Webhook 網址（留空則使用系統預設）：", current);
    if (input !== null) {
      if (input.trim() === "") {
        localStorage.removeItem(STORAGE_KEY_WEBHOOK);
        alert("已重設為系統預設 Webhook。");
      } else {
        localStorage.setItem(STORAGE_KEY_WEBHOOK, input.trim());
        alert("Webhook 網址已儲存！將立即從該網址同步資料。");
      }
      this.syncFromCloud(true);
    }
  }

  exportCSV() {
    const data = this.filteredData;
    if (data.length === 0) {
      alert("目前尚無資料可供匯出！");
      return;
    }

    const headers = [
      "ID", "填寫時間", "學校名稱", "任教年段", "主要領域", "教學年資",
      "硬體設備現況", "數位工具使用頻率", "常用數位工具與AI Agent", "AI使用經驗",
      "學共融入環節", "最大卡點", "數位操作信心度(1-5)", "跳躍任務信心度(1-5)",
      "期待研習模組", "現場個別提問"
    ];

    const rows = data.map(d => [
      d.id || "",
      d.timestamp || "",
      d.school_name || "",
      d.school_role || "",
      Array.isArray(d.teaching_subject) ? d.teaching_subject.join(";") : (d.teaching_subject || ""),
      d.teaching_years || "",
      Array.isArray(d.hardware_env) ? d.hardware_env.join(";") : (d.hardware_env || ""),
      d.tool_frequency || "",
      Array.isArray(d.app_tools) ? d.app_tools.join(";") : (d.app_tools || ""),
      d.ai_experience || "",
      Array.isArray(d.slc_stages) ? d.slc_stages.join(";") : (d.slc_stages || ""),
      Array.isArray(d.pain_points) ? d.pain_points.join(";") : (d.pain_points || ""),
      d.confidence_digital || "",
      d.confidence_jumping_task || "",
      Array.isArray(d.workshop_modules) ? d.workshop_modules.join(";") : (d.workshop_modules || ""),
      (d.specific_question || "").replace(/"/g, '""')
    ]);

    let csvContent = "\uFEFF"; // UTF-8 with BOM 解決 Excel 亂碼
    csvContent += headers.map(h => `"${h}"`).join(",") + "\r\n";
    rows.forEach(r => {
      csvContent += r.map(field => `"${field}"`).join(",") + "\r\n";
    });

    const schoolLabel = this.selectedSchool === "ALL" ? "全校彙整" : this.selectedSchool;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `學共輔導團_${schoolLabel}_問卷統計_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportJSON() {
    const data = this.filteredData;
    if (data.length === 0) {
      alert("目前尚無資料可供匯出！");
      return;
    }

    const schoolLabel = this.selectedSchool === "ALL" ? "全校彙整" : this.selectedSchool;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `學共輔導團_${schoolLabel}_問卷資料_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.surveyDashboardInstance = new SurveyDashboard();
});
