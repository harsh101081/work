#!/usr/bin/env python3
"""Render fitness-plan-harsh.md to a styled PDF using reportlab (pure-Python)."""
import re
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

FONT_DIR = "fonts/dejavu-fonts-ttf-2.37/ttf"
pdfmetrics.registerFont(TTFont("Body", f"{FONT_DIR}/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("Body-Bold", f"{FONT_DIR}/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Body-Italic", f"{FONT_DIR}/DejaVuSans-Oblique.ttf"))
pdfmetrics.registerFont(TTFont("Mono", f"{FONT_DIR}/DejaVuSansMono.ttf"))
pdfmetrics.registerFontFamily(
    "Body", normal="Body", bold="Body-Bold", italic="Body-Italic", boldItalic="Body-Bold"
)

ACCENT = colors.HexColor("#1f6f54")
HEADER_BG = colors.HexColor("#1f6f54")
ROW_ALT = colors.HexColor("#eef5f1")
GRID = colors.HexColor("#cfd8d3")
CODE_BG = colors.HexColor("#f4f4f4")

# Emoji / symbols that DejaVu can't render -> readable replacements
EMOJI_MAP = {
    "\U0001f4e5": "", "\U0001f440": "", "\U0001f4aa": "", "\U0001fae1": "",
    "\u2b50": "(*)", "\u2705": "[YES]", "\u274c": "[NO]",
    "\U0001f389": "", "\U0001f600": "",
}


def strip_emoji(text):
    for k, v in EMOJI_MAP.items():
        text = text.replace(k, v)
    # remove any remaining astral-plane emoji
    return re.sub(r"[\U0001F000-\U0001FAFF\U00002600-\U000027BF]", "", text)


def inline(text):
    """Convert markdown inline formatting to reportlab mini-HTML, escaping XML."""
    text = strip_emoji(text)
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # inline code
    text = re.sub(r"`([^`]+)`",
                  r'<font face="Mono" size=8.5 backColor="#f0f0f0">\1</font>', text)
    # bold then italic
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    # markdown links [t](u) -> t (u)
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)",
                  r'<link href="\2" color="#1f6f54">\1</link>', text)
    return text


styles = getSampleStyleSheet()
P = ParagraphStyle("body", parent=styles["Normal"], fontName="Body", fontSize=9.5,
                   leading=13.5, alignment=TA_LEFT, spaceAfter=5)
H1 = ParagraphStyle("h1", fontName="Body-Bold", fontSize=19, leading=23,
                    textColor=ACCENT, spaceBefore=10, spaceAfter=8)
H2 = ParagraphStyle("h2", fontName="Body-Bold", fontSize=14.5, leading=18,
                    textColor=ACCENT, spaceBefore=12, spaceAfter=6)
H3 = ParagraphStyle("h3", fontName="Body-Bold", fontSize=11.5, leading=15,
                    textColor=colors.HexColor("#114"), spaceBefore=9, spaceAfter=4)
H4 = ParagraphStyle("h4", fontName="Body-Bold", fontSize=10, leading=13,
                    textColor=colors.HexColor("#333"), spaceBefore=6, spaceAfter=3)
QUOTE = ParagraphStyle("quote", parent=P, fontName="Body-Italic", fontSize=9,
                       leftIndent=8, textColor=colors.HexColor("#555"),
                       borderColor=ACCENT, borderWidth=0, spaceAfter=5)
CELL = ParagraphStyle("cell", fontName="Body", fontSize=8.2, leading=10.5)
CELL_H = ParagraphStyle("cellh", fontName="Body-Bold", fontSize=8.4, leading=10.5,
                        textColor=colors.white)
CODE = ParagraphStyle("code", fontName="Mono", fontSize=8, leading=11,
                      backColor=CODE_BG, borderPadding=6, spaceAfter=6)

PAGE_W = A4[0] - 32 * mm  # usable width


