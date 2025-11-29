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

// =============== DISPLAY PRODUCTS — BULLETPROOF IMAGE LOADING ===============
function displayProducts(products) {
  if (!products || products.length === 0) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:100px;color:#666;font-size:1.2rem;">No products found.</p>`;
    return;
  }

  productGrid.innerHTML = products.map(row => {
    const title = row[0]?.toString().trim() || "Untitled Product";
    const rawImage = row[1]?.toString().trim();
    const price = parseFloat(row[3] || 0);
    const category = (row[5]?.toString().trim() || "other").toLowerCase();

    // Double fallback image
    const fallbackImage = "https://via.placeholder.com/300x240/eeeeee/999999?text=No+Image";
    const finalImage = rawImage && rawImage.includes("http") ? rawImage : fallbackImage;

    return `
      <div class="shop-link" data-category="${category}">
        <div class="image-container">
          <img src="${finalImage}" 
               alt="${title}" 
               loading="lazy"
               onerror="this.onerror=null; this.src='${fallbackImage}'; this.style.opacity='0.8';">
        </div>
        <h3>${title}</h3>
        <div class="price">${price.toLocaleString()} MKW</div>
        <div class="btn-group">
          <button onclick="addToCart({title:'${title.replace(/'/g, "\\'")}', price:'${price}', image:'${finalImage}'})">
            Add to Cart
          </button>
          <a href="product-detail.html?title=${encodeURIComponent(title)}">View Details</a>
        </div>
      </div>
    `;
  }).join("");
}

// =============== CATEGORY FILTERS — WORKS WITH COLUMN F ===============
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

    document.querySelectorAll(".shop-link").forEach(card => {
      const cardCat = card.dataset.category;
      card.style.display = (cat === "all" || cardCat.includes(cat)) ? "block" : "none";
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
    if (!res.ok) throw new Error("Check Google Apps Script Web App URL");
    allProducts = await res.json();

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:100px;color:#666;">Add products to your Google Sheet!</p>`;
      return;
    }

    displayProducts(allProducts);
    createCategoryFilters();

  } catch (err) {
    console.error("Load error:", err);
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:100px;color:#B12704;">Failed to load products.<br>Please check your connection.</p>`;
  }
}

// =============== START ===============
loadProducts();
searchInput?.addEventListener("input", filterProducts);
setInterval(loadProducts, 120000);
