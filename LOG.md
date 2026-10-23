# Challenge submission

> Copy this file to `LOG.md` and complete it before you submit.

**Candidate name: Cristian Arana**  
**Date completed:23/10/2026**

---

## Part 1 — Google Tag Manager

**Web container ID: GTM-MLLVZXJ9**  
**GA4 measurement ID: G-XLLTT3HDMD**  
**Google Sheet is not part of this section.**

### Email to the Director of Analytics

to: Director of Analytics
subject: Why we changed how we track add-to-cart and newsletter signups
body:
Hi,
Here I'm going to explain the changes we made to measure the shop and why they worth it.

**Add to cart**
When a user added a product to the cart the site sent information that Google Analytics could not use for reports, so I changed that. I transformed data into the standard format,
so the ecommerce reports in Google Analytics can use it.
I also added the 21% of tax to each product and to the total value. For example if a product has a unit price of USD 7, the tax will be USD 1.47 and the total value
of one unit is USD 8.47. We did it by taking data from the site already sends,  without changing the site's code and without entering products one by one.
**Newsletter Subscription**
Before these changes, we could only count clicks on the button, without knowing whether there was an error or the subscription was succesfull.
Now I record every outcome of the signup. This let us know the real subscription rate and see whether many users  makes mistakes, such as typing the email in the wrong
format or leaving the field empty. With this I can improve the form.

If you want I can prepare reports with data that is collected.

Regards,
Arana Cristian

### How you validated

**In GTM Preview (Tag Assistant)**
- In the Summary view, I checked that each interaction produced the expected events.
- For each event, I opened the Tags tab to confirm which tags fired and which did not. For the triggers, I verified which conditions were met and which events activated them.
- In the Variables tab, I checked the values being read at the moment of the event.
- In the browser console, I inspected `dataLayer` to confirm the original push from the site and, for add to cart, the new `add_to_cart` push.
- In the Network tab (filter `collect`), I checked the actual request sent to GA4, to be sure of what each tag was sending.

**Add to cart (GA4 DebugView)**
- I confirmed that a single `add_to_cart` event arrived at the time of the interaction, with `currency`, `value` and the `items` array in the recommended structure.
- I tested more than one product, including a price that is not a round 21% to check the tax rounding.
- `tax` is present in each item in the `dataLayer` and in the `collect` request (parameter `pr1`), but DebugView's Items tab does not display it. My hypothesis is that it is not a standard item field, so DebugView does not render it. This is not confirmed. To use it in reports, it would need to be registered as an item-scoped custom dimension data would then take up to 48 hours to appear.
- `price` appears multiplied by 1,000,000 in DebugView (for example 7000000), which is how GA4 displays it internally. The value sent is the real price.

**Newsletter (GA4 DebugView)**
- I submitted the form three ways: empty, with text that is not an email, and with a valid email.
- Each attempt sent one `newsletter_subscription` event with `form_name`, `form_status` and, only on failure, `form_error` (`Empty email` or `Wrong format`).
- On success, `form_error` is not sent. I confirmed it was absent from the `collect` request.
- I found that the Data Layer Variable kept the previous error value after a failed attempt, so I used a custom JavaScript variable that returns the error only when the status is `Error`.

---

## Part 2 — Apps Script

**Google Sheet URL: https://docs.google.com/spreadsheets/d/1u6FhKPOrImXwxbmlQUD07-GfbqdqlWWQ7INxS2dZ05I/edit?usp=sharing**  

### Email to the client developer

to:client-dev
subject: Technical decisiones on google sheet and app script
body:
Hi,
Here I'm going to explain the technical and practical decisions we made for Apps Script implementation for the Bixby employee spreadsheet and why they worth it.

**Last Change**
The objective for this point was to wrote date and time of any edition into B1, so I implemented a trigger that updates the cell B1 with the latest timestamp, using the spreadsheet's
timezone. Since B1 is reserved for auditing, edits that includes this cell are rejected by restoring its previous value when available. The trigger also ignores the sheets that do not
match with employees sheet name.

