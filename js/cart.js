const WHATSAPP_NUMBER = "265995783419";

const cartItemsDiv = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const deliveryCitySelect = document.getElementById("deliveryCity");
const checkoutBtn = document.getElementById("checkoutBtn");
const whatsappFloat = document.querySelector(".whatsapp-float");

function getCart() { return JSON.parse(localStorage.getItem("cart") || "[]"); }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

function updateQuantity(title, change) {
  let cart = getCart();
  const item = cart.find(i => i.title === title);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) cart = cart.filter(i => i.title !== title);
    saveCart(cart);
    renderCart();
  }
}

function removeItem(title) {
  if (confirm("Remove this item?")) {
    let cart = getCart();
    cart = cart.filter(i => i.title !== title);
    saveCart(cart);
    renderCart();
  }
}

function renderCart() {
  const cart = getCart();
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p class="empty-cart">Your cart is empty. <a href="index.html">Continue Shopping</a></p>`;
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
      <div class="item-total">${(item.price * item.qty).toLocaleString()} MKW</div>
    </div>
  `).join("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartTotalSpan.textContent = total.toLocaleString() + " MKW";
}

function sendToWhatsApp() {
  const city = deliveryCitySelect.value;
  const total = cartTotalSpan.textContent;
  const items = Array.from(document.querySelectorAll(".cart-item")).map(item => {
    const title = item.querySelector("h3").textContent;
    const qty = item.querySelector(".qty").textContent;
    const subtotal = item.querySelector(".item-total").textContent;
    return `${title} × ${qty} = ${subtotal}`;
  }).join("\n");

  const message = items
    ? `Hi Metallist Furniture!\n\nOrder:\n${items}\n\nTotal: ${total}\nDelivery: ${city}\n\nPlease confirm!`
    : `Hi! I'd like to order from your catalog.\nDelivery: ${city}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
}

checkoutBtn.addEventListener("click", sendToWhatsApp);
whatsappFloat.addEventListener("click", sendToWhatsApp);

renderCart();
