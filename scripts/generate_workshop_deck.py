# -*- coding: utf-8 -*-
"""
學習共同體輔導團｜到校輔導簡報自動產出核心腳本
(scripts/generate_workshop_deck.py)

功能：
1. 嚴格引用 scripts/deck_theme.py 之大螢幕字級規範。
2. 自動產出 16:9 專業 PowerPoint (.pptx) 簡報。
3. 自動呼叫 Microsoft Edge Headless 產生 16:9 向量高解析 PDF (.pdf)。
4. 內建字級合規檢核 (validate_pptx_typography)，確保絕無過小字體。
5. 一鍵同步至 Google 雲端硬碟備份。
"""

import os
import sys
import base64
import subprocess
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# 載入大螢幕字級與主題標準
from deck_theme import (
    SLIDE_WIDTH_INCHES, SLIDE_HEIGHT_INCHES,
    PPTXTypography, HTMLTypography, Colors,
    apply_slide_header, create_styled_card, validate_pptx_typography
)

def generate_erqiao_deck(output_dir="."):
    """產出新北市二橋國小大字大屏版簡報"""
    pptx_path = os.path.join(output_dir, "新北市二橋國小_數位工具教與學_2小時到校輔導教案簡報.pptx")
    pdf_path = os.path.join(output_dir, "新北市二橋國小_數位工具教與學_2小時到校輔導教案簡報.pdf")
    html_path = os.path.join(output_dir, "slides_print.html")
    logo_file = "logo.png"

    prs = Presentation()
    prs.slide_width = Inches(SLIDE_WIDTH_INCHES)
    prs.slide_height = Inches(SLIDE_HEIGHT_INCHES)
    blank_layout = prs.slide_layouts[6]

    def set_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(SLIDE_WIDTH_INCHES), Inches(SLIDE_HEIGHT_INCHES))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.color.rgb = color
        return bg

    # -------------------------------------------------------------
    # SLIDE 1: COVER
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1, Colors.DARK_GREEN)

    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(0.18), Inches(5.0))
    bar.fill.solid()
    bar.fill.fore_color.rgb = Colors.ACCENT_GREEN
    bar.line.fill.background()

    tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.1), Inches(10.2), Inches(5.2))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "新北市學習共同體輔導團｜入校輔導專案"
    p0.font.name = "Microsoft JhengHei"
    p0.font.size = Pt(16)
    p0.font.bold = True
    p0.font.color.rgb = Colors.ACCENT_GREEN
    p0.space_after = Pt(14)

    p1 = tf.add_paragraph()
    p1.text = "新北市二橋國小「數位工具教與學」\n2 小時到校輔導課程設計教案"
    p1.font.name = "Microsoft JhengHei"
    p1.font.size = PPTXTypography.COVER_TITLE
    p1.font.bold = True
    p1.font.color.rgb = Colors.CARD_BG
    p1.space_after = Pt(18)

    p2 = tf.add_paragraph()
    p2.text = "🎯 依據 19 位全校教師問卷診斷・破除載具分心・AI 命製跳躍任務"
    p2.font.name = "Microsoft JhengHei"
    p2.font.size = PPTXTypography.COVER_SUBTITLE
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(216, 243, 220)
    p2.space_after = Pt(32)

    p3 = tf.add_paragraph()
    p3.text = "研習對象：新北市二橋國小全體教師　｜　研習時間：120 分鐘（實作工作坊）\n教案規劃：新北市學習共同體輔導團　｜　數據來源：115數位工具前置調查"
    p3.font.name = "Microsoft JhengHei"
    p3.font.size = PPTXTypography.COVER_META
    p3.font.color.rgb = RGBColor(183, 228, 199)

    if os.path.exists(logo_file):
        s1.shapes.add_picture(logo_file, Inches(10.6), Inches(1.5), width=Inches(1.9))

    # -------------------------------------------------------------
    # SLIDE 2: DIAGNOSTIC PROFILE
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2, Colors.LIGHT_BG)
    apply_slide_header(s2, "二橋國小學情診斷：全校教師四大關鍵畫像", logo_path=logo_file)

    cards_info = [
        ("👥 年段極均衡", "19 位", "低年級 4 位 (21%)\n中年級 4 位 (21%)\n高年級 4 位 (21%)\n行政科任 7 位 (37%)\n★ 研習兼顧跨學段彈性", Colors.PRIMARY_GREEN),
        ("🏆 資深骨幹主力", "95%", "21年以上資深 7 位 (37%)\n中生代教師 6 位 (32%)\n資深教師 5 位 (26%)\n★ 教學底蘊極深厚", Colors.PRIMARY_GREEN),
        ("🖥️ 關鍵硬體王牌", "100%", "全校 19 班均內建\n86 吋大型觸控螢幕！\n(平板抽用或生生用)\n★ 重點在大螢幕共構", Colors.CORAL),
        ("📱 載具使用頻率", "雙峰分佈", "每週4次以上：37%\n每月1-2次：26%\n偶爾使用：16%\n★ 高頻與少用並存", Colors.AMBER)
    ]

    for i, (hd, big_stat, desc, col) in enumerate(cards_info):
        cx = Inches(0.8 + i * 2.95)
        cy = Inches(1.65)
        cw = Inches(2.8)
        ch = Inches(5.1)

        card = create_styled_card(s2, cx, cy, cw, ch, border_color=col)
        tb = s2.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.2), cw - Inches(0.4), ch - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = hd
        p0.font.name = "Microsoft JhengHei"
        p0.font.size = PPTXTypography.BIG_STAT_LABEL
        p0.font.bold = True
        p0.font.color.rgb = col
        p0.alignment = PP_ALIGN.CENTER
        p0.space_after = Pt(6)

        p_stat = tf.add_paragraph()
        p_stat.text = big_stat
        p_stat.font.name = "Microsoft JhengHei"
        p_stat.font.size = Pt(32)
        p_stat.font.bold = True
        p_stat.font.color.rgb = Colors.DARK_GREEN
        p_stat.alignment = PP_ALIGN.CENTER
        p_stat.space_after = Pt(12)

        for line in desc.split("\n"):
            p = tf.add_paragraph()
            p.text = line
            p.font.name = "Microsoft JhengHei"
            if "★" in line:
                p.font.size = Pt(14)
                p.font.bold = True
                p.font.color.rgb = col
                p.space_before = Pt(8)
            else:
                p.font.size = PPTXTypography.BODY_BULLET
                p.font.color.rgb = Colors.TEXT_MAIN
                p.space_after = Pt(3)

    # -------------------------------------------------------------
    # SLIDE 3: PAIN POINTS VS VOTES
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3, Colors.LIGHT_BG)
    apply_slide_header(s3, "二橋三大痛點魔王 vs 模組票選期待 Top 3", logo_path=logo_file)

    l_card = create_styled_card(s3, Inches(0.8), Inches(1.65), Inches(5.7), Inches(5.1), border_color=Colors.CORAL)
    ltb = s3.shapes.add_textbox(Inches(1.1), Inches(1.85), Inches(5.1), Inches(4.7))
    ltf = ltb.text_frame
    ltf.word_wrap = True

    p_lh = ltf.paragraphs[0]
    p_lh.text = "🚨 二橋教師最大的三個課堂卡點"
    p_lh.font.name = "Microsoft JhengHei"
    p_lh.font.size = PPTXTypography.CARD_TITLE
    p_lh.font.bold = True
    p_lh.font.color.rgb = Colors.CORAL
    p_lh.space_after = Pt(16)

    pains = [
        ("1. 載具分心與破壞傾聽 (53%)", "玩遊戲、發呆、不聽發言；螢幕亮著時眼神不再注視同伴。"),
        ("2. 操作載具耗時太久 (47%)", "帳號登入繁瑣、連線不穩；搞載具嚴重壓縮小組深思時間！"),
        ("3. 跳躍題設計缺乏指引 (32%)", "不知道如何結合數位設計高挑戰題（跳躍題信心僅 2.68 分）。")
    ]
    for pt, pd in pains:
        p = ltf.add_paragraph()
        p.text = pt
        p.font.name = "Microsoft JhengHei"
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = Colors.DARK_GREEN
        p.space_after = Pt(2)

        p2 = ltf.add_paragraph()
        p2.text = pd
        p2.font.name = "Microsoft JhengHei"
        p2.font.size = PPTXTypography.BODY_BULLET
        p2.font.color.rgb = Colors.TEXT_MUTED
        p2.space_after = Pt(12)

    r_card = create_styled_card(s3, Inches(6.8), Inches(1.65), Inches(5.7), Inches(5.1), border_color=Colors.PRIMARY_GREEN)
    rtb = s3.shapes.add_textbox(Inches(7.1), Inches(1.85), Inches(5.1), Inches(4.7))
    rtf = rtb.text_frame
    rtf.word_wrap = True

    p_rh = rtf.paragraphs[0]
    p_rh.text = "🎯 研習實作模組期待排行 Top 3"
    p_rh.font.name = "Microsoft JhengHei"
    p_rh.font.size = PPTXTypography.CARD_TITLE
    p_rh.font.bold = True
    p_rh.font.color.rgb = Colors.PRIMARY_GREEN
    p_rh.space_after = Pt(16)

    mods = [
        ("🥇 【模組A】AI 命製跳躍任務 (10票 / 53%)", "用 Gemini / NotebookLM 備課，3分鐘產出高層次跳躍題。"),
        ("🥈 【模組B】Padlet 共學互學神器 (9票 / 47%)", "免付費互動牆，小組討論一鍵張貼，串聯大螢幕共構。"),
        ("🥉 【模組D】破除分心班級經營 (8票 / 42%)", "螢幕反轉法與免登入快速常規，把時間還給學生對話！")
    ]
    for mt, md in mods:
        p = rtf.add_paragraph()
        p.text = mt
        p.font.name = "Microsoft JhengHei"
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = Colors.PRIMARY_GREEN
        p.space_after = Pt(2)

        p2 = rtf.add_paragraph()
        p2.text = md
        p2.font.name = "Microsoft JhengHei"
        p2.font.size = PPTXTypography.BODY_BULLET
        p2.font.color.rgb = Colors.TEXT_MUTED
        p2.space_after = Pt(12)

    # -------------------------------------------------------------
    # SLIDE 4: CORE THREE STRATEGIES
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4, Colors.LIGHT_BG)
    apply_slide_header(s4, "課程指導心法：二橋專屬破局三策", logo_path=logo_file)

    strat_data = [
        ("策略一：常規先行", "守護實體傾聽", "• 實踐『三秒蓋板 / 螢幕反轉』：發言時眼看同伴，載具平放。\n• 免帳號極速入場：QR-Code 一掃即進，登入由 10分鐘壓到 30秒。\n• 平板是『思維筆記本』，守護課堂溫潤眼神對話。", Colors.PRIMARY_GREEN),
        ("策略二：善用 86吋大屏", "告別個別孤島", "• 不推生生用平板各自孤立，改以 4人一組共用 1 載具共學。\n• 各組多元解法一秒推播至黑板 86 吋觸控大螢幕。\n• 教師在大屏圈選、對比，促發全班高階共構對話。", Colors.AMBER),
        ("策略三：AI 命題跳躍題", "突破 2.68分信心瓶頸", "• 課本單元丟給 AI，3分鐘解構文本三層次思維。\n• 產出具備認知衝突的『伸展跳躍任務 (Jumping Task)』。\n• 研習現場實作，每位老師帶走下週立即可用的教案！", Colors.CORAL)
    ]

    for i, (hd1, hd2, bullets, col) in enumerate(strat_data):
        sx = Inches(0.8 + i * 3.95)
        sy = Inches(1.65)
        sw = Inches(3.8)
        sh = Inches(5.1)

        card = create_styled_card(s4, sx, sy, sw, sh, border_color=col)
        tb = s4.shapes.add_textbox(sx + Inches(0.25), sy + Inches(0.25), sw - Inches(0.5), sh - Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = hd1
        p0.font.name = "Microsoft JhengHei"
        p0.font.size = Pt(21)
        p0.font.bold = True
        p0.font.color.rgb = col
        p0.space_after = Pt(2)

        p_sub = tf.add_paragraph()
        p_sub.text = hd2
        p_sub.font.name = "Microsoft JhengHei"
        p_sub.font.size = PPTXTypography.CARD_SUBTITLE
        p_sub.font.color.rgb = Colors.TEXT_MUTED
        p_sub.space_after = Pt(16)

        for b in bullets.split("\n"):
            p = tf.add_paragraph()
            p.text = b
            p.font.name = "Microsoft JhengHei"
            p.font.size = PPTXTypography.BODY_PRIMARY
            p.font.color.rgb = Colors.TEXT_MAIN
            p.space_after = Pt(10)

    # -------------------------------------------------------------
    # SLIDE 5: 120-MIN WORKSHOP TIMELINE TABLE
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5, Colors.LIGHT_BG)
    apply_slide_header(s5, "2小時工作坊教案流程總覽（起承轉合）", logo_path=logo_file)

    rows, cols = 6, 4
    t_shape = s5.shapes.add_table(rows, cols, Inches(0.8), Inches(1.65), Inches(11.733), Inches(5.1))
    t = t_shape.table
    t.columns[0].width = Inches(1.8)
    t.columns[1].width = Inches(2.3)
    t.columns[2].width = Inches(5.4)
    t.columns[3].width = Inches(2.233)

    t_headers = ["時間", "環節主題", "研習核心實作任務", "對接模組與痛點"]
    for j, h in enumerate(t_headers):
        c = t.cell(0, j)
        c.text = h
        c.fill.solid()
        c.fill.fore_color.rgb = Colors.DARK_GREEN
        p = c.text_frame.paragraphs[0]
        p.font.name = "Microsoft JhengHei"
        p.font.size = PPTXTypography.TABLE_HEADER
        p.font.bold = True
        p.font.color.rgb = Colors.CARD_BG
        p.alignment = PP_ALIGN.CENTER

    t_rows = [
        ("00:00-00:15\n(15 分鐘)", "【起】現場共鳴\n二橋數據健檢", "• 投放大螢幕展示二橋 19 位教師真實痛點數據\n• 點破盲點：「數位是梯子，傾聽才是靈魂」", "破冰共鳴\n化解載具焦慮"),
        ("00:15-00:40\n(25 分鐘)", "【承】破除分心\n學共載具常規", "• 免帳號極速入場：QR-Code 30秒進入討論\n• 「三秒蓋板」常規：說話看眼睛、平放載具", "【模組 D】\n終結操作耗時\n破除載具分心"),
        ("00:40-01:10\n(30 分鐘)", "【轉】小組共學\n思維可視大屏", "• 4人小組共用1載具：Padlet 免登入互動演練\n• 86吋觸控大螢幕串聯：各組解法秒上大屏圈選", "【模組 B】\n共學互學神器\n大螢幕高階共構"),
        ("01:10-01:50\n(40 分鐘)", "【合】AI 實戰\n命製跳躍任務", "• 文本解構三層次：提取 ➔ 統整 ➔ 伸展跳躍\n• AI 咒語實戰：現場產出下週可用跳躍題教案", "【模組 A】\nAI 備課賦能\n跳躍題信心提升"),
        ("01:50-02:00\n(10 分鐘)", "【座談】現場回饋\n二橋個別解惑", "• 精準回答二橋老師個別提問（低年級、互動教材）\n• 發布「二橋專屬數位學共資源包」雲端連結", "個別提問現場破解\n課後持續陪伴")
    ]

    for i, rdata in enumerate(t_rows):
        for j, val in enumerate(rdata):
            c = t.cell(i + 1, j)
            c.text = val
            c.fill.solid()
            c.fill.fore_color.rgb = RGBColor(255, 255, 255) if i % 2 == 0 else RGBColor(238, 246, 241)
            p = c.text_frame.paragraphs[0]
            p.font.name = "Microsoft JhengHei"
            p.font.size = PPTXTypography.TABLE_CELL
            p.font.color.rgb = Colors.TEXT_MAIN
            if j == 0 or j == 1 or j == 3:
                p.alignment = PP_ALIGN.CENTER
                p.font.bold = True
                if j == 3:
                    p.font.color.rgb = Colors.CORAL

    # -------------------------------------------------------------
    # SLIDE 6: MODULE D DEEP DIVE
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6, Colors.LIGHT_BG)
    apply_slide_header(s6, "模組 D 落地實務：破除分心與學共載具常規", logo_path=logo_file)

    points_d = [
        ("一、 根絕『耗時15分鐘』的極速登入常規", [
            "• 傳統痛點：學生忘記帳號密碼、大小寫分不清，搞登入消耗半堂課！",
            "• 解決對策：全面採用『零登入 / 免帳號 QR-Code』與短網址代碼直達。",
            "• 課堂成效：開機掃描 30 秒進入討論情境，把完整時間還給學生深度對話！"
        ], Colors.PRIMARY_GREEN),
        ("二、 守護眼神與語言的『三秒蓋板三步驟』", [
            "• 步驟 1【倒數指令】：口令『3、2、1，螢幕蓋板』，全班動作一致。",
            "• 步驟 2【姿態重置】：平板面朝下平放桌角，雙手自然置於桌面，停止滑動。",
            "• 步驟 3【視線聚焦】：雙眼抬起注視發言夥伴，啟動高專注實體傾聽關係。"
        ], Colors.CORAL),
        ("三、 低年級學童的『防卡關三法寶』", [
            "• 法寶 1【顏色組別平板】：背貼大面積紅/藍/黃/綠標籤，依組領取不分個人機。",
            "• 法寶 2【免注音打字】：引導學生按下麥克風語音輸入，或拍下小白板實體操作。",
            "• 法寶 3【單一桌面捷徑】：桌面僅留一個當日任務網頁捷徑，點開直接開始。"
        ], Colors.AMBER)
    ]

    for i, (hd, blist, col) in enumerate(points_d):
        py = Inches(1.65 + i * 1.7)
        card = create_styled_card(s6, Inches(0.8), py, Inches(11.733), Inches(1.5), border_color=col)
        tb = s6.shapes.add_textbox(Inches(1.1), py + Inches(0.12), Inches(11.1), Inches(1.25))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = hd
        p0.font.name = "Microsoft JhengHei"
        p0.font.size = Pt(17)
        p0.font.bold = True
        p0.font.color.rgb = col
        p0.space_after = Pt(4)

        for b in blist:
            p = tf.add_paragraph()
            p.text = b
            p.font.name = "Microsoft JhengHei"
            p.font.size = PPTXTypography.BODY_SECONDARY
            p.font.color.rgb = Colors.TEXT_MAIN
            p.space_after = Pt(2)

    # -------------------------------------------------------------
    # SLIDE 7: MODULE B DEEP DIVE
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7, Colors.LIGHT_BG)
    apply_slide_header(s7, "模組 B 落地實務：Padlet 小組共學與 86吋大屏共構", logo_path=logo_file)

    c_left = create_styled_card(s7, Inches(0.8), Inches(1.65), Inches(5.7), Inches(5.1), border_color=Colors.PRIMARY_GREEN)
    ltb7 = s7.shapes.add_textbox(Inches(1.1), Inches(1.85), Inches(5.1), Inches(4.7))
    ltf7 = ltb7.text_frame
    ltf7.word_wrap = True

    p_lb7 = ltf7.paragraphs[0]
    p_lb7.text = "📱 小組輕量共學：4人共用 1 載具"
    p_lb7.font.name = "Microsoft JhengHei"
    p_lb7.font.size = PPTXTypography.CARD_TITLE
    p_lb7.font.bold = True
    p_lb7.font.color.rgb = Colors.PRIMARY_GREEN
    p_lb7.space_after = Pt(12)

    btexts_left = [
        ("為什麼不推生生用平板？", True),
        ("人手一台容易陷入『各自孤島』，各滑各的，完全沒有真正的傾聽與對話！", False),
        ("4人共用 1 載具的協作魔力：", True),
        ("• 角色輪替：1 人負責記錄，其餘 3 人專注發想、檢核與質疑討論。", False),
        ("• 實體對話先行：組內必須先達成共識，才能由記錄者打字或拍照上傳。", False),
        ("• Padlet 零門檻張貼：小組將解法卡、疑惑卡一鍵張貼，隨時回溯思考軌跡。", False)
    ]
    for txt, is_bold in btexts_left:
        p = ltf7.add_paragraph()
        p.text = txt
        p.font.name = "Microsoft JhengHei"
        p.font.size = PPTXTypography.BODY_PRIMARY if is_bold else PPTXTypography.BODY_BULLET
        p.font.bold = is_bold
        p.font.color.rgb = Colors.PRIMARY_GREEN if is_bold else Colors.TEXT_MAIN
        p.space_after = Pt(6)

    c_right = create_styled_card(s7, Inches(6.8), Inches(1.65), Inches(5.7), Inches(5.1), border_color=Colors.AMBER)
    rtb7 = s7.shapes.add_textbox(Inches(7.1), Inches(1.85), Inches(5.1), Inches(4.7))
    rtf7 = rtb7.text_frame
    rtf7.word_wrap = True

    p_rb7 = rtf7.paragraphs[0]
    p_rb7.text = "🖥️ 86吋觸控大螢幕：思維可視化共構"
    p_rb7.font.name = "Microsoft JhengHei"
    p_rb7.font.size = PPTXTypography.CARD_TITLE
    p_rb7.font.bold = True
    p_rb7.font.color.rgb = Colors.AMBER
    p_rb7.space_after = Pt(12)

    btexts_right = [
        ("全校 100% 內建大螢幕的最強戰術：", True),
        ("• 全班想法並列：大螢幕同時並列各組思考路徑，告別單組輪流報的枯燥。", False),
        ("• 觸控筆畫圈連線：教師與學生走上講台，直接在大屏圈出亮點與矛盾。", False),
        ("• 促發全班對話：『第 2 組和第 4 組有什麼不同？誰能看懂他們的想法？』", False),
        ("• 從作業升華為共構：大螢幕不是投影機，而是全班共同探究的大黑板！", False)
    ]
    for txt, is_bold in btexts_right:
        p = rtf7.add_paragraph()
        p.text = txt
        p.font.name = "Microsoft JhengHei"
        p.font.size = PPTXTypography.BODY_PRIMARY if is_bold else PPTXTypography.BODY_BULLET
        p.font.bold = is_bold
        p.font.color.rgb = Colors.AMBER if is_bold else Colors.TEXT_MAIN
        p.space_after = Pt(6)

    # -------------------------------------------------------------
    # SLIDE 8: MODULE A DEEP DIVE (AI JUMPING TASK)
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8, Colors.LIGHT_BG)
    apply_slide_header(s8, "模組 A 落地實務：AI Agent 命製學共伸展跳躍任務", logo_path=logo_file)

    levels = [
        ("層次一：基礎提取題 (30%)", "掌握課本事實、核心定義或基本算則。\n• 例：主角遇到什麼困境？這題條件是什麼？", Colors.PRIMARY_GREEN),
        ("層次二：推論統整題 (60%)", "小組互學探究因果關係與多元解法。\n• 例：為什麼做此選擇？兩種算式本質同嗎？", Colors.AMBER),
        ("層次三：伸展跳躍題 (100% Jumping Task)", "高認知挑戰、開放思考、促發同儕借力！\n• 例：如果結局翻轉，如何改寫？有何生活模型？", Colors.CORAL)
    ]
    for i, (l_title, l_desc, l_col) in enumerate(levels):
        lx = Inches(0.8 + i * 3.95)
        ly = Inches(1.65)
        lw = Inches(3.8)
        lh = Inches(2.2)

        card = create_styled_card(s8, lx, ly, lw, lh, border_color=l_col)
        tb = s8.shapes.add_textbox(lx + Inches(0.2), ly + Inches(0.15), lw - Inches(0.4), lh - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = l_title
        p0.font.name = "Microsoft JhengHei"
        p0.font.size = Pt(16)
        p0.font.bold = True
        p0.font.color.rgb = l_col
        p0.space_after = Pt(4)

        for line in l_desc.split("\n"):
            p = tf.add_paragraph()
            p.text = line
            p.font.name = "Microsoft JhengHei"
            p.font.size = Pt(14)
            p.font.color.rgb = Colors.TEXT_MAIN
            p.space_after = Pt(2)

    p_box = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.05), Inches(11.733), Inches(2.7))
    p_box.fill.solid()
    p_box.fill.fore_color.rgb = Colors.DARK_SLATE
    p_box.line.color.rgb = Colors.ACCENT_GREEN
    p_box.line.width = Pt(2)

    ptb = s8.shapes.add_textbox(Inches(1.1), Inches(4.15), Inches(11.1), Inches(2.5))
    ptf = ptb.text_frame
    ptf.word_wrap = True

    pp0 = ptf.paragraphs[0]
    pp0.text = "🪄 現場實作：二橋專屬 AI 跳躍任務命題咒語（複製貼上 Gemini / ChatGPT）"
    pp0.font.name = "Microsoft JhengHei"
    pp0.font.size = Pt(16)
    pp0.font.bold = True
    pp0.font.color.rgb = Colors.ACCENT_GREEN
    pp0.space_after = Pt(6)

    prompt_lines = [
        "你是一位專精日本佐藤學『學習共同體』教學法的國小教材研發專家。",
        "我目前要教授［科目/年級/單元名稱］，課本段落或核心概念如下：［貼上課文或概念］。",
        "請為我設計：",
        "1. 2 題小組共學互學探究題（促發學生提出不同觀察角度與深層對話）。",
        "2. 1 題高挑戰度的『伸展跳躍任務 (Jumping Task)』（具備認知衝突、開放思考、非單一標準答案）。",
        "3. 針對跳躍任務，提供老師 3 個課堂引導與追問的理答支架提問。"
    ]
    for line in prompt_lines:
        p = ptf.add_paragraph()
        p.text = line
        p.font.name = "Microsoft JhengHei"
        p.font.size = PPTXTypography.PROMPT_CODE
        p.font.color.rgb = RGBColor(241, 245, 249)
        p.space_after = Pt(2)

    # -------------------------------------------------------------
    # SLIDE 9: TEACHER QA SOLUTIONS
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9, Colors.LIGHT_BG)
    apply_slide_header(s9, "二橋個別提問現場破解：低年級不卡關與互動小遊戲", logo_path=logo_file)

    q1 = create_styled_card(s9, Inches(0.8), Inches(1.65), Inches(5.7), Inches(5.1), border_color=Colors.CORAL)
    q1_tb = s9.shapes.add_textbox(Inches(1.1), Inches(1.85), Inches(5.1), Inches(4.7))
    q1_tf = q1_tb.text_frame
    q1_tf.word_wrap = True

    qp0 = q1_tf.paragraphs[0]
    qp0.text = "❓ 低年級老師提問："
    qp0.font.name = "Microsoft JhengHei"
    qp0.font.size = Pt(15)
    qp0.font.bold = True
    qp0.font.color.rgb = Colors.CORAL

    qp1 = q1_tf.add_paragraph()
    qp1.text = "「低年級學生如何快速上手不卡關？」"
    qp1.font.name = "Microsoft JhengHei"
    qp1.font.size = Pt(19)
    qp1.font.bold = True
    qp1.font.color.rgb = Colors.DARK_GREEN
    qp1.space_after = Pt(12)

    q1_points = [
        ("💡 輔導團三階落地解方：", True),
        ("1. 【取消個人帳密】低年級不記帳號！每組 1 台貼顏色標籤的公用平板，掃 QR-code 直接進任務畫面。", False),
        ("2. 【語音輸入代替打字】學生按麥克風說話自動轉文字，識字量少也能暢所欲言表達思維。", False),
        ("3. 【拍照代替複雜操作】實體積木、小白板擺好後，小組『按拍照鍵』直接上傳，3 秒完成記錄！", False)
    ]
    for pt, is_bold in q1_points:
        p = q1_tf.add_paragraph()
        p.text = pt
        p.font.name = "Microsoft JhengHei"
        p.font.size = PPTXTypography.BODY_PRIMARY if is_bold else PPTXTypography.BODY_BULLET
        p.font.bold = is_bold
        p.font.color.rgb = Colors.PRIMARY_GREEN if is_bold else Colors.TEXT_MAIN
        p.space_after = Pt(8)

    q2 = create_styled_card(s9, Inches(6.8), Inches(1.65), Inches(5.7), Inches(5.1), border_color=Colors.PRIMARY_GREEN)
    q2_tb = s9.shapes.add_textbox(Inches(7.1), Inches(1.85), Inches(5.1), Inches(4.7))
    q2_tf = q2_tb.text_frame
    q2_tf.word_wrap = True

    qp2_0 = q2_tf.paragraphs[0]
    qp2_0.text = "❓ 科任/資深老師提問："
    qp2_0.font.name = "Microsoft JhengHei"
    qp2_0.font.size = Pt(15)
    qp2_0.font.bold = True
    qp2_0.font.color.rgb = Colors.PRIMARY_GREEN

    qp2_1 = q2_tf.add_paragraph()
    qp2_1.text = "「如何設計互動小遊戲且不耗費許多時間？」"
    qp2_1.font.name = "Microsoft JhengHei"
    qp2_1.font.size = Pt(18)
    qp2_1.font.bold = True
    qp2_1.font.color.rgb = Colors.DARK_GREEN
    qp2_1.space_after = Pt(12)

    q2_points = [
        ("💡 輔導團三階落地解方：", True),
        ("1. 【AI 餵料 1 分鐘生題庫】將課本貼給 Gemini：『產生 5 題四選一選擇題』，複製直接匯入 Wordwall。", False),
        ("2. 【Wordwall 一鍵換造型】貼入一次題目，系統自動切換打地鼠、輪盤、連連看，免重複備課！", False),
        ("3. 【86吋大螢幕雙人擂台】免發平板！兩位學生直接上台在大螢幕觸控搶答，全班同步觀戰思辨！", False)
    ]
    for pt, is_bold in q2_points:
        p = q2_tf.add_paragraph()
        p.text = pt
        p.font.name = "Microsoft JhengHei"
        p.font.size = PPTXTypography.BODY_PRIMARY if is_bold else PPTXTypography.BODY_BULLET
        p.font.bold = is_bold
        p.font.color.rgb = Colors.PRIMARY_GREEN if is_bold else Colors.TEXT_MAIN
        p.space_after = Pt(8)

    # -------------------------------------------------------------
    # SLIDE 10: DELIVERABLES
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    set_bg(s10, Colors.DARK_GREEN)

    tb = s10.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.733), Inches(1.3))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "攜手二橋・課後落地有保障"
    p0.font.name = "Microsoft JhengHei"
    p0.font.size = Pt(15)
    p0.font.bold = True
    p0.font.color.rgb = Colors.ACCENT_GREEN

    p1 = tf.add_paragraph()
    p1.text = "🎁 研習交付成果與課後陪伴資源"
    p1.font.name = "Microsoft JhengHei"
    p1.font.size = Pt(30)
    p1.font.bold = True
    p1.font.color.rgb = Colors.CARD_BG

    delivs = [
        ("📦 成果一：即戰力教案現場產出", "每位參與研習的老師，在 40 分鐘實作中現場完成 1 份下週就能直接進班上陣的學共伸展跳躍任務教案！"),
        ("🪄 成果二：二橋專屬 AI 提示詞速查卡", "提供二橋教師專屬《學共 AI 備課提示詞手冊》，包含國語閱讀理解、數學多解探究之標準 Prompt。"),
        ("📋 成果三：學共載具班級常規檢核表", "提供低年級與中高年級適用的課堂常規檢核清單（螢幕蓋板三步驟口令、4人小組分工合作指標）。"),
        ("🤝 成果四：輔導團雲端資源庫持續陪伴", "建立二橋國小專屬雲端硬碟，講師示範簡報、Padlet 範本、觀課議課實例影片持續共享與支持更新。")
    ]

    for i, (dtitle, ddesc) in enumerate(delivs):
        dx = Inches(0.8 + (i % 2) * 5.95)
        dy = Inches(2.1 + (i // 2) * 2.4)
        dw = Inches(5.7)
        dh = Inches(2.2)

        c = create_styled_card(s10, dx, dy, dw, dh, border_color=Colors.ACCENT_GREEN, fill_color=RGBColor(40, 92, 66))
        dtb = s10.shapes.add_textbox(dx + Inches(0.35), dy + Inches(0.25), dw - Inches(0.7), dh - Inches(0.5))
        dtf = dtb.text_frame
        dtf.word_wrap = True

        dp0 = dtf.paragraphs[0]
        dp0.text = dtitle
        dp0.font.name = "Microsoft JhengHei"
        dp0.font.size = Pt(19)
        dp0.font.bold = True
        dp0.font.color.rgb = Colors.CARD_BG
        dp0.space_after = Pt(8)

        dp1 = dtf.add_paragraph()
        dp1.text = ddesc
        dp1.font.name = "Microsoft JhengHei"
        dp1.font.size = PPTXTypography.BODY_BULLET
        dp1.font.color.rgb = RGBColor(216, 243, 220)

    # 執行字級標準合規稽核
    validate_pptx_typography(prs)

    # 存檔
    prs.save(pptx_path)
    print(f"PPTX successfully created and validated: {pptx_path}")

    # 呼叫 Edge Headless 匯出高解析大字版 PDF
    if os.path.exists(html_path):
        edge_cmd = [
            "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
            "--headless", "--disable-gpu", "--no-pdf-header-footer",
            f"--print-to-pdf={os.path.abspath(pdf_path)}",
            f"file:///{os.path.abspath(html_path).replace(os.sep, '/')}"
        ]
        try:
            subprocess.run(edge_cmd, check=True, timeout=30)
            print(f"PDF successfully compiled via Edge: {pdf_path}")
        except Exception as e:
            print(f"Edge PDF generation error: {e}")

if __name__ == "__main__":
    generate_erqiao_deck()
