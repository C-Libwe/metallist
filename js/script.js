const API_URL = "https://script.google.com/macros/s/AKfycbw0IPBkqhQQHsBWTupVWjBxSfihwqptZAxS1MSDQDa1SqW-gOh4mJdJxz8XVZ0fUqzpJA/exec"; // ← make sure this is correct!

const productGrid = document.getElementById("product-grid");

// Format MKW prices with commas
function formatPrice(amount) {
  if (!amount || isNaN(amount)) return "Price on request";
  const num = parseFloat(amount);
  return num.toLocaleString('en-US') + " MKW";
}

async function loadProducts() {
  // Show loading only the first time or when really empty
  if (!productGrid.dataset.loaded) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:60px;font-size:1.2rem;color:#666;">
      Loading your products…
    </p>`;
  }

  try {
    const response = await fetch(API_URL + "?t=" + Date.now()); // bypass cache
    if (!response.ok) throw new Error("Network error");

    const products = await response.json();

    if (!products || products.length === 0) {
      productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:80px;font-size:1.4rem;color:#666;">
        No products yet — add some in your Google Sheet!
      </p>`;
      return;
    }

    productGrid.dataset.loaded = "true";

    productGrid.innerHTML = products.map(p => `
      <div class="shop-link">
        <h3>${p.title || "Untitled"}</h3>
        <img src="${p.image}" 
             alt="${p.title}" 
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x240/ccc/666?text=No+Image'">
        <div class="price">${formatPrice(p.price)}</div>
        <a href="${p.link}">View Details →</a>
      </div>
    `).join("");

  } catch (err) {
    // Only show error if it’s been loaded successfully before
    if (productGrid.dataset.loaded) {
      productGrid.innerHTML += `<p style="grid-column:1/-1;text-align:center;color:#B12704;margin:20px;">
        Temporary connection issue – retrying…
      </p>`;
    }
    console.log("Retrying in 10 seconds…", err);
  }
}

// Load immediately
loadProducts();

// Refresh quietly every 2 minutes instead of every 30 seconds → no more sudden failures
setInterval(loadProducts, 120000);   // ← changed from 30000 to 120000
