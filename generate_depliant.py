
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph, Spacer, Table, TableStyle,
    KeepInFrame, HRFlowable
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
import os

# =====================================================
# CONFIGURATION
# =====================================================

OUTPUT = "Depliant_Hassy_Codeur.pdf"

PAGE_W, PAGE_H = landscape(A4)

BG = HexColor("#061117")
PANEL = HexColor("#0B1C24")
PANEL_ALT = HexColor("#102831")

GREEN = HexColor("#20ED86")
MINT = HexColor("#A7FFD0")
WHITE = HexColor("#F4FAF7")
GRAY = HexColor("#B5C7C3")
BORDER = HexColor("#285448")
YELLOW = HexColor("#D9FF65")

# Trois volets égaux pour un pliage accordéon
PANEL_W = PAGE_W / 3

MARGIN_X = 7 * mm
MARGIN_TOP = 12 * mm
MARGIN_BOTTOM = 11 * mm

# =====================================================
# STYLES TYPOGRAPHIQUES
# =====================================================

styles = {}

styles["eyebrow"] = ParagraphStyle(
    "eyebrow",
    fontName="Helvetica-Bold",
    fontSize=7,
    leading=9,
    textColor=GREEN,
    spaceAfter=5
)

styles["title"] = ParagraphStyle(
    "title",
    fontName="Helvetica-Bold",
    fontSize=18,
    leading=21,
    textColor=WHITE,
    spaceAfter=5
)

styles["subtitle"] = ParagraphStyle(
    "subtitle",
    fontName="Helvetica-Oblique",
    fontSize=9,
    leading=12,
    textColor=MINT,
    spaceAfter=8
)

styles["heading"] = ParagraphStyle(
    "heading",
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=11,
    textColor=GREEN,
    spaceBefore=5,
    spaceAfter=4
)

styles["body"] = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=7.2,
    leading=9.5,
    textColor=WHITE,
    spaceAfter=4
)

styles["small"] = ParagraphStyle(
    "small",
    fontName="Helvetica",
    fontSize=6.3,
    leading=8,
    textColor=GRAY,
    spaceAfter=3
)

styles["package"] = ParagraphStyle(
    "package",
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=11,
    textColor=WHITE,
    spaceAfter=3
)

styles["price"] = ParagraphStyle(
    "price",
    fontName="Helvetica-Bold",
    fontSize=13,
    leading=15,
    textColor=GREEN,
    spaceAfter=3
)

styles["bullet"] = ParagraphStyle(
    "bullet",
    fontName="Helvetica",
    fontSize=6.5,
    leading=8,
    textColor=WHITE,
    leftIndent=8,
    firstLineIndent=-7,
    spaceAfter=1.5
)

styles["signature"] = ParagraphStyle(
    "signature",
    fontName="Helvetica-BoldOblique",
    fontSize=13,
    leading=16,
    alignment=TA_CENTER,
    textColor=GREEN
)

styles["center"] = ParagraphStyle(
    "center",
    fontName="Helvetica",
    fontSize=7,
    leading=9,
    alignment=TA_CENTER,
    textColor=WHITE
)

# =====================================================
# OUTILS
# =====================================================

def P(text, style="body"):
    return Paragraph(text, styles[style])


def bullets(items):
    return [
        P("✓ " + item, "bullet")
        for item in items
    ]


def section(title):
    return P(title.upper(), "heading")


def package(name, price, description, features,
            recommended=False):

    title = name

    if recommended:
        title += ' <font color="#20ED86">★ RECOMMANDÉ</font>'

    content = [
        P(title, "package"),
        P(price, "price"),
        P(description, "small")
    ]

    content.extend(bullets(features))

    table = Table(
        [[content]],
        colWidths=[PANEL_W - 2 * MARGIN_X - 4 * mm]
    )

    table.setStyle(TableStyle([
        (
            "BACKGROUND",
            (0, 0), (-1, -1),
            PANEL_ALT if recommended else PANEL
        ),
        (
            "BOX",
            (0, 0), (-1, -1),
            1.2,
            GREEN if recommended else BORDER
        ),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))

    return table


def divider():
    return HRFlowable(
        width="100%",
        thickness=0.7,
        color=BORDER,
        spaceBefore=4,
        spaceAfter=5
    )


# =====================================================
# FOND ET IDENTITÉ VISUELLE
# =====================================================

def draw_background(c, page_number):

    c.setFillColor(BG)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Fonds alternés
    for i in range(3):
        x = i * PANEL_W

        if i % 2 == 0:
            c.setFillColor(PANEL)
            c.rect(
                x, 0, PANEL_W, PAGE_H,
                fill=1, stroke=0
            )

    # Barre néon supérieure
    c.setFillColor(GREEN)
    c.rect(
        0, PAGE_H - 2 * mm,
        PAGE_W, 2 * mm,
        fill=1, stroke=0
    )

    # Guides de pliage
    c.saveState()
    c.setStrokeColor(HexColor("#526F66"))
    c.setDash(2, 3)
    c.setLineWidth(0.5)

    for x in [PANEL_W, PANEL_W * 2]:
        c.line(x, 5 * mm, x, PAGE_H - 5 * mm)

    c.restoreState()

    # Pied de page
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 6)

    c.drawString(
        7 * mm, 4 * mm,
        "HASSY CODEUR | DEVELOPPEUR FULL-STACK"
    )

    c.drawRightString(
        PAGE_W - 7 * mm, 4 * mm,
        f"FACE {page_number}/2"
    )


