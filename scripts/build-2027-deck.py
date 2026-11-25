#!/usr/bin/env python3
"""Meeting deck: Alphacom technical review and 2027 plan."""

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

OUT = "/Users/apple/alphacom/Alphacom-2027-Technical-Presentation.pptx"

BURGUNDY = RGBColor(0x8E, 0x1B, 0x2C)
DEEP = RGBColor(0x4C, 0x10, 0x19)
INK = RGBColor(0x1C, 0x14, 0x16)
MUTED = RGBColor(0x5E, 0x4E, 0x52)
CREAM = RGBColor(0xF6, 0xF1, 0xEC)
PAPER = RGBColor(0xFF, 0xFD, 0xFB)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LINE = RGBColor(0xE6, 0xDC, 0xD6)

W, H = Inches(13.333), Inches(7.5)


def set_run(run, text, size, color, bold=False, font="Calibri"):
    run.text = text
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.name = font


def add_text(slide, left, top, width, height, text, size, color, bold=False, font="Calibri", align=PP_ALIGN.LEFT):
    box = slide.shapes.add_textbox(left, top, width, height)
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    set_run(p.add_run() if p.runs else p.runs[0] if False else p.add_run(), text, size, color, bold, font)
    # paragraph was empty; add_run is correct. Clear the accidental empty? add_run is the first run.
    return box


def rect(slide, left, top, width, height, fill):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.fill.background()
    shape.shadow.inherit = False
    return shape


def footer(slide, number, total, dark=False):
    color = RGBColor(0xE8, 0xC8, 0xCE) if dark else MUTED
    add_text(slide, Inches(0.55), Inches(7.08), Inches(8), Inches(0.28), "Alphacom Online  ·  Technical review  ·  2027", 11, color)
    add_text(slide, Inches(11.2), Inches(7.08), Inches(1.6), Inches(0.28), f"{number}  /  {total}", 11, color, align=PP_ALIGN.RIGHT)


def bullets(slide, items, top, size=18, color=INK, width=Inches(12.1)):
    box = slide.shapes.add_textbox(Inches(0.6), top, width, Inches(7.0) - top)
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        p.level = 0
        p.space_after = Pt(10)
        set_run(p.add_run(), item, size, color)
    return box


def new_slide(prs, kicker, title, dark=False):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    rect(slide, 0, 0, W, H, DEEP if dark else PAPER)
    if not dark:
        rect(slide, 0, 0, Inches(0.12), H, BURGUNDY)
    add_text(slide, Inches(0.55), Inches(0.32), Inches(12), Inches(0.32), kicker.upper(), 13, RGBColor(0xF0, 0xB8, 0xC0) if dark else BURGUNDY, True)
    add_text(slide, Inches(0.55), Inches(0.62), Inches(12.2), Inches(1.05), title, 30, WHITE if dark else INK, True, "Georgia")
    return slide


