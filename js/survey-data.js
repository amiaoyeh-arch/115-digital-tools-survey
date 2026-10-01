/**
 * 學共輔導團「數位工具教與學」2小時到校輔導 問卷設定與題目資料
 */
const SURVEY_CONFIG = {
  title: "學習共同體輔導團｜「數位工具教與學」到校輔導前置調查",
  subtitle: "2小時客製化入校輔導研習・精準對接教學現場需求",
  description: "各位老師您好！學共輔導團即將來到貴校進行為期 2 小時的「數位工具教與學」入校輔導課程。為了讓研習內容緊密貼合大家的日常教學節奏、硬體環境與真實痛點，誠摯邀請您花費 3~5 分鐘填寫本問卷。您的回饋將直接決定當天講師的工作坊模組配比！",
  sections: [
    {
      id: "section_profile",
      step: 1,
      title: "一、 教師基本背景資料",
      description: "協助輔導團了解各學校、學段與領域的群體組成",
      questions: [
        {
          id: "school_name",
          label: "1. 您的服務學校全銜（例如：新北市文林國小）",
          type: "text",
          required: true,
          placeholder: "請輸入學校全名（例如：新北市文林國小）"
        },
        {
          id: "school_role",
          label: "2. 您的主要任教年段 / 職務",
          type: "radio",
          required: true,
          options: [
            "低年級 (1-2年級)",
            "中年級 (3-4年級)",
            "高年級 (5-6年級)",
            "專任/科任教師",
            "兼任行政教師"
          ]
        },
        {
          id: "teaching_subject",
          label: "3. 您的主要授課領域（可複選）",
          type: "checkbox",
          required: true,
          options: [
            "國語文",
            "數學",
            "英語文 / 本土語",
            "自然科學",
            "社會",
            "藝術 (音樂/視覺/表藝)",
            "健康與體育",
            "綜合活動",
            "科技 / 資訊",
            "跨領域 / 彈性課程"
          ]
        },
        {
          id: "teaching_years",
          label: "4. 您的教學年資",
          type: "radio",
          required: true,
          options: [
            "初任教師 (1~3年)",
            "中生代 (4~10年)",
            "資深教師 (11~20年)",
            "資深領航 (21年以上)"
          ]
        }
      ]
    },
    {
      id: "section_devices",
      step: 2,
      title: "二、 校園數位環境與工具使用現況",
      description: "掌握教室現場硬體設備、數位工具使用頻率與工具類別成熟度",
      questions: [
        {
          id: "hardware_env",
          label: "5. 您常態授課教室之硬體設備現況（可複選）",
          type: "checkbox",
          required: true,
          options: [
            "教室內建大型觸控互動螢幕 (86吋以上)",
            "傳統單槍投影機 + 白/黑板",
            "學生 1:1 生生用平板 (iPad)",
            "學生 1:1 Chromebook / 筆電",
            "小組共用平板 (4人一台)",
            "需預約行動載具車",
            "常態在電腦教室上課"
          ]
        },
        {
          id: "tool_frequency",
          label: "6. 您在常態課堂中「使用數位載具 / 數位工具」的頻率",
          type: "radio",
          required: true,
          options: [
            "幾乎每堂課使用 (每週 4 次以上)",
            "經常使用 (每週 2~3 次)",
            "偶爾使用 (每週 1 次)",
            "較少使用 (每月 1~2 次)",
            "極少使用 / 僅公開授課時使用",
            "目前從未使用"
          ]
        },
        {
          id: "app_tools",
          label: "7. 您目前在課堂中「最常用或曾經使用過」的數位工具（可複選）",
          type: "checkbox",
          required: true,
          options: [
            "Gemini (Google AI 備課與教學對話)",
            "NotebookLM (AI 筆記與教材知識庫)",
            "Microsoft Copilot (微軟 AI 智慧助手)",
            "ChatGPT / GPT (AI 課堂提問與教案命製)",
            "Padlet (數位線上白板/互動牆)",
            "Canva (海報與圖文簡報設計)",
            "Google Classroom / 雲端硬碟",
            "微軟 Word / PPT / Teams",
            "教育部因材網 / Cool English / 均一教育平台",
            "目前極少或尚未使用數位軟體"
          ]
        },
        {
          id: "other_tools",
          label: "8. 其他您常使用的數位工具或 App 名稱（選填）",
          type: "text",
          required: false,
          placeholder: "例如：Wordwall, Quizizz, Kahoot, Lumio, GeoGebra 等"
        },
        {
          id: "ai_experience",
          label: "9. 您對「生成式 AI (如 ChatGPT, Gemini, NotebookLM 等)」的使用經驗",
          type: "radio",
          required: true,
          options: [
            "從未接觸或不太清楚",
            "初學體驗中（曾玩過聊天對話、生圖等）",
            "個人備課應用（會請 AI 生成教案初稿、講義、試題）",
            "課堂教學融入（已引導學生使用 AI 進行探究、對話或提問）",
            "深度應用專家（熟練 Prompt 咒語、客製化 GPTs、整合多款工具）"
          ]
        }
      ]
    },
    {
      id: "section_slc_painpoints",
      step: 3,
      title: "三、 學習共同體課堂融入與教學卡點",
      description: "聚焦自學、互學、伸展跳躍任務中的數位落地難題",
      questions: [
        {
          id: "slc_stages",
          label: "10. 您最希望將數位工具運用在學習共同體的哪一個環節？（可複選）",
          type: "checkbox",
          required: true,
          options: [
            "課前導學與自主學習 (自學/翻轉預習)",
            "小組協作與共同討論 (共學/互學卡片連結)",
            "設計高認知挑戰的「伸展跳躍任務 (Jumping Task)」",
            "全班發表與即時對話傾聽 (全班對話/共構理解)",
            "學習歷程紀錄與形成性評量回饋",
            "教師備課階段的文本解構與跳躍題命製"
          ]
        },
        {
          id: "pain_points",
          label: "11. 在推動數位工具與學共結合時，您面臨的最大卡點是什麼？（可複選，最多選3項）",
          type: "checkbox",
          required: true,
          maxSelect: 3,
          options: [
            "學生載具分心（玩遊戲、發呆、不專心聆聽同伴發言）",
            "操作載具耗時太久，壓縮到小組對話與深度思考時間",
            "不知道如何用數位工具設計出有層次的「跳躍任務」",
            "缺乏符合各單元學共教學的現成數位教材與模組範例",
            "設備連線不穩、帳號登入繁瑣或軟體授權問題",
            "不清楚如何運用生成式 AI 輔助學共教案設計與文本提問",
            "擔心數位工具弱化了學生之間眼神、語言的「實體傾聽關係」"
          ]
        },
        {
          id: "confidence_digital",
          label: "12. 您對「在課堂中操作數位載具與互動軟體」的整體信心度 (1~5分)",
          type: "rating",
          required: true,
          min: 1,
          max: 5,
          minLabel: "1分 (感到焦慮/生疏)",
          maxLabel: "5分 (游刃有餘/信心滿滿)"
        },
        {
          id: "confidence_jumping_task",
          label: "13. 您對「運用數位工具/AI 設計學共伸展跳躍任務」的信心度 (1~5分)",
          type: "rating",
          required: true,
          min: 1,
          max: 5,
          minLabel: "1分 (無從下手)",
          maxLabel: "5分 (已能成熟設計)"
        }
      ]
    },
    {
      id: "section_expectations",
      step: 4,
      title: "四、 2小時入校輔導期待與現場提問",
      description: "打造量身訂製的輔導內容，精準解答您的教學疑惑",
      questions: [
        {
          id: "workshop_modules",
          label: "14. 針對本次 2 小時到校輔導，您最想學習/體驗的實作模組？（可複選）",
          type: "checkbox",
          required: true,
          options: [
            "【模組A】生成式 AI 輔助學共教案與跳躍任務命題實戰 (ChatGPT / Gemini / NotebookLM)",
            "【模組B】小組共學互學神器：Padlet 與免付費數位互動工具在學共課堂的實務操作",
            "【模組C】課堂傾聽與思維可視化：用數位工具記錄學生對話與高光頓悟",
            "【模組D】破除數位分心：學習共同體下的載具班級經營與課堂常規建立",
            "【模組E】分科領域實作工作坊：帶各領域老師產出下週就能上陣的數位學共教案",
            "【模組F】公開課課例示範與數位議課實踐"
          ]
        },
        {
          id: "specific_question",
          label: "15. 您在「數位教學」或「學習共同體」上最想向輔導團講師請教的具體問題或需求（選填）：",
          type: "textarea",
          required: false,
          placeholder: "例如：在數學科高難度題目上，如何用 iPad 讓每組看到不同思考路徑？或是低年級學生如何快速登入不卡關？"
        }
      ]
    }
  ]
};

// 預設示範數據（已清空）
const DEMO_RESPONSES = [];
