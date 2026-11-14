/* ==========================================================
   Mini Canteen Billing System - script.js

   This file follows the same idea as the Java program:
     Java Scanner      ->  quantity boxes and buttons on the page
     Java switch-case  ->  getItem() function below
     default: Invalid  ->  "Invalid choice" message
     price * qty       ->  Total Bill = Item Price x Quantity
   ========================================================== */

// ---------- Settings and variables ----------
const MAX_QTY = 99;        // largest quantity allowed for one item
let order = [];            // the current bill: a list of {choice, name, emoji, price, qty}
let toastTimer = null;     // used to hide the message box after a few seconds

// ---------- Page elements ----------
const menuGrid     = document.getElementById("menuGrid");
const orderList    = document.getElementById("orderList");
const emptyNote    = document.getElementById("emptyNote");
const grandTotalEl = document.getElementById("grandTotal");
const generateBtn  = document.getElementById("generateBtn");
const printBtn     = document.getElementById("printBtn");
const clearBtn     = document.getElementById("clearBtn");
const billSection  = document.getElementById("billSection");
const billBody     = document.getElementById("billBody");
const billDate     = document.getElementById("billDate");
const billTotal    = document.getElementById("billTotal");
const billJavaLine = document.getElementById("billJavaLine");
const toast        = document.getElementById("toast");


/* ----------------------------------------------------------
   1. SWITCH-CASE: find the food item for a choice number
      (same as switch(ch) in the Java program)
   ---------------------------------------------------------- */
function getItem(choice) {
  let name = "";
  let emoji = "";
  let price = 0;

  switch (choice) {
    case 1:
      name = "Tea";
      emoji = "☕";
      price = 10;
      break;
    case 2:
      name = "Dosa";
      emoji = "🥞";
      price = 30;
      break;
    case 3:
      name = "Juice";
      emoji = "🥤";
      price = 20;
      break;
    default:
      // Same as: default: System.out.println("Invalid choice");
      return null;
  }

  return { choice: choice, name: name, emoji: emoji, price: price };
}


/* ----------------------------------------------------------
   2. VALIDATION: check the quantity typed by the user
   ---------------------------------------------------------- */
function checkQuantity(text) {
  const value = String(text).trim();

  if (value === "") {
    return { ok: false, message: "Please enter a quantity." };
  }

  const qty = Number(value);

  if (!Number.isInteger(qty)) {
    return { ok: false, message: "Quantity must be a whole number (like 1, 2, 3)." };
  }
  if (qty < 1) {
    return { ok: false, message: "Quantity must be at least 1." };
  }
  if (qty > MAX_QTY) {
    return { ok: false, message: "Quantity cannot be more than " + MAX_QTY + "." };
  }

  return { ok: true, qty: qty };
}


/* ----------------------------------------------------------
   3. CALCULATION: Total Bill = Item Price x Quantity
   ---------------------------------------------------------- */
function lineTotal(line) {
  return line.price * line.qty;
}

function grandTotal() {
  let total = 0;
  for (let i = 0; i < order.length; i++) {
    total = total + lineTotal(order[i]);
  }
  return total;
}

function money(amount) {
  return "₹" + amount;
}


/* ----------------------------------------------------------
   4. MESSAGE BOX (errors and confirmations)
   ---------------------------------------------------------- */
function showMessage(text, type) {
  toast.textContent = text;
  toast.className = "toast no-print " + type;   // type is "success" or "error"
  toast.hidden = false;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.hidden = true;
  }, 3500);
}


/* ----------------------------------------------------------
   5. ADD / CHANGE / REMOVE ITEMS
   ---------------------------------------------------------- */
function addToBill(choice) {
  const item = getItem(choice);
  const qtyInput = document.getElementById("qty-" + choice);

  // Invalid choice (the "default" case)
  if (item === null) {
    showMessage("Invalid choice. Please select Tea, Dosa or Juice.", "error");
    return;
  }

  // Invalid quantity
  const result = checkQuantity(qtyInput.value);
  if (!result.ok) {
    qtyInput.classList.add("invalid");
    showMessage(result.message, "error");
    return;
  }
  qtyInput.classList.remove("invalid");

  // If the item is already on the bill, increase its quantity
  const existing = findInOrder(choice);
  if (existing) {
    if (existing.qty + result.qty > MAX_QTY) {
      showMessage("You can order at most " + MAX_QTY + " of one item.", "error");
      return;
    }
    existing.qty = existing.qty + result.qty;
  } else {
    item.qty = result.qty;
    order.push(item);
  }

  qtyInput.value = 1;   // reset the card for the next order
  orderChanged();
  showMessage(result.qty + " × " + item.name + " added to the bill.", "success");
}

function findInOrder(choice) {
  for (let i = 0; i < order.length; i++) {
    if (order[i].choice === choice) {
      return order[i];
    }
  }
  return null;
}

function changeOrderQty(choice, change) {
  const line = findInOrder(choice);
  if (!line) {
    return;
  }
  const newQty = line.qty + change;

  if (newQty < 1 || newQty > MAX_QTY) {
    return;   // the buttons are disabled in these cases, this is just a safety check
  }
  line.qty = newQty;
  orderChanged();
}

