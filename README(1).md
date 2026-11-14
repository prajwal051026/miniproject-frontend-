# Mini Canteen Billing System

A simple college mini-project frontend for a **Mini Canteen Billing System**.

The original project is a basic Java program that shows a canteen menu, lets the user choose a food item, asks for the quantity, and calculates the total bill. This website shows the **same idea** as a small, friendly web page built with HTML, CSS and JavaScript.

> **Note:** This website is **not connected** to the Java program. It is a separate frontend, written in JavaScript, that uses the same menu, the same prices and the same billing logic as the Java project.

---

## Menu

| Choice | Item  | Price |
|:------:|-------|------:|
| 1      | ☕ Tea   | ₹10 |
| 2      | 🥞 Dosa  | ₹30 |
| 3      | 🥤 Juice | ₹20 |

**Formula:** `Total Bill = Item Price × Quantity`
Example: Dosa ₹30 × 3 = ₹90

---

## Technologies Used

- **HTML5**: page structure
- **CSS3**: styling and responsive layout
- **JavaScript (plain)**: menu selection, calculation, validation and printing

No frameworks, no backend, no database and no paid APIs.

---

## Features

- Three food cards: Tea, Dosa and Juice, each with an emoji, price, quantity selector and **Add to Bill** button
- Add several different items to one bill
- Increase or decrease the quantity of each item in the current order
- Remove an item from the order
- Automatic total for each item and an automatic **Grand Total**
- **Generate Bill** shows a neat bill summary with items, quantities, prices and the final amount
- **Print Bill** prints only the bill
- **Clear Bill** starts a new order
- Validation and error messages:
  - Quantity left empty
  - Quantity that is not a whole number (for example 2.5)
  - Quantity less than 1
  - Quantity more than 99
  - Empty order when generating or printing a bill
  - Invalid food choice (the `default` case of the Java `switch`)
- Responsive design for mobile and desktop

---

## How the Website Matches the Java Program

| Java program | This website |
|--------------|--------------|
| `Scanner` for user input | Quantity boxes and buttons |
| `switch-case` for food selection | `getItem()` function in `script.js` uses a `switch` |
| Variables `price` and `qty` | JavaScript variables `price` and `qty` |
| `price * qty` | `line.price * line.qty` |
| `default:` "Invalid choice" | Invalid choice message |
| `Total Bill = Rs.90` | Final line of the generated bill |

---

## File Structure

```
mini-canteen-billing-system/
├── index.html    # Page structure (header, menu, order, bill)
├── style.css     # All styling and responsive design
├── script.js     # Menu selection, totals, validation, bill, print
└── README.md     # Project documentation
```

---

## How to Run Locally

1. Download or clone the project folder.
2. Make sure `index.html`, `style.css` and `script.js` are in the **same folder**.
3. Double-click `index.html` to open it in any modern browser (Chrome, Edge, Firefox).

No installation is needed.

---

## How to Upload to GitHub

### Option 1: Using the GitHub website

1. Sign in to [github.com](https://github.com) and click **New repository**.
2. Give it a name, for example `mini-canteen-billing-system`, keep it **Public**, and click **Create repository**.
3. Click **uploading an existing file**.
4. Drag and drop all four files: `index.html`, `style.css`, `script.js` and `README.md`.
5. Click **Commit changes**.

### Option 2: Using Git commands

```bash
git init
git add index.html style.css script.js README.md
git commit -m "Add Mini Canteen Billing System frontend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mini-canteen-billing-system.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## How to Deploy with GitHub Pages

1. Open your repository on GitHub.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the **main** branch and the **/ (root)** folder, then click **Save**.
5. Wait one or two minutes, then refresh the page. GitHub shows your website link:

```
https://YOUR-USERNAME.github.io/mini-canteen-billing-system/
```

Make sure `index.html` is in the root of the repository, not inside another folder.

---

## Future Enhancements

Ideas from the project presentation for a larger version:

- Add more food items
- Add discounts
- Save customer billing details

---

## Project Type

Java Mini Project: Mini Canteen Billing System (college project).
