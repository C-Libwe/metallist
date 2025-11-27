function getCart() { return JSON组件.parse(localStorage.getItem("cart") || "[]"); }

function updateCart() {
  const cart = getCart();
  const itemsDiv = document.getElementById("cartItems");
  const totalDiv = document.getElementById("cartTotal");

  if (cart.length === 0) {
    itemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.textContent = "Total: 0 MKW";
    return;
  }

  itemsDiv.innerHTML = cart.map(item => `
    <div style="display:flex;gap:20px;margin:20px 0;padding:15px;background:white;border-radius:10px;align-items:center;">
      <img src="${item.image}" style="width:100px;height:100px;object-fit:contain;">
      <div style="flex:1;">
        <h3>${item.title}</h3>
        <p>Price: ${parseFloat(item.price).toLocaleString()} MKW</p>
        <p>Qty: ${item.qty} 
          <button onclick="changeQty('${item.title}', 1)">+</button>
          <button onclick="changeQty('${item.title}', -1)">-</button>
          <button onclick="removeFromCart('${item.title}')" style="margin-left:10px;color:red;">Remove</button>
        </p>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalDiv.textContent = `Total: ${total.toLocaleString()} MKW`;
}

function changeQty(title, change) {
  let cart = getCart();
  const item = cart.find(i => i.title === title);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) cart = cart.filter(i => i.title !== title);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }
}

function removeFromCart(title) {
  let cart = getCart().filter(i => i.title !== title);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

updateCart();
