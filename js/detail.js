// ===== CONFIGURATION — CHANGE THESE =====
const API_URL = "https://script.google.com/macros/s/AKfycbw0IPBkqhQQHsBWTupVWjBxSfihwqptZAxS1MSDQDa1SqW-gOh4mJdJxz8XVZ0fUqzpJA/exec";
const WHATSAPP_NUMBER = "265995783419"; // YOUR REAL WHATSAPP NUMBER

// ===== ELEMENTS =====
const detailImg = document.getElementById("detailImg");
const detailTitle = document.getElementById("detailTitle");
const detailPrice = document.getElementById("detailPrice");
const detailDesc = document.getElementById("detailDesc");
const addToCartBtn = document.getElementById("addToCartBtn");
const cartCountElements = document.querySelectorAll("#cartCount");
const whatsappBtn = document.querySelector(".whatsapp-float");
const whatsappLink = document.getElementById("whatsapp-link");

// ===== CART FUNCTIONS =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountElements.forEach(el => el.textContent = totalItems);
}
function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(i => i.title === product.title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  alert(`${product.title} added to cart!`);
}

// ===== LOAD PRODUCT FROM URL PARAMETER =====
const params = new URLSearchParams(window.location.search);
let requestedTitle = decodeURIComponent(params.get("title") || "").trim();

async function loadProductDetail() {
  try {
    const response = await fetch(API_URL + "?t=" + Date.now());
    if (!response.ok) throw new Error("Network error");
    const products = await response.json();

    // FIXED: More robust product matching (exact + partial fallback)
    let product = products.find(p => 
      p.title && requestedTitle && 
      p.title.trim().toLowerCase() === requestedTitle.toLowerCase()
    );

    // Fallback: partial match if exact fails
    if (!product && requestedTitle) {
      product = products.find(p => 
        p.title && p.title.trim().toLowerCase().includes(requestedTitle.toLowerCase())
      );
    }

    // If still not found — show clean message
    if (!product) {
      document.querySelector(".detail-container").innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:120px 20px;color:#666;">
          <h2>Product not found</h2>
          <p>The item may have been removed or the link is incorrect.</p>
          <a href="index.html" style="color:#28a745;font-weight:600;margin-top:20px;display:inline-block;">Back to Shop</a>
        </div>`;
      return;
    }

    // SUCCESS: Populate page
    detailImg.src = product.image || "https://via.placeholder.com/600x600/eee/666?text=No+Image";
    detailImg.alt = product.title;
    detailTitle.textContent = product.title;
    detailPrice.textContent = parseFloat(product.price || 0).toLocaleString() + " MKW";
    if (product.description) {
      detailDesc.textContent = product.description;
    }

    // Add to Cart button
    addToCartBtn.onclick = () => addToCart({
      title: product.title,
      price: product.price,
      image: product.image
    });

    // WhatsApp button
    whatsappBtn.onclick = () => {
      const message = `Hi Metallist Furniture!\n\nI'm interested in:\n${product.title}\nPrice: ${parseFloat(product.price).toLocaleString()} MKW\n\nPlease contact me!`;
      whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      whatsappLink.click();
    };

    // Update cart count
    saveCart(getCart());

  } catch (err) {
    console.error("Load failed:", err);
    document.querySelector(".detail-container").innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:120px 20px;color:#B12704;">
        <h2>Failed to load product</h2>
        <p>Please check your internet connection and try again.</p>
        <a href="index.html" style="color:#28a745;font-weight:600;margin-top:20px;display:inline-block;">Back to Shop</a>
      </div>`;
  }
}

// ===== START =====
loadProductDetail();
