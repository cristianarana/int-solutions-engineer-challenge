# Analytics Specialist Challenge

**Tag management and Apps Script**

Fork this repository and do the work in your fork: [github.com/dfranquiz/int-solutions-engineer-challenge](https://github.com/dfranquiz/int-solutions-engineer-challenge). The site you will tag lives in `website/`. The spreadsheet data lives in `data/bixby_employees.csv`.

---

## Submission

1. Fork this repository and clone **your** fork.
2. Copy `LOG.md.example` to `LOG.md` and fill it in.
3. Export your GTM container (Admin → Export Container) and commit the `.json` file in your fork.
4. Share that GTM container with `douglas.franquiz@monks.com` and `ivan.pfaab@monks.com` (Admin → User Management) with at least **Edit** access.
5. Share your GA4 property with `douglas.franquiz@monks.com` and `ivan.pfaab@monks.com` (Admin → Property access management) with at least **Editor** access.
6. Create a Google Sheet from the CSV, finish the Apps Script exercises in that copy, and share it with **edit access** to `douglas.franquiz@monks.com` and `ivan.pfaab@monks.com`.
7. Name the sheet `[Your name] Technical challenge - Apps Script`.
8. Invite the hiring team as collaborators on your fork when you are ready for review.

### What we review

- The GTM container and whether the events arrive in GA4 with the right parameters
- The Apps Script behavior on your sheet
- How clearly you explain the work in `LOG.md`

---

## Repository

```
├── README.md
├── LOG.md.example
├── data/
│   └── bixby_employees.csv
└── website/
    ├── index.html
    ├── shop.html
    ├── landing.html
    ├── css/styles.css
    └── js/
        ├── products.js
        ├── shop.js
        ├── newsletter.js
        ├── cart.js
        └── pages.js
```

---

## Before you start

Useful references:

- [GTM crash course (MeasureSchool)](https://www.youtube.com/watch?v=nPPHWqJDjvA&list=PLgr_8Hk8l4ZEM60XgQlGqhGoBtZSzhTIy)
- [GA4 crash course (MeasureSchool)](https://www.youtube.com/watch?v=ZaBycjPJztk)
- [Google Tag Manager docs](https://developers.google.com/tag-platform/tag-manager)
- [GA4 docs](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 ecommerce events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#add_or_remove_an_item_from_a_shopping_cart)
- [Apps Script and Sheets](https://developers.google.com/apps-script/guides/sheets)

Setup:

1. Create your own GTM web container at [tagmanager.google.com](https://tagmanager.google.com).
2. Create a GA4 property at [analytics.google.com](https://analytics.google.com) and connect it from GTM.
3. Serve the site over HTTP. GTM Preview does not behave reliably from `file://`.

```bash
cd website
python3 -m http.server 5500
```

Open [http://localhost:5500](http://localhost:5500).

4. The site does not include your container. Install the snippet yourself. `shop.html` and `landing.html` are pages. Read how the site is loaded before you decide where the snippet belongs.
5. Publish an empty version of the container before you use Preview. If Preview will not connect, try again or use a private window.

Open the shop and the workshop from the home page (`#shop` and `#workshop`). Do not rewrite the dataLayer pushes.

---

## Part 1 — Google Tag Manager

### Exercise 1 — Add to cart

The shop is the Shop page (`#shop`, markup in `website/shop.html`). Adding a product pushes a dataLayer object in this shape (Children's Beach Boat):

```json
{
  "event": "ga4.trackEvent",
  "eventName": "add_to_cart",
  "eventParams": {
    "section": "shop",
    "value": 7,
    "currency": "USD",
    "items": [
      {
        "item_id": "20017478",
        "item_name": "Children's Beach Boat",
        "item_brand": "Pipo Toys & Random Stuff",
        "price": 7,
        "item_category": "Children's Stuff",
        "item_variant": "Limited edition",
        "quantity": 1
      }
    ],
    "site": "pipo sandbox"
  }
}
```

That object is not a GA4 ecommerce event. Build a new `dataLayer.push` that turns it into the [recommended `add_to_cart` structure](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#add_or_remove_an_item_from_a_shopping_cart). Use the values already on the dataLayer when the shopper adds a product. Do not hardcode the catalog in the tag.

Add a `tax` field **on each item**. Tax is 21% of that item's unit price, rounded to 2 decimal places.

For the beach boat, the push you produce should look like this:

```json
{
  "event": "add_to_cart",
  "ecommerce": {
    "value": 8.47,
    "currency": "USD",
    "items": [
      {
        "item_id": "20017478",
        "item_name": "Children's Beach Boat",
        "item_brand": "Pipo Toys & Random Stuff",
        "price": 7,
        "tax": 1.47,
        "item_category": "Children's Stuff",
        "item_variant": "Limited edition",
        "quantity": 1
      }
    ]
  }
}
```

Check at least one other price as well. `$5.95` is not a round 21%.

Also send `add_to_cart` to your GA4 property so the event, value, currency, and items show up in DebugView.

### Exercise 2 — Newsletter

The workshop page is `#workshop` (markup in `website/landing.html`). The newsletter form is in the footer. A successful signup does not redirect to a thank-you page, and a click on Subscribe is not enough: the address can be empty or invalid.

The page already records those outcomes on `window.dataLayer`. Inspect it. Submit the form three ways:

- empty
- a value that is not an email
- a valid email

Then implement a **GA4 event** for this behavior. Include parameters that say which form it was, whether the submission succeeded, and, when it failed, why.

### Exercise 3 — Note to a director

Write an email **in English** to a Director of Analytics who does not write code and does not implement tags. Explain, in plain language, why the approaches from Exercises 1 and 2 are worth doing. Put the email in `LOG.md`.

When Part 1 is done, export the container or workspace you worked in (Admin → Export Container) and commit that `.json` so it can be reviewed.

---

## Part 2 — Apps Script

`data/bixby_employees.csv` is a staff list for a fictional company, **Bixby**. Import it into a Google Sheet you own (File → Import → Upload). Do the work in that sheet with [Google Apps Script](https://developers.google.com/apps-script/guides/sheets) (Extensions → Apps Script).

Solve this with Apps Script. Do not use spreadsheet formulas.

The file is laid out like this:

| Row | What it is |
| --- | --- |
| 1 | Blank. **B1 is reserved** for the timestamp in Exercise 1. |
| 2 | Blank. |
| 3 | Headers. |
| 4+ | One employee per row. |

If the import drops the blank rows, insert two rows above the header so this layout is restored before you write the script.

Columns:

- **Name** — first and last name
- **Mail** — first initial of the first name, then the last name
- **Alias** — you fill this in Exercise 3
- **Hash** — 50 lowercase letters, used internally
- **Conteo de Seguridad** — you fill this in Exercise 2

Exercises 2 and 3 are started from a custom menu named **Validaciones**:

- **Conteo** runs Exercise 2
- **Alias** runs Exercise 3

Build that menu with Apps Script. After a reload it should appear in the sheet menu bar.

### Exercise 1 — Last change

Whenever someone edits the sheet, write the date and time of that edit into **B1**, replacing whatever was there. Writing B1 is itself an edit. The timestamp must not keep updating itself in a loop.

### Exercise 2 — Security count

For each hash in column D, write a number into **Conteo de Seguridad**.

Write a function that:

1. Takes one hash: a string of 50 lowercase letters.
2. Finds the longest **contiguous** run of letters that move forward through the alphabet. Letters do not have to be neighbors in the alphabet. `moqy` is a valid run. The next letter only has to come later than the one before it.
3. The winning run must contain at least one vowel (`a`, `e`, `i`, `o`, `u`).
4. Writes the **length** of that run into column E for that employee.

Worked example. For `acbcrxorzeh` the runs are:

- `ac` = 2
- `bcrx` = 4, but it has no vowel, so it does not count
- `orz` = 3
- `eh` = 2

Column E gets **3**.

Run this from **Validaciones → Conteo**, for every employee hash.

### Exercise 3 — Alias

Each employee needs a unique alias. This endpoint returns Harry Potter characters:

[https://hp-api.onrender.com/api/characters](https://hp-api.onrender.com/api/characters)

Use it to assign a **unique, random** alias to every employee and write it in column C. Two employees must not receive the same alias.

Run this from **Validaciones → Alias**.

### Exercise 4 — Note to a developer

Write an email to a developer on the client side. Describe the important technical and practical decisions you made in the scripts above. Put the email in `LOG.md`.

---

## Getting started

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/int-solutions-engineer-challenge.git
cd int-solutions-engineer-challenge
cd website
python3 -m http.server 5500
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub handle. Repository: [github.com/dfranquiz/int-solutions-engineer-challenge](https://github.com/dfranquiz/int-solutions-engineer-challenge).

| Page | URL | What to use it for |
| --- | --- | --- |
| Home | http://localhost:5500 | Home |
| Shop | http://localhost:5500/#shop | Exercise 1 |
| Workshop | http://localhost:5500/#workshop | Exercise 2, form in the footer |
