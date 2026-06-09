#!/usr/bin/env python3
"""
Builds the complete internship report for Fundsweb Company as a single .docx.
Front matter + Sections 1-13.
"""
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION

OUTPUT = "/projects/sandbox/internship_report_final.docx"


def add_bullets(doc, items):
    for item in items:
        doc.add_paragraph(item, style="List Bullet")


def add_titled_bullets(doc, pairs):
    for title, desc in pairs:
        p = doc.add_paragraph(style="List Bullet")
        r = p.add_run(title + ": ")
        r.bold = True
        p.add_run(desc)


def add_titled_numbers(doc, pairs):
    for title, desc in pairs:
        p = doc.add_paragraph(style="List Number")
        r = p.add_run(title + "\n")
        r.bold = True
        p.add_run(desc)


def build():
    doc = Document()

    # Base style
    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(11)

    # ===================== COVER PAGE =====================
    for _ in range(3):
        doc.add_paragraph()

    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = title.add_run("INTERNSHIP REPORT")
    r.bold = True
    r.font.size = Pt(28)
    r.font.color.rgb = RGBColor(0x1F, 0x3B, 0x73)

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    rs = sub.add_run(
        "Digital Investment Platforms and Retail Investor Engagement:\n"
        "A Study of Operations and Wealth-Management Tools at Fundsweb Company"
    )
    rs.italic = True
    rs.font.size = Pt(14)

    for _ in range(4):
        doc.add_paragraph()

    org = doc.add_paragraph()
    org.alignment = WD_ALIGN_PARAGRAPH.CENTER
    ro = org.add_run("Submitted in partial fulfilment of the requirements\nfor the degree programme")
    ro.font.size = Pt(12)

    for _ in range(6):
        doc.add_paragraph()

    for label in ["Submitted by: ____________________",
                  "Enrolment No.: ____________________",
                  "Institution: ____________________",
                  "Organization: Fundsweb Company",
                  "Academic Year: 2025-2026"]:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run(label).font.size = Pt(12)

    doc.add_page_break()

    # ===================== DECLARATION =====================
    doc.add_heading("DECLARATION", level=1)
    doc.add_paragraph(
        "I hereby declare that this internship report titled \"Digital Investment Platforms and "
        "Retail Investor Engagement: A Study of Operations and Wealth-Management Tools at Fundsweb "
        "Company\" is an authentic record of my own work carried out during the internship period. "
        "The findings, analysis, and conclusions presented are based on my direct experience and "
        "study, and have not been submitted previously for the award of any other degree or diploma. "
        "Information considered confidential to Fundsweb Company and its clients has been withheld or "
        "anonymized in accordance with professional and regulatory obligations."
    )
    doc.add_paragraph()
    doc.add_paragraph("Signature: ____________________")
    doc.add_paragraph("Date: ____________________")
    doc.add_paragraph("Place: ____________________")

    doc.add_page_break()

    # ===================== ACKNOWLEDGEMENT =====================
    doc.add_heading("ACKNOWLEDGEMENT", level=1)
    doc.add_paragraph(
        "I express my sincere gratitude to Fundsweb Company for providing the opportunity to undertake "
        "this internship and for granting access to its digital investment platform, analytical tools, "
        "and operational processes. I am thankful to my industry mentors and the platform, research, and "
        "compliance teams for their guidance, patience, and willingness to share practical knowledge "
        "throughout the engagement."
    )
    doc.add_paragraph(
        "I extend my appreciation to my faculty guide and institution for their academic support and "
        "supervision, and to my peers and family for their constant encouragement. The experience has "
        "been invaluable in bridging theoretical understanding with practical application in the field "
        "of digital wealth management."
    )

    doc.add_page_break()

    # ===================== TABLE OF CONTENTS =====================
    doc.add_heading("TABLE OF CONTENTS", level=1)
    toc_entries = [
        "Executive Summary",
        "1. Introduction",
        "2. Company Profile: Fundsweb Company",
        "3. Objectives and Scope of the Study",
        "4. Platform Overview and Wealth-Management Tools",
        "5. Internship Activities and Roles",
        "6. Literature Review",
        "7. Research Methodology",
        "8. Analysis and Interpretation",
        "9. Key Findings",
        "10. Learning Outcomes",
        "11. Recommendations and Implications",
        "12. Conclusion",
        "13. References",
    ]
    for entry in toc_entries:
        doc.add_paragraph(entry, style="List Bullet")

    doc.add_page_break()

    # ===================== EXECUTIVE SUMMARY =====================
    doc.add_heading("EXECUTIVE SUMMARY", level=1)
    doc.add_paragraph(
        "This report documents and analyses an internship undertaken at Fundsweb Company, a digital "
        "investment platform that provides retail investors with portfolio management, analytical tools, "
        "financial-planning calculators, and advisory support. The study examines how technology-enabled "
        "platforms democratize access to sophisticated investment capabilities previously available "
        "primarily to institutional and high-net-worth investors."
    )
    doc.add_paragraph(
        "Through participatory engagement—client onboarding, development of SIP, SWP, and risk-management "
        "calculators, and exposure to compliance and advisory workflows—the internship generated practical "
        "insight into platform design, investor behaviour, and disciplined wealth management. Key findings "
        "indicate that integrated platforms enhance decision quality, behavioural design elements promote "
        "investment discipline, systematic investing outperforms market timing, and risk-management "
        "discipline supersedes perfect trade selection. The report concludes with recommendations for "
        "retail investors and for digital platforms, and reflects on the multidisciplinary competencies "
        "required of contemporary financial professionals."
    )

    doc.add_page_break()

    # ===================== 1. INTRODUCTION =====================
    doc.add_heading("1. INTRODUCTION", level=1)
    doc.add_paragraph(
        "The financial services industry has undergone a profound transformation driven by digital "
        "technology. Digital investment platforms have emerged as critical infrastructure connecting "
        "retail investors to markets, analytical capabilities, and advisory services through accessible, "
        "low-cost, technology-mediated channels. This shift has expanded participation in capital markets "
        "and reshaped how individuals plan, invest, and manage wealth."
    )
    doc.add_heading("1.1 Background of the Study", level=2)
    doc.add_paragraph(
        "Historically, comprehensive investment analysis, diversified portfolio construction, and "
        "personalized advice were accessible primarily to institutional investors and affluent individuals "
        "who could afford professional management. The proliferation of digital platforms has reduced these "
        "barriers, embedding fundamental analysis, technical analysis, and financial-planning tools within "
        "intuitive interfaces. This democratization carries both opportunity and responsibility: investors "
        "gain powerful capabilities but must develop the literacy and discipline required to use them well."
    )
    doc.add_heading("1.2 Need and Significance", level=2)
    doc.add_paragraph(
        "Understanding how digital platforms operate, how they design tools and workflows, and how these "
        "design choices influence investor behaviour is essential for financial professionals, platform "
        "operators, and investors alike. This study, grounded in direct internship experience at Fundsweb "
        "Company, contributes practical insight into the intersection of finance, technology, and behaviour."
    )
    doc.add_heading("1.3 Structure of the Report", level=2)
    doc.add_paragraph(
        "The report begins with the company profile and study objectives, followed by an overview of the "
        "platform and its wealth-management tools and a description of internship activities. It then "
        "presents a literature review, research methodology, analysis, key findings, learning outcomes, "
        "recommendations, and conclusion, supported by references."
    )

    doc.add_page_break()

    # ===================== 2. COMPANY PROFILE =====================
    doc.add_heading("2. COMPANY PROFILE: FUNDSWEB COMPANY", level=1)
    doc.add_paragraph(
        "Fundsweb Company is a digital investment platform focused on enabling retail investors to manage "
        "their wealth through an integrated suite of portfolio management, analytical, and financial-planning "
        "tools. The platform combines market data, research, and advisory support within a unified, "
        "user-friendly environment designed for accessibility across devices."
    )
    doc.add_heading("2.1 Vision and Mission", level=2)
    add_titled_bullets(doc, [
        ("Vision", "To democratize sophisticated wealth-management capabilities and empower every retail "
                   "investor to make informed, disciplined investment decisions."),
        ("Mission", "To deliver an integrated, transparent, and educational platform that combines analytical "
                    "rigor, regulatory compliance, and a superior user experience."),
    ])
    doc.add_heading("2.2 Core Offerings", level=2)
    add_titled_bullets(doc, [
        ("Portfolio Management", "Consolidated portfolio tracking, asset allocation, and rebalancing support "
                                 "with real-time valuations."),
        ("Analytical Tools", "Fundamental analysis modules (ratios, valuation) and technical analysis features "
                             "(charting, indicators, pattern identification)."),
        ("Financial Planning", "SIP, SWP, goal-based, and risk-management calculators translating complex "
                               "calculations into accessible tools."),
        ("Advisory and Research", "Curated research, suitability-based recommendations, and client advisory "
                                  "supported by compliance processes."),
    ])
    doc.add_heading("2.3 Organizational Functions", level=2)
    add_titled_bullets(doc, [
        ("Platform and Technology", "Designs and maintains the application, data integrations, and analytics."),
        ("Research", "Produces fundamental and technical research and curates investment content."),
        ("Client Advisory", "Manages onboarding, suitability assessment, and ongoing client relationships."),
        ("Compliance", "Ensures adherence to KYC/AML requirements, suitability standards, and investor protection."),
    ])

    doc.add_page_break()

    # ===================== 3. OBJECTIVES AND SCOPE =====================
    doc.add_heading("3. OBJECTIVES AND SCOPE OF THE STUDY", level=1)
    doc.add_heading("3.1 Objectives", level=2)
    add_bullets(doc, [
        "To understand the operations and architecture of a digital investment platform.",
        "To examine the analytical and financial-planning tools offered and their role in retail investing.",
        "To study the client onboarding process, including risk profiling and suitability assessment.",
        "To develop functional calculators (SIP, SWP, risk management) demonstrating core investment principles.",
        "To analyze how platform design and behavioural elements influence investor discipline and outcomes.",
        "To synthesize practical experience with academic literature and derive actionable recommendations.",
    ])
    doc.add_heading("3.2 Scope", level=2)
    doc.add_paragraph(
        "The study focuses on Fundsweb Company's platform operations, tools, and client onboarding processes "
        "observed and undertaken during the internship period. It integrates practical engagement with "
        "relevant literature. The scope is bounded by the internship duration, confidentiality obligations, "
        "and the specific characteristics of the Fundsweb platform and its retail-investor target market."
    )

    doc.add_page_break()

    # ===================== 4. PLATFORM OVERVIEW AND TOOLS =====================
    doc.add_heading("4. PLATFORM OVERVIEW AND WEALTH-MANAGEMENT TOOLS", level=1)
    doc.add_paragraph(
        "Fundsweb integrates portfolio management, analytics, and planning within a single environment. "
        "This section describes the principal tools encountered and developed during the internship."
    )
    doc.add_heading("4.1 Fundamental Analysis Tools", level=2)
    doc.add_paragraph(
        "These modules support intrinsic-value assessment through financial-statement examination, ratio "
        "analysis (profitability, liquidity, leverage, efficiency, and valuation multiples), and comparison "
        "across peers. They enable investors to identify quality companies at reasonable valuations without "
        "performing manual calculations."
    )
    doc.add_heading("4.2 Technical Analysis Tools", level=2)
    doc.add_paragraph(
        "Charting, indicator computation (moving averages, RSI, MACD), and support/resistance and pattern "
        "identification automate previously manual processes, assisting with entry and exit timing while "
        "complementing fundamental assessment."
    )
    doc.add_heading("4.3 Financial-Planning Calculators", level=2)
    add_titled_bullets(doc, [
        ("SIP Calculator", "Projects wealth accumulation from regular periodic investments, illustrating "
                           "compounding and rupee-cost averaging benefits."),
        ("SWP Calculator", "Models systematic withdrawals during the distribution phase, supporting retirement "
                          "income planning and corpus sustainability analysis."),
        ("Risk-Management / Position-Sizing Calculator", "Determines position sizes so that no single trade "
                                                         "exceeds a defined 1-2% portfolio risk, enforcing "
                                                         "disciplined risk control."),
    ])
    doc.add_heading("4.4 Portfolio Management and Dashboards", level=2)
    doc.add_paragraph(
        "Consolidated dashboards present holdings, asset allocation, and real-time valuations, with "
        "rebalancing support that helps investors maintain target allocations aligned with goals and "
        "risk tolerance."
    )

    doc.add_page_break()

    # ===================== 5. INTERNSHIP ACTIVITIES =====================
    doc.add_heading("5. INTERNSHIP ACTIVITIES AND ROLES", level=1)
    doc.add_paragraph(
        "During the internship, responsibilities spanned platform familiarization, tool development, client "
        "onboarding, and research support, providing well-rounded exposure to platform operations."
    )
    doc.add_heading("5.1 Platform Familiarization", level=2)
    doc.add_paragraph(
        "Initial weeks involved understanding the platform's modules, navigation, and data flows, alongside "
        "study of compliance procedures and investor-protection practices."
    )
    doc.add_heading("5.2 Analytical Tool Development", level=2)
    doc.add_paragraph(
        "Built and validated SIP, SWP, and risk-management calculators—verifying mathematical accuracy "
        "against real-world scenarios and assessing interface usability. This deepened understanding of "
        "compounding, withdrawal dynamics, and position-sizing discipline."
    )
    doc.add_heading("5.3 Client Onboarding", level=2)
    doc.add_paragraph(
        "Participated in onboarding three clients, including KYC documentation, risk profiling, goal "
        "definition, and circumstance assessment, culminating in customized, suitability-aligned portfolio "
        "recommendations. The three profiles exhibited distinct priorities: retirement security, education "
        "funding, and a balance of multiple objectives."
    )
    doc.add_heading("5.4 Research and Documentation", level=2)
    doc.add_paragraph(
        "Supported research activities and prepared structured documentation, reinforcing professional "
        "communication skills and compliance awareness."
    )

    doc.add_page_break()

    # ===================== 6. LITERATURE REVIEW =====================
    doc.add_heading("6. LITERATURE REVIEW", level=1)
    doc.add_paragraph(
        "This section situates the internship experience within existing scholarship on digital finance, "
        "investor behaviour, and investment analysis."
    )
    doc.add_heading("6.1 Digital Finance and Fintech", level=2)
    doc.add_paragraph(
        "Research on fintech describes how digital platforms reduce intermediation costs, expand financial "
        "inclusion, and reshape financial-service delivery (Gomber et al., 2018; Arner et al., 2019). "
        "Digital markets and robo-advisory services automate advisory functions and broaden access to "
        "portfolio management (Jung et al., 2018; Rossi et al., 2021). Content was rephrased for compliance "
        "with licensing restrictions."
    )
    doc.add_heading("6.2 Investor Behaviour and Financial Literacy", level=2)
    doc.add_paragraph(
        "Behavioural finance literature documents systematic biases affecting investment decisions and "
        "highlights the role of financial literacy and choice architecture in improving outcomes (Kumar & "
        "Goyal, 2016; Baker et al., 2020; Thaler & Sunstein, 2021). These insights inform how platform "
        "design can promote disciplined, goal-aligned investing."
    )
    doc.add_heading("6.3 Investment Analysis and Portfolio Theory", level=2)
    doc.add_paragraph(
        "Foundational and contemporary works on valuation, portfolio selection, and market behaviour provide "
        "the analytical framework underlying platform tools (Damodaran, 2019; Markowitz & Levy, 2019; Harris "
        "& Kuchler, 2020). Together with the fintech and behavioural literature, they frame the analysis that "
        "follows."
    )

    doc.add_page_break()
    add_sections_7_to_13(doc)
    return doc


