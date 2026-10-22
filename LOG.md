# Challenge submission

> Copy this file to `LOG.md` and complete it before you submit.

**Candidate name: Cristian Arana**  
**Date completed:**

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
When a user added a product to the cart the site sent information that Google Analytics could not use for reports, so we changed that. We transformed data into the standard format,
so the ecommerce reports in Google Analytics can use it.
We also added the 21% of tax to each product and to the total value. For example if a product has a unit price of USD 7, the tax will be USD 1.47 and the total value
of one unit is USD 8.47. We did it by taking data from the site already sends,  without changing the site's code and without entering products one by one.
**Newsletter Subscription**
Before these changes, we could only count clicks on the button, without knowing whether there was an error or the subscription was succesfull.
Now we record every outcome of the signup. This let us know the real subscription rate and see whether many users  makes mistakes, such as typing the email in the wrong
format or leaving the field empty. With this we can improve the form.

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

**Google Sheet URL:**  

### Email to the client developer

Paste the email from Exercise 4.

### Decisions worth knowing

Short notes on how the hash count works and how aliases stay unique.
