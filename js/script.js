// =============== CONFIGURATION ===============
const API_URL = "https://script.google.com/macros/s/AKfycbw0IPBkqhQQHsBWTupVWjBxSfihwqptZAxS1MSDQDa1SqW-gOh4mJdJxz8XVZ0fUqzpJA/exec"; // ← CHANGE THIS!
let allProducts = [];  // Stores all products from Google Sheet

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");

// =============== PRICE FORMAT ===============
function formatPrice(amount) {
  if (!amount) return "Price on request";
  return parseFloat(amount).toLocaleString('en-US') + " MKW";
}

// =============== LOAD CART FROM LOCALSTORAGE ===============
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

// =============== ADD TO CART ===============
function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(item => item.title === product.title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  alert(`${product.title} added to cart!`);
}

// =============== DISPLAY PRODUCTS ===============
function displayProducts(products) {
  if (products.length === 0) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:80px;color:#666;">
      No products found. Try another search.
    </p>`;
    return;
  }

  productGrid.innerHTML = products.map(p => `
    <div class="shop-link">
      <h3>${p.title}</h3>
      <img src="${p.image}" alt="${p.title}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/300x240/ccc/666?text=No+Image'">
      <div class="price">${formatPrice(p.price)}</div>
      <button onclick="addToCart({title:'${p.title}', price:'${p.price}', image:'${p.image}'})">
        Add to Cart
      </button>
      <a href="product-detail.html?title=${encodeURIComponent(p.title)}">View Details →</a>
    </div>
  `).join("");
}

// =============== SEARCH FUNCTION ===============
function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();
  let filtered = allProducts;

  // Search by title
  if (query && !query.includes("under") && !query.includes("below")) {
    filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
  }

  // Price search: "under 1000000" or "below 1 million"
  if (query.includes("under") || query.includes("below")) {
    const match = query.match(/(\d+)/);
    if (match) {
      const maxPrice = parseInt(match[0]) * (query.includes("million") ? 1000000 : 1000);
      filtered = allProducts.filter(p => parseFloat(p.price) <= maxPrice);
    }
  }

  displayProducts(filtered);
}

// =============== LOAD PRODUCTS FROM GOOGLE SHEET ===============
async function loadProducts() {
  try {
    const res = await fetch(API_URL + "?t=" + Date.now());
    allProducts = await res.json();
    displayProducts(allProducts);
    saveCart(getCart()); // Update cart count
  } catch (err) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#B12704;">
      Connection issue – retrying in 10s…
    </p>`;
    setTimeout(loadProducts, 10000);
  }
}

// =============== START ===============
loadProducts();
searchInput.addEventListener("input", filterProducts);
setInterval(loadProducts, 120000); // Refresh every 2 mins
