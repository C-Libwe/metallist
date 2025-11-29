// =============== CONFIGURATION ===============
const API_URL = "https://script.google.com/macros/s/AKfycbw0IPBkqhQQHsBWTupVWjBxSfihwqptZAxS1MSDQDa1SqW-gOh4mJdJxz8XVZ0fUqzpJA/exec";
let allProducts = [];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("searchInput");

// =============== CART FUNCTIONS ===============
function getCart() { return JSON.parse(localStorage.getItem("cart") || "[]"); }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(i => i.title === product.title);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  alert(`${product.title} added to cart!`);
}

// =============== DISPLAY PRODUCTS ===============
function displayProducts(products) {
  if (!products || products.length === 0) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:100px;color:#666;">No products found.</p>`;
    return;
  }

  productGrid.innerHTML = products.map(row => {
    const title = (row[0] || "Untitled").toString().trim();
    const image = (row[1] || "https://via.placeholder.com/300x240/ccc/666?text=No+Image").toString().trim();
    const price = parseFloat(row[3] || 0);
    const category = (row[5] || "other").toString().trim().toLowerCase();

    return `
      <div class="shop-link" data-category="${category}">
        <img src="${image}" alt="${title}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x240/ccc/666?text=No+Image'">
        <h3>${title}</h3>
        <div class="price">${price.toLocaleString()} MKW</div>
        <div class="btn-group">
          <button onclick="addToCart({title:'${title.replace(/'/g, "\\'")}', price:'${price}', image:'${image}'})">
            Add to Cart
          </button>
          <a href="product-detail.html?title=${encodeURIComponent(title)}">View Details</a>
        </div>
      </div>
    `;
  }).join("");
}

// =============== DYNAMIC CATEGORY FILTERS FROM COLUMN F ===============
function createCategoryFilters() {
  document.querySelector(".category-filters")?.remove();

  // Extract unique categories from Column F
  const categories = [...new Set(allProducts.map(row => (row[5] || "Other").toString().trim()))];
  const sortedCategories = categories.sort((a, b) => a.localeCompare(b));

  const filterDiv = document.createElement("div");
  filterDiv.className = "category-filters";

  let buttonsHTML = `<button data-category="all" class="cat-btn active">All</button>`;
  sortedCategories.forEach(cat => {
    const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
    buttonsHTML += `<button data-category="${cat.toLowerCase()}" class="cat-btn">${displayName}</button>`;
  });

  filterDiv.innerHTML = buttonsHTML;
  productGrid.before(filterDiv);

  // Filter logic
  filterDiv.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-btn");
    if (!btn) return;

    filterDiv.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const selected = btn.dataset.category;

    document.querySelectorAll(".shop-link").forEach(card => {
      const cardCat = card.dataset.category;
      card.style.display = (selected === "all" || cardCat === selected) ? "block" : "none";
    });
  });
}

// =============== SEARCH ===============
function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();

  document.querySelectorAll(".shop-link").forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(query) ? "block" : "none";
  });
}

// =============== LOAD PRODUCTS ===============
async function loadProducts() {
  try {
    const res = await fetch(API_URL + "?t=" + Date.now());
    if (!res.ok) throw new Error("Check Google Apps Script");
    allProducts = await res.json();

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:100px;color:#666;">Add products to your sheet!</p>`;
      return;
    }

    displayProducts(allProducts);
    createCategoryFilters();

  } catch (err) {
    console.error(err);
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:100px;color:#B12704;">Failed to load products.</p>`;
  }
}

// =============== START ===============
loadProducts();
searchInput?.addEventListener("input", filterProducts);
setInterval(loadProducts, 120000);