function removeFromOrder(choice) {
  order = order.filter(function (line) {
    return line.choice !== choice;
  });
  orderChanged();
}

// Called every time the order changes
function orderChanged() {
  billSection.hidden = true;   // the old bill is no longer correct, so hide it
  showOrder();
}


/* ----------------------------------------------------------
   6. SHOW THE CURRENT ORDER ON THE PAGE
   ---------------------------------------------------------- */
function showOrder() {
  orderList.innerHTML = "";
  emptyNote.hidden = order.length > 0;

  order.forEach(function (line) {
    const row = document.createElement("li");
    row.className = "order-row";
    row.dataset.choice = line.choice;

    row.innerHTML =
      '<div class="order-name">' +
        '<span class="order-emoji" aria-hidden="true">' + line.emoji + '</span>' +
        '<div><strong>' + line.name + '</strong>' +
        '<span class="order-price">' + money(line.price) + ' each</span></div>' +
      '</div>' +
      '<div class="qty-control">' +
        '<button type="button" class="qty-btn" data-action="order-minus" aria-label="Decrease quantity of ' + line.name + '"' +
          (line.qty <= 1 ? ' disabled' : '') + '>−</button>' +
        '<span class="qty-value">' + line.qty + '</span>' +
        '<button type="button" class="qty-btn" data-action="order-plus" aria-label="Increase quantity of ' + line.name + '"' +
          (line.qty >= MAX_QTY ? ' disabled' : '') + '>+</button>' +
      '</div>' +
      '<div class="order-total">' + money(lineTotal(line)) + '</div>' +
      '<button type="button" class="remove-btn" data-action="remove" aria-label="Remove ' + line.name + ' from the bill">✕</button>';

    orderList.appendChild(row);
  });

  grandTotalEl.textContent = money(grandTotal());
}


/* ----------------------------------------------------------
   7. GENERATE, CLEAR AND PRINT THE BILL
   ---------------------------------------------------------- */
function generateBill() {
  // Empty order
  if (order.length === 0) {
    billSection.hidden = true;
    showMessage("Your order is empty. Add at least one item to generate a bill.", "error");
    return false;
  }

  let html = "";
  order.forEach(function (line) {
    html +=
      '<div class="bill-line">' +
        '<span>' + line.name + '</span>' +
        '<span>' + money(line.price) + ' × ' + line.qty + '</span>' +
        '<span>' + money(lineTotal(line)) + '</span>' +
      '</div>';
  });

  const total = grandTotal();
  billBody.innerHTML = html;
  billTotal.textContent = money(total);
  billJavaLine.textContent = "Total Bill = Rs." + total;   // same style as the Java output
  billDate.textContent = new Date().toLocaleString("en-IN");

  billSection.hidden = false;
  billSection.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function clearBill() {
  if (order.length === 0 && billSection.hidden) {
    showMessage("The bill is already empty.", "error");
    return;
  }

  order = [];
  billSection.hidden = true;
  showOrder();

  // Reset the quantity boxes on the menu cards
  const inputs = document.querySelectorAll(".qty-input");
  inputs.forEach(function (input) {
    input.value = 1;
    input.classList.remove("invalid");
  });

  showMessage("Bill cleared. You can start a new order.", "success");
}

function printBill() {
  if (order.length === 0) {
    showMessage("Nothing to print. Add items and generate the bill first.", "error");
    return;
  }

  // Make sure the bill on screen is up to date before printing
  if (billSection.hidden) {
    generateBill();
  }
  window.print();
}


/* ----------------------------------------------------------
   8. BUTTON CLICKS
   ---------------------------------------------------------- */

// Clicks on the menu cards: - , + and Add to Bill
menuGrid.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const card = button.closest(".food-card");
  const choice = Number(card.dataset.choice);
  const qtyInput = document.getElementById("qty-" + choice);
  const action = button.dataset.action;

  if (action === "card-minus" || action === "card-plus") {
    const current = checkQuantity(qtyInput.value);
    let qty = current.ok ? current.qty : 1;   // an invalid box goes back to 1

    if (action === "card-minus" && qty > 1) {
      qty = qty - 1;
    }
    if (action === "card-plus" && qty < MAX_QTY) {
      qty = qty + 1;
    }
    qtyInput.value = qty;
    qtyInput.classList.remove("invalid");
  }

  if (action === "add") {
    addToBill(choice);
  }
});

// Clicks inside the current order: - , + and remove
orderList.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const row = button.closest(".order-row");
  const choice = Number(row.dataset.choice);
  const action = button.dataset.action;

  if (action === "order-minus") {
    changeOrderQty(choice, -1);
  } else if (action === "order-plus") {
    changeOrderQty(choice, 1);
  } else if (action === "remove") {
    removeFromOrder(choice);
  }
});

// Remove the red border as soon as the user edits the quantity again
menuGrid.addEventListener("input", function (event) {
  if (event.target.classList.contains("qty-input")) {
    event.target.classList.remove("invalid");
  }
});

generateBtn.addEventListener("click", generateBill);
clearBtn.addEventListener("click", clearBill);
printBtn.addEventListener("click", printBill);

// Show the empty order message when the page opens
showOrder();