def build():
    prs = Presentation()
    prs.slide_width = W
    prs.slide_height = H
    prs.core_properties.title = "Alphacom Online — technical review and 2027 plan"
    prs.core_properties.subject = "Meeting presentation, 20 November 2026"
    total = 18

    # 1 Cover
    s = prs.slides.add_slide(prs.slide_layouts[6])
    rect(s, 0, 0, W, H, DEEP)
    rect(s, 0, 0, Inches(0.18), H, BURGUNDY)
    add_text(s, Inches(0.7), Inches(1.7), Inches(11), Inches(0.35), "20 NOVEMBER 2026", 14, RGBColor(0xF0, 0xB8, 0xC0), True)
    add_text(s, Inches(0.7), Inches(2.15), Inches(11.5), Inches(1.8), "Where the Alphacom website stands, and what we will build in 2027.", 36, WHITE, True, "Georgia")
    add_text(s, Inches(0.7), Inches(4.3), Inches(10.5), Inches(1.1), "A practical review of the shop, search, security, backups, and the capacity to grow. No promise of a Google ranking.", 18, RGBColor(0xF6, 0xF1, 0xEC))
    add_text(s, Inches(0.7), Inches(6.5), Inches(8), Inches(0.3), "alphacomonline.com   ·   Computer Village, Lagos", 14, RGBColor(0xE8, 0xC8, 0xCE))

    # 2 Agenda
    s = new_slide(prs, "The six areas", "What this meeting will cover.")
    items = [
        "1    Current technical state: strengths, weaknesses, and what is still open.",
        "2    Development plans, improvements, and new features for 2027.",
        "3    Technical SEO, indexing, visibility, and organic search.",
        "4    Security, data protection, backup, and recovery.",
        "5    Scalability for more traffic and a larger shop.",
        "6    The 2027 roadmap, timing, and what we need in order to start.",
    ]
    bullets(s, items, Inches(1.9), 22)
    footer(s, 2, total)

    # 3 Position
    s = new_slide(prs, "1  ·  Current state", "The shop works. The map we give Google does not.")
    bullets(s, [
        "The public site is a Next.js shop at alphacomonline.com. Products, prices, stock, and orders come from a separate API.",
        "Photos are stored on Cloudinary. A buyer can search, open a product, add it to the cart, and check out.",
        "Already live this season: newsletter signup, email when a cart is left and when an order is paid, product promotions with video, and a mobile Add to Cart that is easier to tap.",
        "A single product page already tells Google the name, the price, and whether it is in stock.",
        "The failure is earlier. The files that list the shop are partly locked, and the main map still names aisles we do not sell.",
    ], Inches(1.9), 18)
    footer(s, 3, total)

    # 4 Strengths
    s = new_slide(prs, "1  ·  Strengths", "What is already solid.")
    bullets(s, [
        "A real catalogue, with price, stock, brand, and a stable product address.",
        "Product pages introduce themselves. Legacy ID links are redirected to the readable address.",
        "Checkout, cart, account, and API paths are kept out of the public crawl.",
        "Brand shelves exist, including Logitech, Anker, SanDisk, and Micropack.",
        "A shopper who leaves a cart, and a shopper who pays, can both receive an email from us.",
        "A promotion on a product can show a title, a short note, and a video under the description.",
    ], Inches(1.85), 20)
    footer(s, 4, total)

    # 5 Weaknesses
    s = new_slide(prs, "1  ·  Weaknesses", "What holds the site back.")
    bullets(s, [
        "robots.txt tells crawlers not to open any .xml file. That blocks sitemap.xml and the product sitemap we also publish.",
        "The main sitemap lists fashion, books, phones, and cars. Alphacom sells computer products.",
        "Brand shelves load the products after the page opens. A quick visitor, including Google, can see the name and miss the goods.",
        "Google is told delivery is free, because checkout shows no delivery charge. Page, checkout, and Google must show the same cost.",
        "Most products have a part number, not a barcode we can prove. A guessed barcode gets the product rejected.",
        "The production build ignores TypeScript and lint errors, and product images are not resized by the site.",
    ], Inches(1.85), 18)
    footer(s, 5, total)

    # 6 Outstanding
    s = new_slide(prs, "1  ·  Outstanding issues", "These are the open items, in order.")
    bullets(s, [
        "Open the real product list, and stop blocking .xml files that Google needs.",
        "Replace the invented category map with the aisles the shop actually uses.",
        "Put the products on the brand page at the moment the page opens.",
        "Agree the real delivery cost, then show that same cost on the page, at checkout, and to Google.",
        "Use the name printed on the box. Send a barcode only when the brand has given us one we can read.",
        "Turn the build checks back on. Confirm who backs up the database. That backup is not in this website project.",
    ], Inches(1.85), 18)
    footer(s, 6, total)

    # 7 Plans
    s = new_slide(prs, "2  ·  Plans for 2027", "Make the shop findable before we add more surface.")
    bullets(s, [
        "First half of the year: the catalogue must be readable, accurate, and fast. That is the base for search and for any later advertising.",
        "Micropack should be described as clearly as Logitech, Anker, and SanDisk, using the name on the box.",
        "Keep the tools that already help a sale: search, product pages, cart email, newsletter, and promotions.",
        "New work has to help a buyer finish an order, or help us see what sold. We will not add features for their own sake.",
        "Star ratings will not be invented. A review is used only when a real buyer wrote it.",
    ], Inches(1.9), 18)
    footer(s, 7, total)

    # 8 Features
    s = new_slide(prs, "2  ·  Improvements and features", "The work that changes the shop a buyer sees.")
    bullets(s, [
        "Brand and category shelves rendered with the products already on the page.",
        "A clean list of every live product, submitted in Google Search Console.",
        "A product feed for Google that uses the part number until a real barcode exists.",
        "One delivery figure, written once, and reused at checkout and in the product data.",
        "Order status a buyer can open without calling the shop.",
        "Staff changes to products, prices, and promotions stay on the separate admin site.",
    ], Inches(1.9), 18)
    footer(s, 8, total)

    # 9 SEO
    s = new_slide(prs, "3  ·  Technical SEO", "We can make the site readable. We cannot buy a ranking.")
    bullets(s, [
        "Search engines show pages they are allowed to read, and that match the words a person typed.",
        "Step 1. Let Google open the sitemap and the product list.",
        "Step 2. List real aisles and every product that is actually for sale.",
        "Step 3. Use the words on the carton in the page title, for example Micropack MP-702W wireless mouse.",
        "Step 4. Keep price, stock, and delivery identical in the three places a buyer or Google can see.",
        "We will report indexed pages and orders from search. We will not pay anyone who promises position 1 to 5.",
    ], Inches(1.85), 18)
    footer(s, 9, total)

    # 10 Measures
    s = new_slide(prs, "3  ·  Indexing and organic search", "What we will count each month.")
    bullets(s, [
        "Pages accepted in Search Console, against the number of live products.",
        "Sitemap status: submitted, read, and free of the old fashion, books, and car URLs.",
        "Brand and model queries we stock: Micropack, Logitech, Anker, SanDisk, and the codes on the boxes.",
        "Product pages whose first response already contains the name, the price, and the stock.",
        "Organic visits, and orders that started from organic search. That is the business number.",
        "Paid ads are a later decision. They wait until the product can already be seen.",
    ], Inches(1.85), 18)
    footer(s, 10, total)

    # 11 Security
    s = new_slide(prs, "4  ·  Security today", "The shop is separated from the admin. The build is too loose.")
    bullets(s, [
        "The public site and the admin site are separate. Catalogue changes are not made on the shop itself.",
        "A signed-in shopper’s token is kept in the browser. That is convenient, and it is also something a script on the page could read.",
        "Crawlers are blocked from checkout, cart, account, and API addresses.",
        "Card numbers are not stored in this website project. Payment stays with the payment provider.",
        "The production build is set to ignore TypeScript and lint errors. A fault can ship without the build stopping.",
        "There is no content security policy on the site yet.",
    ], Inches(1.85), 18)
    footer(s, 11, total)

    # 12 Security plan + data
    s = new_slide(prs, "4  ·  Security and data protection", "The 2027 controls.")
    bullets(s, [
        "Add a content security policy, and review how the sign-in token is stored.",
        "Keep secrets in the host environment only. They do not belong in the repository.",
        "Turn TypeScript and lint back on for the production build.",
        "Limit who can change price, stock, promotions, and customer exports. Review that list each quarter.",
        "Collect only what checkout and the newsletter need. The newsletter stays opt-in.",
        "Write down how long we keep an order and an email address, who may export the list, and how a person asks for their account to be removed.",
    ], Inches(1.85), 18)
    footer(s, 12, total)

    # 13 Backup
    s = new_slide(prs, "4  ·  Backup and recovery", "We can rebuild the website. We must prove we can restore the orders.")
    bullets(s, [
        "The website code is in Git. That restores the shop front, not the orders.",
        "Products, customers, and orders live in the API database. Photos live on Cloudinary.",
        "This website project contains no backup job. Where the database copy is kept still has to be confirmed.",
        "2027 requirement: a daily database backup, kept for 30 days.",
        "Once a quarter, restore that backup onto a test copy and record how long it took.",
        "Target: return the shop and the order book to a known good day within one working day.",
    ], Inches(1.85), 18)
    footer(s, 13, total)

    # 14 Scale
    s = new_slide(prs, "5  ·  Scalability", "The shape is right. The busy hour is not yet proven.")
    bullets(s, [
        "The website and the API are already separate. That is what lets the shop grow without mixing the storefront and the database.",
        "Today the site builds a product index by reading the catalogue in pages and holding it in memory.",
        "Images are delivered as stored. The site does not resize them for a phone.",
        "A campaign such as Black Friday sends many people to the same API at once.",
        "Before the next large sale we agree a peak, using last season’s busiest hour plus half again, and we test that peak.",
        "Email, promotions, and the catalogue read must not be able to stall the product page.",
    ], Inches(1.85), 18)
    footer(s, 14, total)

    # 15 Roadmap
    s = new_slide(prs, "6  ·  Roadmap", "Four quarters. Each one has a result we can see.")
    bullets(s, [
        "January to March. Open the map. Real aisles. Products on the shelf when the page opens. One price and one delivery cost. Search Console live.",
        "April to June. Faster pages. Resized images. Build checks turned back on. Errors reported when a page fails.",
        "July to September. Security policy. Token review. Backup restored in a test. Written rule for customer data.",
        "October to December. Load test against the agreed peak. Black Friday checklist. A review of which products search actually sold.",
        "Each quarter ends with a one-page count: indexed products, page speed, backup test, and orders from search.",
    ], Inches(1.85), 18)
    footer(s, 15, total)

    # 16 Requirements
    s = new_slide(prs, "6  ·  What we need in order to start", "Decisions and access, not more slides.")
    bullets(s, [
        "The real delivery fee, or a written decision that delivery is free. The site must stop guessing.",
        "A barcode sheet from each brand we want in Google shopping, starting with the models we actually have in stock.",
        "Access: Google Search Console for alphacomonline.com, the website host, Cloudinary, the API database owner, and the email tool.",
        "One person who can change the storefront, and one person who can confirm a database restore.",
        "A named peak for the load test, taken from the last busy sale.",
        "Agreement that paid search waits until the five catalogue fixes are done.",
    ], Inches(1.85), 18)
    footer(s, 16, total)

    # 17 Scorecard
    s = new_slide(prs, "How we will know", "Six numbers for the year, reviewed every month.")
    bullets(s, [
        "Live products, and how many of those URLs Google has indexed.",
        "Sitemap errors. The target is zero URLs for aisles we do not sell.",
        "Share of product pages whose price and delivery match checkout.",
        "Median time for the product page to become usable on a phone.",
        "Date of the last successful database restore test, and how long it took.",
        "Orders that began in organic search, counted beside total orders.",
    ], Inches(1.9), 20)
    footer(s, 17, total)

    # 18 Close
    s = new_slide(prs, "The ask", "Three decisions from this meeting.", dark=True)
    bullets(s, [
        "Confirm the delivery cost the website is allowed to publish.",
        "Name the owner of the database backup, and the date of the first restore test.",
        "Approve the first quarter: open the map, correct the aisles, and put the products on the page before any new campaign.",
    ], Inches(2.05), 22, RGBColor(0xFF, 0xF8, 0xF4))
    add_text(s, Inches(0.55), Inches(6.35), Inches(12), Inches(0.4), "alphacomonline.com", 16, RGBColor(0xF0, 0xB8, 0xC0))
    footer(s, 18, total, dark=True)

    prs.save(OUT)
    print(OUT)


if __name__ == "__main__":
    build()