**Security Count**
The objective was to find the longests contiguous run of letters from a hash and contains at least 1 vowel. The solution I implemented was to separate the exercise into three layers:
* Validation Layer: this layer takes the hash, normilize it and verify the length must be 50.
* Counting Layer: after the hash is validated, this layer tracks contiguous, strictly increasing sequences and only considers sequences containing at least one vowel. To improve efficienty, employee data is read in single range operation and results are written back in a batch rather than updating individual cells. Invalid hashses are reported explicitly in column E
* SpreadSheet update Layer: This layer reads the hashes information, call the process each hash a time and writes in one call to E column, also adding timestamp to B1 cell.

**Alias**
In this case the objective was to generate an unique and random alias for each employee using the information from an API that has information of Harry Potter. The solution was to use UrlFetchApp to retrieve characters information. The API request includes response validation and up to three attempts, with a delat between retires, to handle temporary failures.

To ensure uniqueness, I normalize and deduplicate the character-name bases, shuffle with Fisher-Yates and consumed in that orde. Each base is used once per round, so twho employees only share a base, with a different number, if employees outnumber the distinct bases. The menu warns when that happens.

**Execution and maintainability**

I organized the implementation into separate functions for validation, calculation, API access, alias generation, and spreadsheet updates.  The custom Validaciones menu exposes the Conteo and Alias actions through onOpen(), so users can execute the exercises directly from the spreadsheet without opening the script editor.

Throughout the implementation, I avoided spreadsheet formulas as required and prioritized efficient spreadsheet operations, input validation, and explicit error handling.

Best regards,
Cristian

### Decisions worth knowing

Short notes on how the hash count works and how aliases stay unique.

#### Has Count

- **Input cleaning:** each hash is converted to a string, trimmed and lowecased ('normilizeHash').
- **Explicit validation:** after cleaning, the hash must not be empty, must be exactly 50 characters long, and must contain only letters a-z.
- **Algorithm:** a single pass from left to right, tracking the current run length, whether the current run has a vowel, and the best valid length so far.
- **Run rule:** a run continues only while the next letter is strictly greater than the previous one. A repeated or smaller letter closes the run and starts a new one of length 1.
- **Vowel rule:** a run only counts if it contains a, e, i, o or u. Longer runs without a vowel are ignored (`acbcrxorzeh` gives 3, not 4).
- **Last run:** it is evaluated after the loop, since no later letter closes it.
- **No valid run:** if no run has a vowel, the function returns 0.
- **Invalid hashes:** they get the text `Invalid hash` in column E instead of 0, because 0 is a legitimate result. Each error is saved with its row number and reason, and one bad row does not stop the others.
- **Empty rows:** a row with no name and no hash is left empty in column E. A row with a name but an invalid or empty hash is reported as invalid.
- **Summary:** the menu shows how many hashes were processed and how many were invalid, with up to 10 rows and their reasons.
- **Timestamp:** B1 is updated at the end with `setDate`, because script writes do not fire the simple `onEdit` trigger.

#### Alias uniqueness

- **API data:** only the `name` field of each character is used. Names are trimmed and empty ones are discarded.
- **Retries:** the request is attempted up to 3 times with a 1.5 second pause between attempts. A non-200 response or an unexpected format counts as a failed attempt. After the third failure an error message is shown.
- **Alias format (`buildBase`):**
  - One word: the word itself (`Dobby`).
  - Two words: initial of the first word plus the second (`HGranger`).
  - Three or more words: initials of all words except the last, plus the last word (`SNdMimsy-Porpington`).
  - A random 2-digit number (10-99) is appended, and the result is always a string.
- **Note on 3+ words:** the code uses the last word, not the second one.
- **Extreme case:** a base is reused with a different number only when employees outnumber the distinct bases. The menu then shows a warning.
- **Exhaustion:** if a base runs out of numbers (90 per base), the script stops with an error instead of creating duplicates.
- **Assignment:** one alias is generated per row that has an employee name. They are assigned in the generated random order and written to column C from row 4 in a single `setValues` call. Rows without a name keep whatever was in C.
- **Re-running:** Alias regenerates the aliases of all rows that have an employee.
- **Randomness:** it uses `Math.random`, which is pseudo-random. That is enough for an identifier, but not for a secret.
- **Timestamp:** B1 is updated at the end with `setDate`.