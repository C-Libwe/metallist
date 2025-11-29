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
      <h3>${p.title || "Untitled"}</h3>
      <img src="${p.image}" alt="${p.title}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/300x240/ccc/666?text=No+Image'">
      <div class="price">${parseFloat(p.price || 0).toLocaleString()} MKW</div>
      <div class="btn-group">
        <button onclick="addToCart({title:'${p.title}', price:'${p.price}', image:'${p.image}'})">
          Add to Cart
        </button>
        <a href="product-detail.html?title=${encodeURIComponent(p.title)}">View Details →</a>
      </div>
    </div>
  `).join("");
}

// =============== CATEGORY + SORTING BAR (NEW) ===============
function createCategoryAndSort() {
  document.querySelector(".category-filters")?.remove();

  const filterDiv = document.createElement("div");
  filterDiv.className = "category-filters";
  filterDiv.innerHTML = `
    <div class="filter-group">
      <button data-category="all" class="cat-btn active">All</button>
      <button data-category="table" class="cat-btn">Tables</button>
      <button data-category="bed" class="cat-btn">Beds</button>
      <button data-category="door" class="cat-btn">Doors</button>
      <button data-category="sofa" class="cat-btn">Sofas</button>
      <button data-category="other" class="cat-btn">Other</button>
    </div>

    <select id="sortSelect" class="sort-select">
      <option value="default">Sort by</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="name-az">Name: A to Z</option>
      <option value="name-za">Name: Z to A</option>
    </select>
  `;
  productGrid.before(filterDiv);

  const sortSelect = filterDiv.querySelector("#sortSelect");

  // Category filter
  filterDiv.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-btn");
    if (!btn) return;

    filterDiv.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;
    let filtered = allProducts;

    if (category !== "all") {
      filtered = allProducts.filter(p => p.title.toLowerCase().includes(category));
    }

    applySorting(filtered);
  });

  // Sorting
  sortSelect.addEventListener("change", () => applySorting(allProducts));
}

// Apply current sorting
function applySorting(products) {
  const sortValue = document.getElementById("sortSelect")?.value || "default";
  let sorted = [...products];

  switch (sortValue) {
    case "price-low":
      sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price-high":
      sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case "name-az":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-za":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  displayProducts(sorted);
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
        filtered = allProducts.filter(p => parseFloat(p.price) <= maxPrice);
      }
    } else {
      filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
    }
  }
  applySorting(filtered);
}

// =============== LOAD PRODUCTS ===============
async function loadProducts() {
  try {
    const res = await fetch(API_URL + "?t=" + Date.now());
    if (!res.ok) throw new Error("Network error");
    allProducts = await res.json();
    displayProducts(allProducts);
    createCategoryAndSort();
    saveCart(getCart());
  } catch (err) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:red;padding:80px;">Failed to load products. Retrying...</p>`;
    setTimeout(loadProducts, 10000);
  }
}

// =============== START ===============
loadProducts();
searchInput.addEventListener("input", filterProducts);
setInterval(loadProducts, 120000);
