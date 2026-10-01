/**
 * 學共輔導團「數位工具教與學」講師數據分析儀表板
 * 基於 Chart.js 實現即時統計與資料視覺化
 */

class SurveyDashboard {
  constructor() {
    this.charts = {};
    this.currentData = [];
    this.useDemoIfEmpty = true;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.kpiTotalEl = document.getElementById("kpi-total-responses");
    this.kpiAvgDigEl = document.getElementById("kpi-avg-digital");
    this.kpiAvgJumpEl = document.getElementById("kpi-avg-jumping");
    this.kpiAiExpEl = document.getElementById("kpi-ai-readiness");
    this.questionsFeedEl = document.getElementById("dashboard-questions-feed");
    this.dataSourceBadge = document.getElementById("data-source-badge");

    this.btnExportCsv = document.getElementById("btn-export-csv");
    this.btnExportJson = document.getElementById("btn-export-json");
    this.btnLoadDemo = document.getElementById("btn-load-demo");
    this.btnClearData = document.getElementById("btn-clear-data");
    this.btnSetWebhook = document.getElementById("btn-set-webhook");
  }

  bindEvents() {
    if (this.btnExportCsv) this.btnExportCsv.addEventListener("click", () => this.exportCSV());
    if (this.btnExportJson) this.btnExportJson.addEventListener("click", () => this.exportJSON());
    if (this.btnLoadDemo) this.btnLoadDemo.addEventListener("click", () => this.loadDemoData());
    if (this.btnClearData) this.btnClearData.addEventListener("click", () => this.clearAllData());
    if (this.btnSetWebhook) this.btnSetWebhook.addEventListener("click", () => this.configureWebhook());
  }

  getResponses() {
    try {
      const stored = localStorage.getItem("slc_digital_survey_responses_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (this.dataSourceBadge) this.dataSourceBadge.textContent = `現有實際填答 (${parsed.length} 筆)`;
          return parsed;
        }
      }
    } catch (e) {
      console.warn("讀取本機資料失敗", e);
    }

    if (this.useDemoIfEmpty && typeof DEMO_RESPONSES !== "undefined") {
      if (this.dataSourceBadge) this.dataSourceBadge.textContent = `示範模擬資料 (${DEMO_RESPONSES.length} 筆)`;
      return DEMO_RESPONSES;
    }

