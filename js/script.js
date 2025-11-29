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

  productGrid.innerHTML = products.map(p => `
    <div class="shop-link">
      <h3>${p[0]}</h3>
      <img src="${p[1]}" alt="${p[0]}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/300x240/ccc/666?text=No+Image'">
      <div class="price">${parseFloat(p[3] || 0).toLocaleString()} MKW</div>
      <div class="btn-group">
        <button onclick="addToCart({title:'${p[0]}', price:'${p[3]}', image:'${p[1]}'})">
          Add to Cart
        </button>
        <a href="product-detail.html?title=${encodeURIComponent(p[0])}">View Details →</a>
      </div>
    </div>
  `).join("");
}

// =============== CATEGORY FILTERS — FIXED FOR COLUMN F ===============
function createCategoryFilters() {
  document.querySelector(".category-filters")?.remove();

  const filterDiv = document.createElement("div");
  filterDiv.className = "category-filters";
  filterDiv.innerHTML = `
    <button data-category="all" class="cat-btn active">All</button>
    <button data-category="table" class="cat-btn">Tables</button>
    <button data-category="bed" class="cat-btn">Beds</button>
    <button data-category="door" class="cat-btn">Doors</button>
    <button data-category="sofa" class="cat-btn">Sofas</button>
    <button data-category="wardrobe" class="cat-btn">Wardrobes</button>
    <button data-category="other" class="cat-btn">Other</button>
  `;
  productGrid.before(filterDiv);

  filterDiv.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-btn");
    if (!btn) return;

    filterDiv.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const cat = btn.dataset.category;
    let filtered = allProducts;

    if (cat !== "all") {
      filtered = allProducts.filter(p => {
        const category = (p[5] || "").toString().trim().toLowerCase();
        return category === cat || category.includes(cat);
      });
    }

    displayProducts(filtered);
  });
}

// =============== SEARCH ===============
function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();
  let filtered = allProducts;

  if (query) {
    if (query.includes("under") || query.includes("below")) {
      const match = query.match(/(\d+)/);
      if (match) {
        const maxPrice = parseInt(match[0]) * (query.includes("million") ? 1000000 : 1000);
        filtered = allProducts.filter(p => parseFloat(p[3]) <= maxPrice);
      }
    } else {
      filtered = allProducts.filter(p => p[0].toLowerCase().includes(query));
    }
  }
  displayProducts(filtered);
}

// =============== LOAD PRODUCTS ===============
async function loadProducts() {
  try {
    const res = await fetch(API_URL + "?t=" + Date.now());
    if (!res.ok) throw new Error("Check Google Apps Script deployment");
    allProducts = await res.json();

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:100px;color:#666;">No products in sheet — add data!</p>`;
      return;
    }

    displayProducts(allProducts);
    createCategoryFilters(); // ← Always creates buttons

  } catch (err) {
    console.error(err);
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:100px;color:#B12704;">Failed to load products.<br><small>${err.message}</small></p>`;
  }
}

// =============== START ===============
loadProducts();
searchInput?.addEventListener("input", filterProducts);
setInterval(loadProducts, 120000);
