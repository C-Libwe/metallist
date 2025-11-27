// =============== CART SYSTEM – FINAL FIXED VERSION ===============
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// Save cart & update badge EVERYWHERE
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  // Update badge on THIS page
  if (cartCount) cartCount.textContent = totalItems;
  // Also update badge on other pages (index.html, detail.html) if they exist
  document.querySelectorAll("#cartCount").forEach(el => el.textContent = totalItems);
}

// Update quantity
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

// Remove item
function removeItem(title) {
  if (confirm("Remove this item from cart?")) {
    let cart = getCart();
    cart = cart.filter(i => i.title !== title);
    saveCart(cart);
    renderCart();
  }
}

// Render all cart items
function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <p style="text-align:center;padding:80px;color:#666;font-size:1.3rem;">
        Your cart is empty.<br><br>
        <a href="index.html" style="color:#28a745;font-weight:600;font-size:1.1rem;">Continue Shopping</a>
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

// =============== RUN ON PAGE LOAD ===============
renderCart();           // Show items immediately
saveCart(getCart());    // Update badge number right away