    return [];
  }

  refresh() {
    this.currentData = this.getResponses();
    this.renderKPIs();
    this.renderCharts();
    this.renderQuestionsList();
  }

  renderKPIs() {
    const data = this.currentData;
    const total = data.length;

    if (total === 0) {
      if (this.kpiTotalEl) this.kpiTotalEl.textContent = "0";
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
    const data = this.currentData;
    if (typeof Chart === "undefined" || data.length === 0) return;

    this.renderRolesChart(data);
    this.renderToolsChart(data);
    this.renderHardwareChart(data);
    this.renderPainPointsRadar(data);
    this.renderModulesChart(data);
  }

  // 1. 年段與領域分佈圖 (Doughnut)
  renderRolesChart(data) {
    const roleCounts = {};
    data.forEach(d => {
      const role = d.school_role || "未填寫";
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    const ctx = document.getElementById("chart-roles");
    if (!ctx) return;

    if (this.charts.roles) this.charts.roles.destroy();

    this.charts.roles = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(roleCounts),
        datasets: [{
          data: Object.values(roleCounts),
          backgroundColor: ["#2d6a4f", "#52b788", "#74c69d", "#95d5b2", "#b7e4c7", "#d8f3dc"],
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 12 } } }
        }
      }
    });
  }

  // 2. 常用數位軟體工具統計 (Horizontal Bar)
  renderToolsChart(data) {
    const toolCounts = {};
    data.forEach(d => {
      if (Array.isArray(d.app_tools)) {
        d.app_tools.forEach(t => {
          // 簡化標籤名稱
          const shortName = t.split(" (")[0];
          toolCounts[shortName] = (toolCounts[shortName] || 0) + 1;
        });
      }
    });

    // 排序
    const sorted = Object.entries(toolCounts).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(s => s[0]);
    const counts = sorted.map(s => s[1]);

    const ctx = document.getElementById("chart-tools");
    if (!ctx) return;

    if (this.charts.tools) this.charts.tools.destroy();

    this.charts.tools = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "使用人數",
          data: counts,
          backgroundColor: "#40916c",
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { stepSize: 1 } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 3. 校園硬體環境現況 (Bar)
  renderHardwareChart(data) {
    const hwCounts = {};
    data.forEach(d => {
      if (Array.isArray(d.hardware_env)) {
        d.hardware_env.forEach(h => {
          const shortName = h.replace("教室內建", "").replace("學生 1:1 ", "1:1 ");
          hwCounts[shortName] = (hwCounts[shortName] || 0) + 1;
        });
      }
    });

    const sorted = Object.entries(hwCounts).sort((a, b) => b[1] - a[1]);
    const ctx = document.getElementById("chart-hardware");
    if (!ctx) return;

    if (this.charts.hardware) this.charts.hardware.destroy();

    this.charts.hardware = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sorted.map(s => s[0]),
        datasets: [{
          label: "具備教師數",
          data: sorted.map(s => s[1]),
          backgroundColor: "#457b9d",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { ticks: { stepSize: 1 } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 4. 學共課堂痛點與卡點 (Radar)
  renderPainPointsRadar(data) {
    const painCounts = {
      "載具分心管理": 0,
      "操作耗時壓縮對話": 0,
      "跳躍任務設計難": 0,
      "缺乏學共現成教材": 0,
      "設備與連線問題": 0,
      "AI融入教案不知所措": 0,
      "擔憂弱化實體傾聽": 0
    };

    data.forEach(d => {
      if (Array.isArray(d.pain_points)) {
        d.pain_points.forEach(p => {
          if (p.includes("分心")) painCounts["載具分心管理"]++;
          else if (p.includes("耗時")) painCounts["操作耗時壓縮對話"]++;
          else if (p.includes("跳躍任務")) painCounts["跳躍任務設計難"]++;
          else if (p.includes("缺乏")) painCounts["缺乏學共現成教材"]++;
          else if (p.includes("連線") || p.includes("設備")) painCounts["設備與連線問題"]++;
          else if (p.includes("AI")) painCounts["AI融入教案不知所措"]++;
          else if (p.includes("傾聽")) painCounts["擔憂弱化實體傾聽"]++;
        });
      }
    });

    const ctx = document.getElementById("chart-painpoints");
    if (!ctx) return;

    if (this.charts.painpoints) this.charts.painpoints.destroy();

    this.charts.painpoints = new Chart(ctx, {
      type: "radar",
      data: {
        labels: Object.keys(painCounts),
        datasets: [{
          label: "痛點頻率",
          data: Object.values(painCounts),
          backgroundColor: "rgba(231, 111, 81, 0.25)",
          borderColor: "#e76f51",
          pointBackgroundColor: "#e76f51",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#e76f51"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: "#e2e8f0" },
            grid: { color: "#e2e8f0" },
            ticks: { stepSize: 1, backdropColor: "transparent" }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 5. 研習模組期待排行 (Bar)
  renderModulesChart(data) {
    const modCounts = {};
    data.forEach(d => {
      if (Array.isArray(d.workshop_modules)) {
        d.workshop_modules.forEach(m => {
          const modKey = m.split("：")[0].replace("【", "").replace("】", "");
          modCounts[modKey] = (modCounts[modKey] || 0) + 1;
        });
      }
    });

    const sorted = Object.entries(modCounts).sort((a, b) => b[1] - a[1]);
    const ctx = document.getElementById("chart-modules");
    if (!ctx) return;

    if (this.charts.modules) this.charts.modules.destroy();

    this.charts.modules = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sorted.map(s => s[0]),
        datasets: [{
          label: "期待票數",
          data: sorted.map(s => s[1]),
          backgroundColor: "#2a9d8f",
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { stepSize: 1 } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  renderQuestionsList() {
    if (!this.questionsFeedEl) return;

    const data = this.currentData.filter(d => d.specific_question && d.specific_question.trim() !== "");

    if (data.length === 0) {
      this.questionsFeedEl.innerHTML = `
        <div style="text-align:center; padding: 24px; color: #888;">
          目前尚無教師提出個別問題，可於課堂現場即時發問。
        </div>
      `;
      return;
    }

    let html = "";
    data.forEach(item => {
      const subjectStr = Array.isArray(item.teaching_subject) ? item.teaching_subject.join("、") : (item.teaching_subject || "綜合");
      html += `
        <div class="question-post-card">
          <div class="question-post-header">
            <span>🏷️ ${item.school_role || "教師"} ｜ ${subjectStr}</span>
            <span>🕒 ${item.timestamp || "近期"}</span>
          </div>
          <div class="question-post-content">
            「${this.escapeHtml(item.specific_question)}」
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

  loadDemoData() {
    if (typeof DEMO_RESPONSES !== "undefined") {
      localStorage.setItem("slc_digital_survey_responses_v1", JSON.stringify(DEMO_RESPONSES));
      this.refresh();
      alert("已成功載入 5 筆示範模擬問卷數據！");
    }
  }

  clearAllData() {
    if (confirm("確定要清除所有已填寫的問卷資料嗎？清除後將無法復原。")) {
      localStorage.removeItem("slc_digital_survey_responses_v1");
      this.refresh();
      alert("資料已清空！");
    }
  }

  configureWebhook() {
    const current = localStorage.getItem("slc_survey_webhook_url") || "";
    const input = prompt("請輸入 Google Apps Script Webhook 網址（留空則停用外部同步）：", current);
    if (input !== null) {
      if (input.trim() === "") {
        localStorage.removeItem("slc_survey_webhook_url");
        alert("已停用 Webhook 外部同步功能。");
      } else {
        localStorage.setItem("slc_survey_webhook_url", input.trim());
        alert("Webhook 網址已儲存！新問卷提交時將自動同步發送。");
      }
    }
  }

  exportCSV() {
    const data = this.currentData;
    if (data.length === 0) {
      alert("目前尚無資料可供匯出！");
      return;
    }

    const headers = [
      "ID", "填寫時間", "任教年段", "主要領域", "教學年資",
      "硬體設備現況", "常用數位軟體", "AI使用經驗",
      "學共融入環節", "最大卡點", "數位操作信心度(1-5)", "跳躍任務信心度(1-5)",
      "期待研習模組", "現場個別提問"
    ];

    const rows = data.map(d => [
      d.id || "",
      d.timestamp || "",
      d.school_role || "",
      Array.isArray(d.teaching_subject) ? d.teaching_subject.join(";") : (d.teaching_subject || ""),
      d.teaching_years || "",
      Array.isArray(d.hardware_env) ? d.hardware_env.join(";") : (d.hardware_env || ""),
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

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `學共輔導團_數位工具問卷調查統計_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportJSON() {
    const data = this.currentData;
    if (data.length === 0) {
      alert("目前尚無資料可供匯出！");
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `學共輔導團_問卷資料匯出_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// 全域切換檢視功能
window.switchAppView = function(viewName) {
  const surveyView = document.getElementById("survey-view");
  const dashboardView = document.getElementById("dashboard-view");
  const btnNavSurvey = document.getElementById("nav-survey-tab");
  const btnNavDash = document.getElementById("nav-dashboard-tab");

  if (viewName === "dashboard") {
    surveyView.style.display = "none";
    dashboardView.style.display = "block";
    btnNavSurvey.classList.remove("active");
    btnNavDash.classList.add("active");

    if (!window.surveyDashboardInstance) {
      window.surveyDashboardInstance = new SurveyDashboard();
    }
    window.surveyDashboardInstance.refresh();
  } else {
    dashboardView.style.display = "none";
    surveyView.style.display = "block";
    btnNavDash.classList.remove("active");
    btnNavSurvey.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.addEventListener("DOMContentLoaded", () => {
  const navSurvey = document.getElementById("nav-survey-tab");
  const navDash = document.getElementById("nav-dashboard-tab");

  if (navSurvey) navSurvey.addEventListener("click", () => window.switchAppView("survey"));
  if (navDash) navDash.addEventListener("click", () => window.switchAppView("dashboard"));
});