def make_table(header, rows):
    ncol = len(header)
    data = [[Paragraph(inline(c), CELL_H) for c in header]]
    for r in rows:
        data.append([Paragraph(inline(c), CELL) for c in r])
    # column widths: first column a bit wider, rest even
    if ncol == 1:
        widths = [PAGE_W]
    else:
        first = PAGE_W * (0.30 if ncol <= 4 else 0.22)
        rest = (PAGE_W - first) / (ncol - 1)
        widths = [first] + [rest] * (ncol - 1)
    t = Table(data, colWidths=widths, repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
        ("GRID", (0, 0), (-1, -1), 0.5, GRID),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            style.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    t.setStyle(TableStyle(style))
    return t


def parse(md_lines):
    flow = []
    i = 0
    n = len(md_lines)
    bullets = []

    def flush_bullets():
        nonlocal bullets
        if bullets:
            items = [ListItem(Paragraph(inline(b), P), leftIndent=10) for b in bullets]
            flow.append(ListFlowable(items, bulletType="bullet", start="•",
                                     leftIndent=14, bulletColor=ACCENT))
            bullets = []

    while i < n:
        line = md_lines[i].rstrip("\n")
        stripped = line.strip()

        # fenced code block
        if stripped.startswith("```"):
            flush_bullets()
            i += 1
            buf = []
            while i < n and not md_lines[i].strip().startswith("```"):
                buf.append(md_lines[i].rstrip("\n"))
                i += 1
            i += 1
            txt = "<br/>".join(
                strip_emoji(b).replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace(" ", "&nbsp;") for b in buf
            )
            flow.append(Paragraph(txt or "&nbsp;", CODE))
            continue

        # table block
        if "|" in line and i + 1 < n and re.match(r"^\s*\|?[\s:|-]+\|?\s*$",
                                                   md_lines[i + 1]):
            flush_bullets()

            def cells(l):
                l = l.strip()
                if l.startswith("|"):
                    l = l[1:]
                if l.endswith("|"):
                    l = l[:-1]
                return [c.strip() for c in l.split("|")]

            header = cells(line)
            i += 2
            rows = []
            while i < n and "|" in md_lines[i] and md_lines[i].strip():
                rows.append(cells(md_lines[i]))
                i += 1
            ncol = len(header)
            rows = [(r + [""] * ncol)[:ncol] for r in rows]
            flow.append(Spacer(1, 3))
            flow.append(make_table(header, rows))
            flow.append(Spacer(1, 6))
            continue

        if not stripped:
            flush_bullets()
            i += 1
            continue

        if stripped.startswith("####"):
            flush_bullets(); flow.append(Paragraph(inline(stripped[4:].strip()), H4))
        elif stripped.startswith("###"):
            flush_bullets(); flow.append(Paragraph(inline(stripped[3:].strip()), H3))
        elif stripped.startswith("##"):
            flush_bullets(); flow.append(Paragraph(inline(stripped[2:].strip()), H2))
        elif stripped.startswith("#"):
            flush_bullets(); flow.append(Paragraph(inline(stripped[1:].strip()), H1))
        elif stripped in ("---", "***", "___"):
            flush_bullets()
            flow.append(Spacer(1, 4))
            flow.append(HRFlowable(width="100%", thickness=0.8, color=GRID))
            flow.append(Spacer(1, 4))
        elif stripped.startswith(">"):
            flush_bullets()
            flow.append(Paragraph(inline(stripped.lstrip(">").strip()), QUOTE))
        elif re.match(r"^[-*]\s+\[[ xX]\]\s+", stripped):
            box = "[x]" if re.match(r"^[-*]\s+\[[xX]\]", stripped) else "[  ]"
            txt = re.sub(r"^[-*]\s+\[[ xX]\]\s+", "", stripped)
            bullets.append(f"{box} {txt}")
        elif re.match(r"^[-*+]\s+", stripped):
            bullets.append(re.sub(r"^[-*+]\s+", "", stripped))
        elif re.match(r"^\d+\.\s+", stripped):
            bullets.append(re.sub(r"^\d+\.\s+", "", stripped))
        else:
            flush_bullets()
            flow.append(Paragraph(inline(stripped), P))
        i += 1

    flush_bullets()
    return flow


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "fitness-plan-harsh.md"
    out = sys.argv[2] if len(sys.argv) > 2 else "fitness-plan-harsh.pdf"
    with open(src, encoding="utf-8") as f:
        lines = f.readlines()
    doc = SimpleDocTemplate(out, pagesize=A4,
                            leftMargin=16 * mm, rightMargin=16 * mm,
                            topMargin=14 * mm, bottomMargin=14 * mm,
                            title="Harsh's Body Recomposition Plan")

    def footer(canvas, d):
        canvas.saveState()
        canvas.setFont("Body", 7.5)
        canvas.setFillColor(colors.HexColor("#888"))
        canvas.drawCentredString(A4[0] / 2, 8 * mm,
                                 f"Harsh — Body Recomposition Plan   ·   Page {d.page}")
        canvas.restoreState()

    doc.build(parse(lines), onFirstPage=footer, onLaterPages=footer)
    print("Wrote", out)


if __name__ == "__main__":
    main()
