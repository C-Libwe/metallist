const API_URL = "https://script.google.com/macros/s/AKfycbw0IPBkqhQQHsBWTupVWjBxSfihwqptZAxS1MSDQDa1SqW-gOh4mJdJxz8XVZ0fUqzpJA/exec";
let allProducts = [];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("searchInput");

// Get & save cart
function getCart() { return JSON.parse(localStorage.getItem("cart") || "[]"); }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

// Add to cart
function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(i => i.title === product.title);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  alert(`${product.title} added to cart!`);
}

// Display products
function displayProducts(products) {
  if (!products || products.length === 0) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:80px;color:#666;">No products found.</p>`;
    return;
  }

  productGrid.innerHTML = products.map(p => `
    <div class="shop-link">
      <h3>${p.title}</h3>
      <img src="${p.image}" alt="${p.title}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/300x240/ccc/666?text=No+Image'">
      <div class="price">${parseFloat(p.price || 0).toLocaleString()} MKW</div>
      <button onclick="addToCart({title:'${p.title}', price:'${p.price}', image:'${p.image}'})">
        Add to Cart
      </button>
      <a href="product-detail.html?title=${encodeURIComponent(p.title)}">View Details →</a>
    </div>
  `).join("");
}

// Search
function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();
  let filtered = allProducts;

  if (query && !query.includes("under") && !query.includes("below")) {
    filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
  }

  if (query.includes("under") || query.includes("below")) {
    const match = query.match(/(\d+)/);
    if (match) {
      const maxPrice = parseInt(match[0]) * (query.includes("million") ? 1000000 : 1000);
      filtered = allProducts.filter(p => parseFloat(p.price) <= maxPrice);
    }
  }

  displayProducts(filtered);
}

// Load products
async function loadProducts() {
  try {
    const res = await fetch(API_URL + "?t=" + Date.now());
    allProducts = await res.json();
    displayProducts(allProducts);
  } catch (err) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:red;padding:80px;">Failed to load products. Retrying...</p>`;
    setTimeout(loadProducts, 5000);
  }
}

// Start
loadProducts();
searchInput?.addEventListener("input", filterProducts);
