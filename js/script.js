const API_URL = "https://script.google.com/macros/s/AKfycbzsBHfCVMC1fFCGc8dQ0WxjtOgGfO-poX7mRJI2ahtynhrsLeiSr66OdaOw6cDGUzSjFQ/exec"; // ← Update if needed

const productGrid = document.getElementById("product-grid");

// Function to format price with commas + MKW
function formatPrice(amount) {
  if (!amount || isNaN(amount)) return "Price on request";
  const num = parseFloat(amount);
  return num.toLocaleString('en-US', { minimumFractionDigits: 0 }) + " MKW";
}

async function loadProducts() {
  try {
    const response = await fetch(API_URL + "?t=" + Date.now());
    const products = await response.json();

    if (!products || products.length === 0) {
      productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:80px;font-size:1.4rem;color:#666;">
        No products yet — add some in your Google Sheet!
      </p>`;
      return;
    }

    productGrid.innerHTML = products.map(p => `
      <div class="shop-link">
        <h3>${p.title || "Untitled"}</h3>
        <img src="${p.image}" 
             alt="${p.title}" 
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x240/cccccc/666?text=No+Image'">
        <div class="price">${formatPrice(p.price)}</div>
        <a href="${p.link}">View Details →</a>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:red;padding:50px;">
      Failed to load products. Check your API URL.
    </p>`;
  }
}

loadProducts();
setInterval(loadProducts, 30000);
