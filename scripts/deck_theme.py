# -*- coding: utf-8 -*-
"""
學習共同體輔導團｜簡報大螢幕投影（86吋大屏）視認性規範與主題配置模組
(scripts/deck_theme.py)

目的：
規範所有到校輔導簡報（PowerPoint / PDF / HTML）的版面比例、字級下限、高對比配色與留白排版。
確保投放到 86 吋觸控大螢幕或教室投影機時，後排學員皆能清晰辨識，不需手動微調。
"""

import os
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# ==============================================================================
# 1. 簡報畫布尺寸標準 (16:9 黃金比例)
# ==============================================================================
SLIDE_WIDTH_INCHES = 13.333
SLIDE_HEIGHT_INCHES = 7.5
HTML_CANVAS_WIDTH_PX = 1920
HTML_CANVAS_HEIGHT_PX = 1080

# ==============================================================================
# 2. 大螢幕字級標準規範 (強制下限，禁止使用微型字體)
# ==============================================================================
class PPTXTypography:
    """PowerPoint 專用字級標準 (單位: Pt)"""
    COVER_TITLE = Pt(38)          # 封面主標題 (38~44pt)
    COVER_SUBTITLE = Pt(20)       # 封面副標題
    COVER_META = Pt(14)           # 封面中繼資訊 (講師/日期)
    
    SLIDE_TITLE = Pt(26)          # 內頁大標題 (26~32pt)
    SLIDE_CATEGORY = Pt(13)       # 內頁頂部標籤/小分類
    
    CARD_TITLE = Pt(20)           # 內容卡片主標題 (20~24pt)
    CARD_SUBTITLE = Pt(14)        # 卡片副標
    
    BIG_STAT_NUM = Pt(40)         # 關鍵統計數字 (36~52pt 視覺亮點)
    BIG_STAT_LABEL = Pt(17)       # 關鍵數字標題
    
    BODY_PRIMARY = Pt(16)         # 正文條列第一層 (16~18pt)
    BODY_TEXT = Pt(16)            # 正文條列別名
    BODY_SECONDARY = Pt(14.5)     # 正文條列第二層 (14~15pt)
    BODY_BULLET = Pt(15)          # 一般條列點 (15pt)
    
    TABLE_HEADER = Pt(15)         # 表格表頭
    TABLE_CELL = Pt(14)           # 表格單元格內文 (絕對不得低於 13pt)
    
    PROMPT_CODE = Pt(13.5)        # 提示詞/代碼框文字
    
    MINIMUM_ALLOWED = Pt(13.0)    # 全簡報絕對字級下限 (任何註腳不得小於 13pt)

class HTMLTypography:
    """1920x1080 網頁/PDF 向量畫布字級標準 (單位: px)"""
    COVER_TITLE = "58px"
    COVER_SUBTITLE = "28px"
    COVER_META = "22px"
    
    SLIDE_TITLE = "42px"
    SLIDE_CATEGORY = "19px"
    
    CARD_TITLE = "26px"
    BIG_STAT_NUM = "52px"
    BIG_STAT_LABEL = "22px"
    
    BODY_PRIMARY = "21px"
    BODY_SECONDARY = "19px"
    
    TABLE_HEADER = "23px"
    TABLE_CELL = "20px"
    
    PROMPT_CODE = "20px"
    MINIMUM_ALLOWED = "18px"      # HTML 畫布絕對字級下限

# ==============================================================================
# 3. 學共溫潤綠高對比配色系統 (RGB & HEX)
# ==============================================================================
class Colors:
    # PPTX RGB
    DARK_GREEN = RGBColor(27, 67, 50)       # #1b4332 深墨綠 (封面與主標)
    PRIMARY_GREEN = RGBColor(45, 106, 79)   # #2d6a4f 典雅學共綠
    ACCENT_GREEN = RGBColor(82, 183, 136)   # #52b788 活力嫩綠 (強調與外框)
    MINT_LIGHT = RGBColor(232, 245, 233)    # #e8f5e9 淺綠底色
    LIGHT_BG = RGBColor(246, 249, 246)      # #f6f9f6 簡報背景色
    CARD_BG = RGBColor(255, 255, 255)       # 純白卡片
    
    CORAL = RGBColor(231, 111, 81)          # #e76f51 珊瑚紅 (痛點與警告)
    AMBER = RGBColor(224, 159, 62)          # #e09f3e 琥珀金 (關鍵關注)
    DARK_SLATE = RGBColor(30, 41, 59)       # #1e293b 深藍灰 (代碼與Prompt框)
    
    TEXT_MAIN = RGBColor(33, 37, 41)        # #212529 極高對比正文
    TEXT_MUTED = RGBColor(73, 80, 87)       # #495057 次要文字
    BORDER_LIGHT = RGBColor(216, 230, 222)  # #d8e6de 卡片淺邊框
    
    # HEX String for HTML / CSS
    HEX_DARK_GREEN = "#1b4332"
    HEX_PRIMARY_GREEN = "#2d6a4f"
    HEX_ACCENT_GREEN = "#52b788"
    HEX_LIGHT_BG = "#f6f9f6"
    HEX_CARD_BG = "#ffffff"
    HEX_CORAL = "#e76f51"
    HEX_AMBER = "#e09f3e"
    HEX_TEXT_MAIN = "#212529"
    HEX_TEXT_MUTED = "#495057"
    HEX_BORDER = "#d8e6de"

