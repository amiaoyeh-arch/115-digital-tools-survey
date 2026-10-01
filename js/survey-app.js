/**
 * 學共輔導團「數位工具教與學」問卷應用邏輯
 */

const STORAGE_KEY_RESPONSES = "slc_digital_survey_responses_v1";
const STORAGE_KEY_DRAFT = "slc_digital_survey_draft_v1";
const STORAGE_KEY_WEBHOOK = "slc_survey_webhook_url";
const DEFAULT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzBTtOKUlpt13xESLsU1z-IhaUUmVwMw6bQfNCKdhD_aWYXvLqQTm0vZTvDIyXboJgeXA/exec";

class SurveyApp {
  constructor() {
    this.config = SURVEY_CONFIG;
    this.currentStep = 1;
    this.totalSteps = this.config.sections.length;
    this.formData = {};
    
    this.initElements();
    this.bindEvents();
    this.loadDraft();
    this.renderStep(this.currentStep);
  }

  initElements() {
    this.container = document.getElementById("survey-content-area");
    this.progressBar = document.getElementById("progress-bar-fill");
    this.stepText = document.getElementById("progress-step-text");
    this.pctText = document.getElementById("progress-pct");
    this.btnPrev = document.getElementById("btn-prev");
    this.btnNext = document.getElementById("btn-next");
    this.btnSubmit = document.getElementById("btn-submit");
    this.stepNodes = document.querySelectorAll(".step-node");
    this.toastEl = document.getElementById("toast");
  }

