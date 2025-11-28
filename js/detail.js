// ===== CONFIGURATION =====
const API_URL = "https://script.google.com/macros/s/AKfycbw0IPBkqhQQHsBWTupVWjBxSfihwqptZAxS1MSDQDa1SqW-gOh4mJdJxz8XVZ0fUqzpJA/exec";
const WHATSAPP_NUMBER = "265995783419";

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

// ===== MAIN FUNCTION =====
async function loadProductDetail() {
  try {
    console.log("Fetching products...");
    const response = await fetch(API_URL + "?t=" + Date.now());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const products = await response.json();
    console.log("Products loaded:", products);

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("No products in sheet");
    }

    // Get requested title
    const params = new URLSearchParams(window.location.search);
    let requestedTitle = decodeURIComponent(params.get("title") || "").trim();
    console.log("Looking for:", requestedTitle);

    // Find product (exact match first)
    let product = products.find(p => 
      p.title && p.title.trim().toLowerCase() === requestedTitle.toLowerCase()
    );

    // Fallback: partial match
    if (!product) {
      product = products.find(p => 
        p.title && p.title.trim().toLowerCase().includes(requestedTitle.toLowerCase())
      );
    }

    // Final fallback: first product (for testing)
    if (!product) {
      console.warn("No match — using first product");
      product = products[0];
    }

    // SUCCESS — Show product
    detailImg.src = product.image || "https://via.placeholder.com/600x600/eee/666?text=No+Image";
    detailImg.alt = product.title;
    detailTitle.textContent = product.title;
    detailPrice.textContent = parseFloat(product.price || 0).toLocaleString() + " MKW";
    if (product.description) {
      detailDesc.textContent = product.description;
    } else {
      detailDesc.textContent = "High-quality handcrafted furniture made in Malawi. Durable, stylish, and built to last.";
    }

    // Add to Cart
    addToCartBtn.onclick = () => addToCart({
      title: product.title,
      price: product.price,
      image: product.image
    });

    // WhatsApp
    whatsappBtn.onclick = () => {
      const message = `Hi Metallist Furniture!\n\nI'm interested in:\n${product.title}\nPrice: ${parseFloat(product.price).toLocaleString()} MKW\n\nPlease contact me!`;
      whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      whatsappLink.click();
    };

    saveCart(getCart());

  } catch (err) {
    console.error("Error:", err);
    document.querySelector(".detail-container").innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:120px 20px;color:#B12704;">
        <h2>Failed to Load Product</h2>
        <p>Open browser console (F12) and send me the error.</p>
        <a href="index.html" style="color:#28a745;font-weight:600;">Back to Shop</a>
      </div>`;
  }
}

// ===== START =====
loadProductDetail();