# ==============================================================================
# 4. PPTX 輔助構建工具函式
# ==============================================================================
def apply_slide_header(slide, title_text, category_text="學習共同體輔導團・2小時到校輔導教案", logo_path="logo.png"):
    """統一為幻燈片套用大字版頂部導覽標題列"""
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.0), Inches(1.1))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p_cat = tf.paragraphs[0]
    p_cat.text = category_text
    p_cat.font.name = "Microsoft JhengHei"
    p_cat.font.size = PPTXTypography.SLIDE_CATEGORY
    p_cat.font.bold = True
    p_cat.font.color.rgb = Colors.PRIMARY_GREEN
    p_cat.space_after = Pt(2)

    p_t = tf.add_paragraph()
    p_t.text = title_text
    p_t.font.name = "Microsoft JhengHei"
    p_t.font.size = PPTXTypography.SLIDE_TITLE
    p_t.font.bold = True
    p_t.font.color.rgb = Colors.DARK_GREEN

    if logo_path and os.path.exists(logo_path):
        slide.shapes.add_picture(logo_path, Inches(11.9), Inches(0.4), width=Inches(0.75))

def create_styled_card(slide, left, top, width, height, border_color=Colors.BORDER_LIGHT, fill_color=Colors.CARD_BG, line_width=Pt(2)):
    """在 PPTX 中建立圓角風格卡片"""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = fill_color
    card.line.color.rgb = border_color
    card.line.width = line_width
    return card

def validate_pptx_typography(prs):
    """
    字級品質稽核函式：
    遍歷簡報中所有形狀與文字方塊，檢驗是否存在小於 MINIMUM_ALLOWED (13pt) 的微小文字。
    若發現過小文字即印出警示。
    """
    violations = []
    min_pt = PPTXTypography.MINIMUM_ALLOWED.pt
    
    for s_idx, slide in enumerate(prs.slides):
        for shape in slide.shapes:
            if shape.has_text_frame:
                for p in shape.text_frame.paragraphs:
                    for run in p.runs:
                        if run.font.size and run.font.size.pt < min_pt:
                            violations.append((s_idx + 1, run.text, run.font.size.pt))
                            
    if violations:
        print(f"[警告] 發現 {len(violations)} 處文字小於大螢幕標準 ({min_pt}pt)：")
        for v in violations[:5]:
            print(f"  - 第 {v[0]} 頁: 「{v[1][:15]}...」 字級為 {v[2]}pt")
    else:
        print(f"[品質檢驗通過] 全簡報文字字級均符合 86吋大螢幕視認性標準 (>= {min_pt}pt)！")
    return len(violations) == 0

# ==============================================================================
# 5. HTML / CSS 大字版樣式範本產生器
# ==============================================================================
def get_big_screen_css():
    """回傳 1920x1080 規格之高解析、大字版 CSS 樣式字串"""
    return f"""
  @page {{
    size: {HTML_CANVAS_WIDTH_PX}px {HTML_CANVAS_HEIGHT_PX}px;
    margin: 0;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
    color: {Colors.HEX_TEXT_MAIN};
    background: #f4f7f5;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}
  .slide {{
    width: {HTML_CANVAS_WIDTH_PX}px;
    height: {HTML_CANVAS_HEIGHT_PX}px;
    page-break-after: always;
    position: relative;
    padding: 55px 75px;
    background: {Colors.HEX_LIGHT_BG};
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }}
  .slide-header {{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    border-bottom: 3px solid {Colors.HEX_BORDER};
    padding-bottom: 16px;
  }}
  .header-left .tag {{
    font-size: {HTMLTypography.SLIDE_CATEGORY};
    font-weight: 700;
    color: {Colors.HEX_PRIMARY_GREEN};
    margin-bottom: 4px;
  }}
  .header-left h2 {{
    font-size: {HTMLTypography.SLIDE_TITLE};
    font-weight: 900;
    color: {Colors.HEX_DARK_GREEN};
  }}
  .card-title {{
    font-size: {HTMLTypography.CARD_TITLE};
    font-weight: 900;
    margin-bottom: 16px;
  }}
  .body-text {{
    font-size: {HTMLTypography.BODY_PRIMARY};
    line-height: 1.65;
    color: {Colors.HEX_TEXT_MAIN};
  }}
  .agenda-table th {{
    font-size: {HTMLTypography.TABLE_HEADER};
    font-weight: 800;
    padding: 16px 20px;
  }}
  .agenda-table td {{
    font-size: {HTMLTypography.TABLE_CELL};
    line-height: 1.55;
    padding: 16px 20px;
  }}
"""