  bindEvents() {
    this.btnPrev.addEventListener("click", () => this.goToPrevStep());
    this.btnNext.addEventListener("click", () => this.goToNextStep());
    this.btnSubmit.addEventListener("click", () => this.submitSurvey());

    this.stepNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const targetStep = parseInt(node.getAttribute("data-step"), 10);
        if (targetStep < this.currentStep || this.validateStep(this.currentStep, false)) {
          this.goToStep(targetStep);
        }
      });
    });

    // 監聽鍵盤快捷鍵（Enter 快速進入下一步）
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && e.target.tagName !== "TEXTAREA") {
        const activeView = document.getElementById("survey-view");
        if (activeView.style.display !== "none") {
          if (this.currentStep < this.totalSteps) {
            this.goToNextStep();
          }
        }
      }
    });
  }

  showToast(msg, duration = 3000) {
    if (!this.toastEl) return;
    this.toastEl.innerHTML = `<span>💬</span> <span>${msg}</span>`;
    this.toastEl.classList.add("show");
    setTimeout(() => {
      this.toastEl.classList.remove("show");
    }, duration);
  }

  loadDraft() {
    try {
      const draft = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (draft) {
        this.formData = JSON.parse(draft);
        this.showToast("已為您自動載入上次填寫的草稿 ✍️");
      }
    } catch (e) {
      console.warn("無法讀取草稿", e);
    }
  }

  saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(this.formData));
    } catch (e) {
      console.warn("無法儲存草稿", e);
    }
  }

  clearDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY_DRAFT);
    } catch (e) {}
  }

  updateProgress() {
    const pct = Math.round((this.currentStep / this.totalSteps) * 100);
    this.progressBar.style.width = `${pct}%`;
    this.stepText.textContent = `步驟 ${this.currentStep} / ${this.totalSteps}：${this.config.sections[this.currentStep - 1].title.split("、")[1] || ""}`;
    this.pctText.textContent = `${pct}% 完成`;

    this.stepNodes.forEach((node) => {
      const s = parseInt(node.getAttribute("data-step"), 10);
      node.classList.remove("active", "completed");
      if (s === this.currentStep) {
        node.classList.add("active");
      } else if (s < this.currentStep) {
        node.classList.add("completed");
      }
    });

    if (this.currentStep === 1) {
      this.btnPrev.style.display = "none";
    } else {
      this.btnPrev.style.display = "inline-flex";
    }

    if (this.currentStep === this.totalSteps) {
      this.btnNext.style.display = "none";
      this.btnSubmit.style.display = "inline-flex";
    } else {
      this.btnNext.style.display = "inline-flex";
      this.btnSubmit.style.display = "none";
    }
  }

  renderStep(stepNumber) {
    const section = this.config.sections[stepNumber - 1];
    if (!section) return;

    this.updateProgress();

    let html = `
      <div class="section-header">
        <h2 class="section-title">${section.title}</h2>
        <p class="section-desc">${section.description}</p>
      </div>
      <form id="step-form">
    `;

    section.questions.forEach((q) => {
      html += this.renderQuestionHTML(q);
    });

    html += `</form>`;
    this.container.innerHTML = html;

    this.bindQuestionInputs(section);
    window.scrollTo({ top: 120, behavior: "smooth" });
  }

  renderQuestionHTML(q) {
    const isRequired = q.required ? '<span class="required-star">*</span>' : '<span style="font-size:0.8rem;color:#888;"> (選填)</span>';
    const savedVal = this.formData[q.id];

    let contentHtml = "";

    if (q.type === "radio") {
      contentHtml = `<div class="options-grid">`;
      q.options.forEach((opt, idx) => {
        const checked = savedVal === opt ? "checked" : "";
        const selectedClass = savedVal === opt ? "selected" : "";
        contentHtml += `
          <label class="option-item ${selectedClass}" for="${q.id}_${idx}">
            <input type="radio" name="${q.id}" id="${q.id}_${idx}" value="${opt}" ${checked} />
            <span class="custom-indicator"></span>
            <span class="option-text">${opt}</span>
          </label>
        `;
      });
      contentHtml += `</div>`;
    } else if (q.type === "checkbox") {
      const limitHint = q.maxSelect ? `<div class="question-hint">⚠️ 此題最多可勾選 ${q.maxSelect} 項</div>` : "";
      const selectedArr = Array.isArray(savedVal) ? savedVal : [];
      
      contentHtml = limitHint + `<div class="options-list-vertical">`;
      q.options.forEach((opt, idx) => {
        const checked = selectedArr.includes(opt) ? "checked" : "";
        const selectedClass = selectedArr.includes(opt) ? "selected" : "";
        contentHtml += `
          <label class="option-item ${selectedClass}" for="${q.id}_${idx}">
            <input type="checkbox" name="${q.id}" id="${q.id}_${idx}" value="${opt}" ${checked} />
            <span class="custom-indicator"></span>
            <span class="option-text">${opt}</span>
          </label>
        `;
      });
      contentHtml += `</div>`;
    } else if (q.type === "rating") {
      contentHtml = `
        <div class="rating-scale-container">
          <div class="rating-guide">
            <span class="rating-guide-min">◀ ${q.minLabel}</span>
            <span class="rating-guide-max">${q.maxLabel} ▶</span>
          </div>
          <div class="rating-buttons">
      `;
      for (let i = q.min; i <= q.max; i++) {
        const checked = savedVal === i ? "checked" : "";
        const selectedClass = savedVal === i ? "selected" : "";
        contentHtml += `
          <label class="rating-btn-label ${selectedClass}">
            <input type="radio" name="${q.id}" value="${i}" ${checked} />
            ${i}
          </label>
        `;
      }
      contentHtml += `
          </div>
        </div>
      `;
    } else if (q.type === "textarea") {
      const val = savedVal || "";
      contentHtml = `
        <textarea class="custom-textarea" name="${q.id}" id="${q.id}" placeholder="${q.placeholder || '請輸入您的想法...'}">${val}</textarea>
      `;
    }

    return `
      <div class="question-group" id="group-${q.id}">
        <label class="question-label">${q.label} ${isRequired}</label>
        ${contentHtml}
      </div>
    `;
  }

  bindQuestionInputs(section) {
    section.questions.forEach((q) => {
      if (q.type === "radio") {
        const radios = document.querySelectorAll(`input[name="${q.id}"]`);
        radios.forEach((r) => {
          r.addEventListener("change", (e) => {
            this.formData[q.id] = e.target.value;
            // 更新選中外觀
            radios.forEach((item) => {
              item.closest(".option-item").classList.toggle("selected", item.checked);
            });
            this.saveDraft();
          });
        });
      } else if (q.type === "checkbox") {
        const checkboxes = document.querySelectorAll(`input[name="${q.id}"]`);
        checkboxes.forEach((cb) => {
          cb.addEventListener("change", () => {
            const checkedBoxes = Array.from(checkboxes).filter((c) => c.checked);
            if (q.maxSelect && checkedBoxes.length > q.maxSelect) {
              cb.checked = false;
              this.showToast(`此題最多僅能勾選 ${q.maxSelect} 項喔！`);
              return;
            }
            this.formData[q.id] = checkedBoxes.map((c) => c.value);
            checkboxes.forEach((item) => {
              item.closest(".option-item").classList.toggle("selected", item.checked);
            });
            this.saveDraft();
          });
        });
      } else if (q.type === "rating") {
        const ratingRadios = document.querySelectorAll(`input[name="${q.id}"]`);
        ratingRadios.forEach((r) => {
          r.addEventListener("change", (e) => {
            this.formData[q.id] = parseInt(e.target.value, 10);
            ratingRadios.forEach((item) => {
              item.closest(".rating-btn-label").classList.toggle("selected", item.checked);
            });
            this.saveDraft();
          });
        });
      } else if (q.type === "textarea") {
        const textarea = document.getElementById(q.id);
        if (textarea) {
          textarea.addEventListener("input", (e) => {
            this.formData[q.id] = e.target.value;
            this.saveDraft();
          });
        }
      }
    });
  }

  validateStep(stepNumber, showAlert = true) {
    const section = this.config.sections[stepNumber - 1];
    if (!section) return true;

    for (let q of section.questions) {
      if (!q.required) continue;

      const val = this.formData[q.id];
      if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
        if (showAlert) {
          this.showToast(`請完成必填題：「${q.label.split(" ")[0]}」`);
          const group = document.getElementById(`group-${q.id}`);
          if (group) {
            group.scrollIntoView({ behavior: "smooth", block: "center" });
            group.style.animation = "shake 0.4s ease";
            setTimeout(() => { group.style.animation = ""; }, 400);
          }
        }
        return false;
      }
    }
    return true;
  }

  goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
      this.currentStep = stepNumber;
      this.renderStep(this.currentStep);
    }
  }

  goToNextStep() {
    if (this.validateStep(this.currentStep, true)) {
      if (this.currentStep < this.totalSteps) {
        this.goToStep(this.currentStep + 1);
      }
    }
  }

  goToPrevStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }

  submitSurvey() {
    if (!this.validateStep(this.currentStep, true)) return;

    const responsePayload = {
      id: "resp-" + Date.now(),
      timestamp: new Date().toLocaleString("zh-TW", { hour12: false }),
      ...this.formData
    };

    // 儲存至本機數據庫
    let allResponses = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RESPONSES);
      if (stored) {
        allResponses = JSON.parse(stored);
      }
    } catch (e) {
      allResponses = [];
    }

    allResponses.push(responsePayload);
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(allResponses));
    this.clearDraft();

    // 自動同步至 Google 試算表 Webhook
    const webhookUrl = localStorage.getItem(STORAGE_KEY_WEBHOOK) || DEFAULT_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(responsePayload)
        });
      } catch (err) {
        console.warn("Webhook POST failed:", err);
      }
    }

    this.renderSuccessView();
  }

  renderSuccessView() {
    const surveyCard = document.querySelector(".survey-card");
    const progressCard = document.querySelector(".progress-card");
    if (progressCard) progressCard.style.display = "none";

    surveyCard.innerHTML = `
      <div class="success-card">
        <div class="success-icon">✓</div>
        <h2>感謝您完成問卷調查！</h2>
        <p>您的寶貴意見已成功送出！學共輔導團將根據您的回饋精準規劃 2 小時的到校輔導課程與實作跳躍任務，期待與老師們在課堂相見！</p>
        <div class="success-buttons">
          <button class="btn btn-primary" id="btn-view-dashboard">
            <span>📊</span> 查看講師數據分析儀表板
          </button>
          <button class="btn btn-secondary" id="btn-fill-another">
            <span>✍️</span> 再填寫一份
          </button>
        </div>
      </div>
    `;

    document.getElementById("btn-view-dashboard").addEventListener("click", () => {
      if (window.switchAppView) {
        window.switchAppView("dashboard");
      }
    });

    document.getElementById("btn-fill-another").addEventListener("click", () => {
      this.formData = {};
      this.currentStep = 1;
      if (progressCard) progressCard.style.display = "block";
      this.renderStep(1);
    });
  }
}

// 頁面就緒時啟動
window.addEventListener("DOMContentLoaded", () => {
  window.surveyAppInstance = new SurveyApp();
});
