// ===== CONFIGURATION — CHANGE THESE =====
const API_URL = "https://script.google.com/macros/s/AKfycb...YOUR_FULL_ID.../exec"; // YOUR REAL URL HERE!
const WHATSAPP_NUMBER = "265XXXXXXXXX"; // YOUR REAL WHATSAPP NUMBER

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

    // Find product (case-insensitive + trim)
    const product = products.find(p =>
      p.title && requestedTitle &&
      p.title.trim().toLowerCase() === requestedTitle.toLowerCase()
    );

    if (!product) {
      document.querySelector(".detail-container").innerHTML =
        `<h2 style="grid-column:1/-1;text-align:center;padding:100px;color:#999;">
          Product not found.<br><br>
          <a href="index.html" style="color:#28a745;font-weight:600;">Back to Shop</a>
        </h2>`;
      return;
    }

    // Populate page
    detailImg.src = product.image || "https://via.placeholder.com/500x500/eee/666?text=No+Image";
    detailTitle.textContent = product.title;
    detailPrice.textContent = parseFloat(product.price || 0).toLocaleString() + " MKW";
    if (product.description) detailDesc.textContent = product.description;

    // Enable Add to Cart
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
    document.querySelector(".detail-container").innerHTML =
      `<h2 style="grid-column:1/-1;text-align:center;padding:100px;color:#B12704;">
        Failed to load product.<br><br>Please check your connection.
      </h2>`;
  }
}

// ===== START =====
loadProductDetail();