def draw_panel(c, index, content):

    x = index * PANEL_W + MARGIN_X
    y = MARGIN_BOTTOM
    width = PANEL_W - 2 * MARGIN_X
    height = PAGE_H - MARGIN_TOP - MARGIN_BOTTOM

    # Petite décoration lumineuse
    c.setFillColor(GREEN)
    c.roundRect(
        x, PAGE_H - 8 * mm,
        12 * mm, 1 * mm,
        0.5 * mm,
        fill=1, stroke=0
    )

    # Contenu adaptatif
    kif = KeepInFrame(
        width,
        height,
        content,
        mode="shrink",
        hAlign="LEFT",
        vAlign="TOP"
    )

    kif.wrapOn(c, width, height)
    kif.drawOn(c, x, y)


def add_brand(content):
    content.extend([
        Spacer(1, 3 * mm),
        P("by Hassy codeur", "signature"),
        P("Développeur Full-Stack", "center"),
    ])


# =====================================================
# FACE 1 : EXTÉRIEUR
#
# GAUCHE  : Volet complémentaire
# CENTRE  : Dos du dépliant
# DROITE  : Couverture
# =====================================================

def outside_left():

    content = [
        P("OPTIONS COMPLEMENTAIRES", "eyebrow"),
        P("Allez plus loin.", "title"),

        P(
            "Renforcez votre présence digitale "
            "avec des services supplémentaires.",
            "subtitle"
        ),

        section("01. Visibilité locale"),

        P(
            "<b>Gestion de fiche établissement Google</b><br/>"
            "Site vitrine : <font color='#20ED86'>+150 000 Ar</font><br/>"
            "Site dynamique : <font color='#20ED86'>+200 000 Ar</font>",
            "body"
        ),

        section("02. Visite virtuelle 360°"),

        P(
            "<b>Visite virtuelle immersive</b><br/>"
            "Site vitrine : <font color='#20ED86'>+290 000 Ar</font><br/>"
            "Site dynamique : <font color='#20ED86'>+490 000 Ar</font>",
            "body"
        ),

        divider(),

        section("Une offre adaptée"),

        P(
            "Les services complémentaires sont facultatifs. "
            "Ils sont ajoutés uniquement selon vos besoins.",
            "body"
        ),

        Spacer(1, 4 * mm),

        P(
            "Chaque projet peut être adapté selon votre "
            "activité, vos objectifs et votre budget.",
            "small"
        )
    ]

    add_brand(content)
    return content


def outside_middle():

    content = [
        P("CONTACT & ACCOMPAGNEMENT", "eyebrow"),
        P("Parlons de votre projet.", "title"),

        P(
            "Vous avez une idée ? Construisons ensemble "
            "une solution web adaptée à votre activité.",
            "subtitle"
        ),

        section("Contact direct"),

        P(
            "<b>WhatsApp</b><br/>"
            "+261 38 58 415 24",
            "body"
        ),

        P(
            "<b>Email</b><br/>"
            "hassy.tsihoarana@gmail.com",
            "body"
        ),

        divider(),

        section("Les étapes de votre projet"),

        *bullets([
            "Échange sur vos besoins et objectifs",
            "Choix de la formule",
            "Conception et développement",
            "Présentation et ajustements",
            "Validation et mise en ligne"
        ]),

        Spacer(1, 4 * mm),

        P(
            "TECHNOLOGIES",
            "heading"
        ),

        P(
            "Ruby on Rails • React • Node.js<br/>"
            "PostgreSQL • API • Automatisation",
            "body"
        ),

        Spacer(1, 4 * mm),

        P(
            "Votre projet commence par une conversation.",
            "center"
        )
    ]

    add_brand(content)
    return content