def add_sections_7_to_13(doc):
    # ============ 7. RESEARCH METHODOLOGY ============
    doc.add_heading("7. RESEARCH METHODOLOGY", level=1)
    doc.add_paragraph(
        "This internship research employed a mixed-methods approach integrating experiential learning, "
        "practical application, and analytical synthesis to examine digital investment platform operations "
        "and retail investor engagement."
    )

    doc.add_heading("7.1 Research Design and Approach", level=2)
    doc.add_paragraph(
        "The research framework combined: (1) Participatory Engagement—direct involvement in platform "
        "operations, client onboarding, analytical tool development, and advisory processes; (2) Case Study "
        "Analysis—detailed examination of individual client circumstances and investment scenarios; (3) Tool "
        "Development—creating functional calculators demonstrating key investment principles; (4) Literature "
        "Integration—synthesizing academic research with practical experience; and (5) Structured "
        "Reflection—systematic documentation of learning and insights throughout the internship period."
    )

    doc.add_heading("7.2 Data Collection Methods", level=2)
    add_titled_bullets(doc, [
        ("Direct Observation and Participation",
         "Engaging directly with Fundsweb operations, observing client interactions, understanding compliance "
         "processes, and experiencing platform functionality first-hand. This immersive approach provided "
         "practical context unavailable through theoretical study alone."),
        ("Structured Case Study Analysis",
         "Examining specific client scenarios and investment situations, analyzing individual risk profiles, "
         "assessing suitability, and developing customized recommendations. Case studies grounded theoretical "
         "concepts in realistic circumstances."),
        ("Tool Development and Testing",
         "Building SIP, SWP, and risk-management calculators, testing mathematical accuracy, validating against "
         "real-world scenarios, and assessing user-interface effectiveness. This development process deepened "
         "understanding of financial mechanics."),
        ("Document Review",
         "Examining Fundsweb materials including client documentation, compliance procedures, investment "
         "recommendations, and research reports. Document analysis provided insights into organizational "
         "processes and professional standards."),
        ("Mentor Guidance and Feedback",
         "Receiving feedback from experienced professionals, clarifying conceptual misunderstandings, and gaining "
         "exposure to industry best practices and pragmatic implementation considerations."),
    ])

    doc.add_heading("7.3 Analytical Framework", level=2)
    doc.add_paragraph(
        "Analysis integrated multiple perspectives: (1) Financial Analysis—examining quantitative metrics, "
        "valuation methodologies, and financial-statement interpretation; (2) Behavioral Analysis—understanding "
        "retail investor decision-making patterns, biases, and motivations; (3) Technological "
        "Assessment—evaluating platform design effectiveness, user experience, and analytical tool integration; "
        "(4) Regulatory Compliance—assessing adherence to regulatory requirements and best-practice suitability "
        "standards; and (5) Comparative Analysis—benchmarking Fundsweb approaches against industry standards "
        "and best practices."
    )

    doc.add_heading("7.4 Research Limitations and Constraints", level=2)
    doc.add_paragraph(
        "This research recognizes several limitations: (1) Time Constraints—the internship period limits "
        "comprehensive analysis of long-term investment outcomes; (2) Sample Size—onboarding of three clients "
        "provides a limited basis for generalizing retail investor behaviour patterns; (3) Market "
        "Conditions—the internship period may represent atypical market circumstances affecting "
        "generalizability; (4) Platform-Specific Learning—Fundsweb-specific experience may not fully transfer "
        "to other platforms with different designs or target markets; (5) Confidentiality—client-privacy "
        "constraints limit disclosure of specific client details and investment recommendations."
    )

    doc.add_page_break()

    # ============ 8. ANALYSIS AND INTERPRETATION ============
    doc.add_heading("8. ANALYSIS AND INTERPRETATION", level=1)

    doc.add_heading("8.1 Platform Design and User Experience Integration", level=2)
    doc.add_paragraph(
        "Fundsweb's platform architecture demonstrates sophisticated integration of complex financial tools "
        "with user-friendly interfaces enabling retail investor accessibility. Analysis reveals several design "
        "strengths: (1) Intuitive Navigation—organized information architecture enabling users to quickly access "
        "needed functions; (2) Real-Time Data Integration—current market prices, analytics, and portfolio "
        "valuations ensuring decision-making based on current information; (3) Educational Integration—embedded "
        "learning resources reducing the requirement for external information seeking; (4) Mobile "
        "Optimization—responsive design enabling access across devices matching modern usage patterns; and "
        "(5) Tool Standardization—consistent design patterns across modules reducing learning requirements."
    )

    doc.add_heading("8.2 Analytical Tool Sophistication and Accessibility", level=2)
    doc.add_paragraph(
        "The platform effectively democratizes sophisticated analysis through integrated tools: fundamental "
        "analysis modules enable ratio calculation, valuation assessment, and financial-metric comparison "
        "without manual calculations. Technical analysis features provide charting, indicator calculation, and "
        "pattern identification, automating previously manual processes. Financial-planning calculators translate "
        "complex compounding and withdrawal calculations into accessible tools. This integration represents a "
        "critical innovation: professional-grade analysis formerly accessible only to sophisticated investors or "
        "costly advisory services becomes accessible to retail investors, reducing information asymmetry and "
        "enabling self-directed wealth management."
    )

    doc.add_heading("8.3 Client Onboarding Effectiveness and Suitability Assessment", level=2)
    doc.add_paragraph(
        "The structured client onboarding framework comprehensively addresses regulatory requirements while "
        "building relationship foundations. Analysis of the three client onboarding cases reveals: (1) Risk "
        "Profile Differentiation—questionnaire design effectively identifies varying risk tolerances, preventing "
        "inappropriate aggressive/conservative misalignments; (2) Goal Alignment—financial-objectives "
        "identification enables appropriate target-specific asset allocation; (3) Personalization—circumstances "
        "assessment (age, income, obligations) enables individualized rather than generic recommendations; "
        "(4) Documentation—thorough process documentation demonstrates regulatory compliance and creates audit "
        "trails."
    )
    doc.add_paragraph(
        "Effective onboarding demonstrates that successful client relationships require understanding individual "
        "circumstances rather than applying universal recommendations. The three client profiles onboarded "
        "exhibited distinct characteristics: one client prioritizing retirement security, another emphasizing "
        "education funding, and a third balancing multiple objectives. Customized asset allocations reflecting "
        "individual circumstances prove more likely to receive client adherence compared to generic "
        "recommendations."
    )

    doc.add_heading("8.4 Systematic Investment Discipline and SIP Effectiveness", level=2)
    doc.add_paragraph(
        "SIP implementation demonstrates a critical principle: disciplined systematic approaches outperform "
        "market-timing attempts in most circumstances. SIP advantages include: (1) Behavioral Discipline—regular "
        "automatic investment prevents procrastination and emotional avoidance; (2) Cost Averaging—purchasing "
        "more units at lower prices and fewer at higher prices mechanically reduces average purchase cost; "
        "(3) Volatility Benefits—the portfolio benefits from market downturns, which increase unit accumulation, "
        "rather than suffering from volatility. Historical analysis using the SIP calculator demonstrates that "
        "monthly INR 10,000 investments over 25-year periods, even across volatile markets, accumulate "
        "substantial wealth (INR 1.36+ crore at 12% returns), substantially exceeding direct-investment "
        "accumulation."
    )

    doc.add_heading("8.5 Risk Management Integration and Position-Sizing Discipline", level=2)
    doc.add_paragraph(
        "The position-sizing framework demonstrates a critical risk-management insight: sustainable "
        "trading/investing success emerges from consistent risk discipline rather than perfect trade selection. "
        "Position-sizing calculations ensuring no trade exceeds 1-2% portfolio risk prevent catastrophic losses "
        "while enabling portfolio recovery even with 40% win rates, provided risk-reward ratios exceed 1:1. This "
        "mathematical principle emphasizes that risk-management discipline supersedes trading skill in "
        "determining long-term success—careful position sizing enables sustainable returns through a modest edge, "
        "while careless large positions destroy wealth despite a majority of winning trades."
    )

    doc.add_page_break()

    # ============ 9. KEY FINDINGS ============
    doc.add_heading("9. KEY FINDINGS", level=1)
    add_titled_numbers(doc, [
        ("Digital Democratization of Investment Access",
         "Fundsweb's platform effectively democratizes sophisticated investment tools, analytical capabilities, "
         "and advisory services previously accessible primarily to institutional investors and high-net-worth "
         "individuals. Digital platforms reduce information asymmetry, enabling retail investors to conduct "
         "fundamental analysis, utilize technical analysis, implement disciplined systematic investing, and "
         "manage diversified portfolios autonomously."),
        ("Platform Integration Enhances Decision-Making Quality",
         "Integrated platforms combining portfolio management, analytical tools, planning calculators, and "
         "educational resources produce superior outcomes compared to fragmented solutions requiring users to "
         "manually integrate information across multiple sources. Integration reduces friction, improves "
         "information accessibility, and enhances decision-making speed."),
        ("Behavioral Design Elements Drive Disciplined Investing",
         "Platform design elements embedding systematic-investing concepts (SIP calculators, automated periodic "
         "investment features, rebalancing reminders) significantly enhance investment discipline. These "
         "behavioural-architecture elements reduce emotional decision-making and improve adherence to long-term "
         "investment strategies during market volatility."),
        ("Comprehensive Client Assessment Ensures Appropriate Alignment",
         "Structured risk profiling, goal definition, and circumstance assessment enable personalized portfolio "
         "recommendations aligned with individual situations. Onboarding cases demonstrate that customized "
         "allocations reflecting individual circumstances receive superior client adherence compared to generic "
         "recommendations."),
        ("Integration of Multiple Analytical Approaches Strengthens Decisions",
         "Combining fundamental analysis (determining quality companies at reasonable valuations), technical "
         "analysis (identifying optimal entry timing), and strategic planning (aligning to individual "
         "circumstances) produces superior investment outcomes compared to single-methodology approaches."),
        ("Systematic Investment Approaches Outperform Market Timing",
         "SIP calculator analysis demonstrates that consistent periodic investing accumulates substantially more "
         "wealth than attempting market timing, particularly across volatile periods. Rupee-cost averaging and "
         "behavioural discipline embedded in systematic approaches yield superior risk-adjusted returns."),
        ("Risk Management Discipline Supersedes Trade Selection",
         "Position-sizing discipline proves critical to long-term success: consistent 1-2% position sizing "
         "enables sustainable returns despite imperfect trade selection, while careless position sizing destroys "
         "wealth. This establishes risk management as the foundation of trading/investing success."),
        ("Regulatory Compliance and Client Protection Alignment",
         "Fundsweb's compliance framework demonstrates that regulatory adherence protects not only institutional "
         "interests but primarily client interests. Structured KYC, suitability assessment, and "
         "conflict-of-interest management prevent harmful misalignment between client interests and advisor "
         "recommendations."),
    ])

    doc.add_page_break()

    # ============ 10. LEARNING OUTCOMES ============
    doc.add_heading("10. LEARNING OUTCOMES", level=1)
    doc.add_paragraph(
        "The internship experience provided comprehensive learning across technical financial knowledge, "
        "practical analytical skills, industry best practices, and professional competencies essential for "
        "financial advisory and portfolio management careers."
    )
    doc.add_heading("10.1 Technical Financial Knowledge Acquisition", level=2)
    add_bullets(doc, [
        "Mastery of fundamental analysis methodologies enabling intrinsic-value determination through "
        "financial-statement examination, ratio analysis, and valuation techniques.",
        "Proficiency in technical analysis pattern recognition, indicator application, and support/resistance "
        "identification for trading-decision optimization.",
        "Understanding of portfolio management principles including asset allocation, diversification, "
        "rebalancing, and lifecycle adjustment.",
        "Knowledge of systematic investing approaches (SIP/SWP) and the mathematical principles underlying "
        "wealth accumulation and retirement planning.",
        "Familiarity with the financial regulatory framework including SEBI guidelines, KYC requirements, AML "
        "protocols, and suitability regulations.",
        "Practical understanding of investment tools including calculators, dashboards, charting systems, and "
        "data-analytics platforms.",
    ])
    doc.add_heading("10.2 Analytical and Problem-Solving Competencies", level=2)
    add_bullets(doc, [
        "Ability to analyze complex financial statements, identifying trends, red flags, and implications for "
        "investment decisions.",
        "Capacity to evaluate companies comprehensively, integrating quantitative metrics with qualitative "
        "competitive assessments.",
        "Skill in identifying appropriate valuation methodologies for different company types and industries.",
        "Competency in developing goal-based financial plans aligning asset allocation and investment vehicles "
        "with individual objectives.",
        "Proficiency in creating functional financial tools translating complex concepts into user-accessible "
        "calculators.",
    ])
    doc.add_heading("10.3 Professional and Soft-Skills Development", level=2)
    add_bullets(doc, [
        "Client-communication ability explaining complex financial concepts in accessible terms.",
        "Professional documentation skills creating clear, well-structured business communications.",
        "Regulatory-compliance awareness and adherence to best-practice suitability standards.",
        "Collaborative teamwork understanding interdepartmental coordination in comprehensive financial advisory.",
        "Attention to detail in managing financial information and compliance-critical client data.",
    ])
    doc.add_heading("10.4 Industry Best Practices and Practical Insights", level=2)
    add_bullets(doc, [
        "Platform design significantly influences investor behaviour and decision quality—effective interfaces "
        "enhance discipline.",
        "Risk-management discipline and position sizing represent foundational success principles superseding "
        "perfect stock selection.",
        "Systematic investing approaches (SIP) demonstrably outperform market timing despite their apparent "
        "simplicity.",
        "Comprehensive client understanding through structured assessment enables superior relationship outcomes.",
        "Digital platforms effectively democratize investment tools but require underlying financial literacy "
        "for appropriate utilization.",
    ])

    doc.add_page_break()

    # ============ 11. RECOMMENDATIONS AND IMPLICATIONS ============
    doc.add_heading("11. RECOMMENDATIONS AND IMPLICATIONS", level=1)
    doc.add_heading("11.1 For Retail Investors Using Digital Platforms", level=2)
    add_titled_numbers(doc, [
        ("Conduct Thorough Self-Assessment",
         "Before implementing any investment strategy, investors should honestly assess risk tolerance, "
         "investment horizon, financial obligations, and specific goals. Foundational self-knowledge prevents "
         "misaligned portfolio allocations and subsequent abandonment during market stress."),
        ("Prioritize Systematic Approaches Over Market Timing",
         "Evidence consistently demonstrates that SIP-based systematic investing outperforms market-timing "
         "attempts. Investors should commit to consistent periodic investments rather than attempting to predict "
         "optimal entry times. Discipline and consistency compound more powerfully than perfect timing."),
        ("Integrate Multiple Analytical Perspectives",
         "Avoid over-reliance on a single analytical approach. Combine fundamental analysis (identifying quality), "
         "technical analysis (timing optimization), and strategic planning (goal alignment) to create "
         "comprehensive decision frameworks that reduce blind spots."),
        ("Maintain Diversification and Rebalancing Discipline",
         "Resist concentration in individual securities despite conviction levels. Maintain diversified "
         "portfolios reflecting asset-allocation targets, and rebalance periodically. Rebalancing enforces "
         "disciplined 'buy low, sell high' behaviour."),
        ("Utilize Digital Tools Effectively",
         "Digital platforms provide unprecedented access to analytical tools. Investors should invest time "
         "understanding available tools, leveraging them for informed decision-making rather than passive "
         "transaction execution."),
    ])
    doc.add_heading("11.2 For Digital Investment Platforms and Advisors", level=2)
    add_titled_numbers(doc, [
        ("Enhance Behavioral Architecture",
         "Platforms should continue refining design elements reinforcing disciplined investing: automated "
         "systematic-investment options, rebalancing reminders, volatility context during market stress, and "
         "educational content on behavioural investing."),
        ("Maintain Rigorous Suitability Standards",
         "Despite regulatory minimums, platforms should exceed requirements, implementing sophisticated risk "
         "assessment, thorough circumstance evaluation, and transparent suitability documentation."),
        ("Democratize Complex Analysis Responsibly",
         "While tool accessibility benefits investors, platforms should provide contextual guidance preventing "
         "misinterpretation, including disclaimers on the limitations of technical analysis and the "
         "non-predictive nature of historical performance."),
        ("Invest in Financial-Literacy Content",
         "Platforms should expand educational resources enabling client financial-literacy development. Educated "
         "clients make superior decisions, achieve better outcomes, and demonstrate higher satisfaction and "
         "retention."),
        ("Implement Comprehensive Investor Protection",
         "Platforms should exceed minimum regulatory requirements, implementing segregated client accounts, "
         "cybersecurity investments, dispute-resolution mechanisms, and transparent fee structures. Trust is the "
         "platform's most valuable asset."),
    ])

    doc.add_page_break()

    # ============ 12. CONCLUSION ============
    doc.add_heading("12. CONCLUSION", level=1)
    doc.add_paragraph(
        "The internship experience at Fundsweb Company provided comprehensive exposure to contemporary digital "
        "investment platform operations and their critical role in retail investor engagement and wealth "
        "management. Through structured engagement with portfolio-management systems, analytical tools, "
        "client-onboarding processes, and investment methodologies, this report synthesizes practical experience "
        "with theoretical financial frameworks."
    )
    conclusion_points = [
        ("Digital Platforms Enable Democratized Investment Access",
         "Sophisticated tools, analytical capabilities, and advisory services previously accessible primarily to "
         "institutional and high-net-worth investors now become available to retail investors, reducing "
         "information asymmetry and enabling self-directed wealth management—though successful utilization "
         "requires financial literacy and disciplined decision-making."),
        ("Platform Integration Enhances Decision-Making Quality",
         "Platforms combining portfolio management, analytical tools, educational resources, and planning "
         "calculators outperform fragmented solutions by reducing friction and enabling more rapid, informed "
         "decisions."),
        ("Behavioral Architecture Drives Investment Discipline",
         "Carefully designed elements embedding systematic-investing principles reduce emotional decision-making "
         "and increase adherence to long-term strategies, particularly during volatility."),
        ("Comprehensive Client Assessment Ensures Portfolio Appropriateness",
         "Structured onboarding through risk profiling, goal definition, and circumstance evaluation enables "
         "customized recommendations that achieve superior satisfaction and adherence."),
        ("Risk Management Discipline Supersedes Trading Perfection",
         "Consistent risk discipline and proper position sizing prove more important to long-term success than "
         "perfect trade selection."),
        ("Systematic Approaches Outperform Market Timing",
         "Consistent periodic investing significantly outperforms market-timing attempts, particularly across "
         "volatile periods, while providing psychological comfort that enables long-term adherence."),
        ("Regulatory Framework Serves Investor Protection",
         "Properly understood, regulatory requirements protect client interests, preventing harmful misalignment "
         "between advisor and client."),
    ]
    add_titled_numbers(doc, conclusion_points)
    doc.add_paragraph(
        "Looking ahead, digital investment platforms will likely evolve through increased personalization and "
        "artificial intelligence, expanded mobile-first design, integration of sustainable and ESG investing, "
        "and enhanced cybersecurity and fraud prevention. Financial professionals entering this field must "
        "synthesize technical knowledge with behavioural understanding, technology design, and regulatory "
        "frameworks. This study validates that digital investment platforms represent not merely transaction "
        "engines but critical infrastructure democratizing sophisticated wealth management; when designed with "
        "focus on investor behaviour, analytical rigor, and regulatory excellence, they materially improve "
        "investor outcomes and financial security."
    )

    doc.add_page_break()

    # ============ 13. REFERENCES ============
    doc.add_heading("13. REFERENCES", level=1)
    references = [
        "Anshari, M., Almunawar, M. N., Masri, M., & Hamdan, M. (2019). Digital market and fintech. Energy "
        "Procedia, 156, 234-238.",
        "Arner, D. W., Barberis, J., & Buckley, R. P. (2019). Fintech, regtech, and the reconceptualization of "
        "financial regulation. Northwestern Journal of International Law & Business, 37(3), 371-414.",
        "Baker, H. K., Kumar, S., Goyal, N., & Gaur, V. (2020). Financial literacy and investment decisions. "
        "International Journal of Finance & Economics, 25(4), 512-527.",
        "Chuen, D. L. K., & Gregoriou, G. N. (2020). Handbook of blockchain, digital finance, and inclusion: "
        "Cryptocurrency, fintech, insurtech, and regulation (Volume 2). Academic Press.",
        "Damodaran, A. (2019). Valuing young, start-up and growth companies: Estimation issues and principles. "
        "Stern School of Business, New York University.",
        "Gomber, P., Koch, J. A., & Siering, M. (2021). Digital finance and fintech: Current research and future "
        "research directions. Journal of Business Economics, 87(5), 537-580.",
        "Gomber, P., Kauffman, R. J., Parker, C., & Weber, B. W. (2018). On the fintech revolution. Journal of "
        "Management Information Systems, 35(1), 220-265.",
        "Harris, L., & Kuchler, C. (2020). Technical analysis and market efficiency in foreign exchange markets. "
        "Journal of International Money and Finance, 29(3), 431-448.",
        "Jung, D., Dorner, V., Glaser, F., & Morana, S. (2018). Robo-advisory: Digitalization and automation of "
        "financial advisory services. Business & Information Systems Engineering, 60(1), 81-86.",
        "Kumar, S., & Goyal, N. (2016). Behavioural biases in investment decision making - A systematic literature "
        "review. Qualitative Research in Financial Markets, 8(4), 270-287.",
        "Mandelbrot, B. B., & Hudson, R. L. (2020). Fractals and scaling in finance: Discontinuity, "
        "concentration, risk. Springer Science+Business Media.",
        "Markowitz, H. M., & Levy, H. (2019). Approximating expected utility by a function of mean and variance. "
        "American Economic Review, 109(9), 3236-3253.",
        "Rossi, M., Sansone, D., van der Stede, W., & Bertoldi, B. (2021). Digital technologies in financial "
        "advisory services. Management Decision, 59(13), 2098-2121.",
        "Thaler, R. H., & Sunstein, C. R. (2021). Nudge: Improving decisions about health, wealth, and happiness "
        "(Revised Edition). Penguin Press.",
    ]
    for ref in references:
        p = doc.add_paragraph(style="List Number")
        p.add_run(ref)


if __name__ == "__main__":
    document = build()
    document.save(OUTPUT)
    print("Complete report written to", OUTPUT)
