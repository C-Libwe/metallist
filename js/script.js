// UPDATE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjvZA5nt-WNwsumACcg8JWbG3UYFSrNgy7IxMFSHQURvtXHItmFv8pZsndP7E11UWmtJbBOAC23yJoTDzG8MVYzuIWBTvgyjYZ-JKRYW9CqhgwlkwG10slYpPR1tf0zQm-CQ_ZRV0xirDgJyirp5F9Fwtre1VwQhEPpFNHvNNwM56haaTLsiT136yzqcBVETFqv0YUidg9wTd6cyRgpTBNPh0Md7IY1d_DdwpQZR-ppBnZUTq5kvaAwF7Q1ZBP2HeZC3vqBSSGDWZtUey-08nDWbhbMXujmCqLEod6l&lib=Mvt3PtsE9hzNyhrF7BChjtY9z8IzyyUkm";

const productGrid = document.getElementById("product-grid");

async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    if (!products || products.length === 0) {
      productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:60px;font-size:1.3rem;">
        No products found. Add some in your Google Sheet!
      </p>`;
      return;
    }

    productGrid.innerHTML = products.map(p => `
      <div class="shop-link">
        <h3>${p.title || "Untitled Product"}</h3>
        <img src="${p.image || 'https://via.placeholder.com/300x240?text=No+Image'}" 
             alt="${p.title}" onerror="this.src='https://via.placeholder.com/300x240?text=Image+Not+Found'">
        <a href="${p.link || '#'}">Shop now →</a>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:red;">
      Error loading products. Check console (F12).
    </p>`;
  }
}

// Load on start + auto-refresh every 30 seconds (optional)
loadProducts();
setInterval(loadProducts, 30000);