def outside_right():

    content = [
        P("SOLUTIONS WEB PROFESSIONNELLES", "eyebrow"),

        P(
            "Votre activité mérite "
            "<font color='#20ED86'>une présence web</font> "
            "à sa hauteur.",
            "title"
        ),

        P(
            "Deux solutions pour développer votre "
            "image et votre activité sur Internet.",
            "subtitle"
        ),

        divider(),

        P("SERVICE 01", "eyebrow"),
        P("SITE VITRINE", "title"),

        P(
            "Un site professionnel, rapide et responsive "
            "pour présenter votre entreprise et vos services.",
            "body"
        ),

        P("À partir de 700 000 Ar", "price"),

        divider(),

        P("SERVICE 02", "eyebrow"),
        P("SITE WEB DYNAMIQUE", "title"),

        P(
            "Une plateforme interactive avec gestion "
            "de contenus, utilisateurs, données et "
            "fonctionnalités métier.",
            "body"
        ),

        P("À partir de 1 500 000 Ar", "price"),

        Spacer(1, 5 * mm),

        P(
            "DESIGN • DEVELOPPEMENT • DEPLOIEMENT",
            "eyebrow"
        ),

        Spacer(1, 4 * mm),

        P(
            "by Hassy codeur",
            "signature"
        ),

        P(
            "Construisons ensemble votre présence en ligne.",
            "center"
        )
    ]

    return content


# =====================================================
# FACE 2 : INTÉRIEUR
#
# GAUCHE : Service 01
# CENTRE : Service 02
# DROITE : Comparatif et contact
# =====================================================

def inside_left():

    content = [
        P("SERVICE 01", "eyebrow"),
        P("Site vitrine", "title"),

        P(
            "Votre image en ligne, prête en quelques semaines.",
            "subtitle"
        ),

        P(
            "Un site responsive, rapide et soigné pour "
            "présenter votre entreprise, vos activités, "
            "vos produits et vos services, et donner envie "
            "de vous contacter.",
            "body"
        ),

        section("Inclus dans cette offre"),

        *bullets([
            "Design moderne et personnalisé",
            "Pages Accueil, À propos, Services et Contact",
            "Formulaire de contact",
            "Adaptation mobile, tablette et ordinateur",
            "Optimisation SEO de base",
            "Déploiement et mise en ligne"
        ]),

        divider(),

        section("Choisissez votre formule"),

        package(
            "ESSENTIEL",
            "700 000 Ar",
            "Pour démarrer proprement votre présence web.",
            [
                "Jusqu'à 4 pages",
                "Design moderne et responsive",
                "Présentation des activités et services",
                "Formulaire de contact",
                "Optimisation SEO de base"
            ]
        ),

        Spacer(1, 2 * mm),

        package(
            "PROFESSIONNEL",
            "1 200 000 Ar",
            "Le meilleur équilibre pour une image sérieuse.",
            [
                "Jusqu'à 8 pages",
                "Design personnalisé",
                "Animations et interactions modernes",
                "Formulaire de contact avancé",
                "SEO et performances optimisés",
                "Google Maps et réseaux sociaux"
            ],
            recommended=True
        ),

        Spacer(1, 2 * mm),

        package(
            "PREMIUM",
            "1 800 000 Ar",
            "Pour un site premium et plus impactant.",
            [
                "Jusqu'à 12 pages",
                "Design entièrement personnalisé",
                "Animations avancées",
                "Galerie et portfolio",
                "SEO renforcé"
            ]
        )
    ]

    return content


