// ============== CONFIGURATION ==============
const WHATSAPP_NUMBER = "265995783419"; // ← CHANGE TO YOUR REAL NUMBER

// ============== ELEMENTS ==============
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const cartCountElements = document.querySelectorAll("#cartCount");
const deliveryCitySelect = document.getElementById("deliveryCity");
const checkoutBtn = document.getElementById("checkoutBtn");
const whatsappFloat = document.querySelector(".whatsapp-float");
const whatsappLink = document.getElementById("whatsapp-link");

// ============== CART FUNCTIONS ==============
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountElements.forEach(el => el.textContent = totalItems);
}

function updateQuantity(title, change) {
  let cart = getCart();
  const item = cart.find(i => i.title === title);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.title !== title);
    }
    saveCart(cart);
    renderCart();
  }
}

function removeItem(title) {
  if (confirm("Remove this item from cart?")) {
    let cart = getCart();
    cart = cart.filter(i => i.title !== title);
    saveCart(cart);
    renderCart();
  }
}

// ============== RENDER CART ==============
function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <p class="empty-cart">
        Your cart is empty. <a href="index.html">Continue Shopping</a>
      </p>`;
    cartTotalSpan.textContent = "0 MKW";
    return;
  }

  cartItemsDiv.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
      <div class="cart-item-info">
        <h3>${item.title}</h3>
        <p class="cart-price">${parseFloat(item.price).toLocaleString()} MKW each</p>
      </div>
      <div class="cart-actions">
        <button onclick="updateQuantity('${item.title.replace(/'/g, "\\'")}', -1)">−</button>
        <span class="qty">${item.qty}</span>
        <button onclick="updateQuantity('${item.title.replace(/'/g, "\\'")}', 1)">+</button>
        <button class="remove-btn" onclick="removeItem('${item.title.replace(/'/g, "\\'")}')">Remove</button>
      </div>
      <div class="item-total">
        ${(item.price * item.qty).toLocaleString()} MKW
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotalSpan.textContent = total.toLocaleString() + " MKW";
}

// ============== WHATSAPP CHECKOUT ==============
function sendOrderToWhatsApp() {
  const city = deliveryCitySelect.value;
  const total = cartTotalSpan.textContent;

  const items = Array.from(document.querySelectorAll(".cart-item")).map(item => {
    const title = item.querySelector("h3").textContent;
    const qty = item.querySelector(".qty").textContent;
    const subtotal = item.querySelector(".item-total").textContent;
    return `${title} × ${qty} = ${subtotal}`;
  }).join("\n");

  const message = items
    ? `Hi Metallist Furniture! I'd like to place this order:\n\n${items}\n\nTotal: ${total}\nDelivery to: ${city}\n\nPlease confirm and arrange delivery. Thank you!`
    : `Hi! I'm ready to order from your catalog.\nDelivery to: ${city}\nPlease contact me.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
}

// ============== EVENT LISTENERS ==============
checkoutBtn.addEventListener("click", sendOrderToWhatsApp);
whatsappFloat.addEventListener("click", sendOrderToWhatsApp);

// ============== START ==============
renderCart();
saveCart(getCart()); // Update badge on load