def inside_middle():

    content = [
        P("SERVICE 02", "eyebrow"),
        P("Site web dynamique", "title"),

        P(
            "Une expérience interactive qui transforme "
            "les visiteurs en clients.",
            "subtitle"
        ),

        P(
            "Une plateforme web fluide et intuitive : "
            "contenus gérables, données en direct, "
            "espaces utilisateurs et fonctionnalités "
            "métier adaptées à votre activité.",
            "body"
        ),

        section("Inclus dans cette offre"),

        *bullets([
            "Interfaces modernes avec animations",
            "Interactions dynamiques",
            "Gestion des contenus",
            "Connexion à des API",
            "Tableaux de bord",
            "Fonctionnalités métier"
        ]),

        divider(),

        section("Choisissez votre formule"),

        package(
            "STARTER",
            "1 500 000 Ar",
            "Pour une vitrine dynamique avec plus d'interactions.",
            [
                "Site web dynamique",
                "Sections interactives",
                "Formulaire de contact",
                "Responsive complet"
            ]
        ),

        Spacer(1, 2 * mm),

        package(
            "BUSINESS",
            "2 500 000 Ar",
            "Pour une expérience avancée, orientée conversion.",
            [
                "Site web dynamique complet",
                "Tableaux de bord et données",
                "Authentification utilisateur",
                "Connexion API et CMS",
                "Optimisation UX et SEO"
            ],
            recommended=True
        ),

        Spacer(1, 2 * mm),

        package(
            "SCALE",
            "4 000 000 Ar",
            "Pour un site premium et prêt à grandir.",
            [
                "Architecture personnalisée",
                "Rôles et permissions",
                "Tableau de bord avancé",
                "Gestion de données et statistiques",
                "API externes et automatisations",
                "Tests et déploiement"
            ]
        )
    ]

    return content


def inside_right():

    content = [
        P("VOTRE PROJET WEB", "eyebrow"),
        P("Quelle solution choisir ?", "title"),

        P(
            "Choisissez une formule adaptée à vos "
            "objectifs et à votre activité.",
            "subtitle"
        ),

        section("Site vitrine"),

        P(
            "Idéal pour :",
            "body"
        ),

        *bullets([
            "Présenter une entreprise",
            "Afficher des services et produits",
            "Valoriser vos réalisations",
            "Recevoir des demandes de contact",
            "Développer votre visibilité"
        ]),

        divider(),

        section("Site web dynamique"),

        P(
            "Idéal pour :",
            "body"
        ),

        *bullets([
            "Gérer des utilisateurs",
            "Gérer des contenus et données",
            "Créer des espaces clients",
            "Proposer des tableaux de bord",
            "Automatiser des processus métier"
        ]),

        divider(),

        section("Estimations de référence"),

        P(
            "<b>Site vitrine</b><br/>"
            "Professionnel : "
            "<font color='#20ED86'><b>1 200 000 Ar</b></font>",
            "body"
        ),

        P(
            "<b>Site dynamique</b><br/>"
            "Business : "
            "<font color='#20ED86'><b>2 500 000 Ar</b></font>",
            "body"
        ),

        divider(),

        section("Contactez-moi"),

        P(
            "<b>WhatsApp :</b><br/>"
            "+261 38 58 415 24<br/><br/>"
            "<b>Email :</b><br/>"
            "hassy.tsihoarana@gmail.com",
            "body"
        ),

        P(
            "Les tarifs sont des estimations de départ. "
            "Le devis définitif dépend des fonctionnalités, "
            "des contenus et des intégrations souhaitées.",
            "small"
        ),

        Spacer(1, 3 * mm),

        P("by Hassy codeur", "signature"),
        P("Développeur Full-Stack", "center")
    ]

    return content


# =====================================================
# GÉNÉRATION DU PDF
# =====================================================

def generate_pdf():

    c = canvas.Canvas(
        OUTPUT,
        pagesize=landscape(A4)
    )

    c.setTitle(
        "Offres de création web - Hassy codeur"
    )

    c.setAuthor("Hassy codeur")
    c.setSubject(
        "Dépliant commercial - Site vitrine et site dynamique"
    )

    # ---------------------------------------------
    # PAGE 1 : EXTÉRIEUR
    # ---------------------------------------------

    draw_background(c, 1)

    outside_panels = [
        outside_left(),
        outside_middle(),
        outside_right()
    ]

    for index, content in enumerate(outside_panels):
        draw_panel(c, index, content)

    c.showPage()

    # ---------------------------------------------
    # PAGE 2 : INTÉRIEUR
    # ---------------------------------------------

    draw_background(c, 2)

    inside_panels = [
        inside_left(),
        inside_middle(),
        inside_right()
    ]

    for index, content in enumerate(inside_panels):
        draw_panel(c, index, content)

    c.showPage()
    c.save()

    print("\n===================================")
    print(" PDF GÉNÉRÉ AVEC SUCCÈS !")
    print("===================================")
    print(f"Fichier : {os.path.abspath(OUTPUT)}")
    print("Format  : A4 horizontal")
    print("Pages   : 2")
    print("Volets  : 3 par page")
    print("Signature : by Hassy codeur")
    print("===================================\n")


if __name__ == "__main__":
    generate_pdf()
