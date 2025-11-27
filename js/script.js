const API_URL = "https://script.google.com/macros/s/AKfycbxKOcG9dKoiI9Gffs5SvUFxpOK6NndQ0YAiryGBEZ07XD4GxOtpqADtyCkYT-YjOhtjuA/exec"; // ← Update this!

const productGrid = document.getElementById("product-grid");

async function loadProducts() {
  try {
    const response = await fetch(API_URL + "?v=" + Date.now()); // cache buster
    const products = await response.json();

    if (!products || products.length === 0) {
      productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 80px; font-size: 1.4rem; color: #666;">
        No products yet — add some in your Google Sheet!
      </p>`;
      return;
    }

    productGrid.innerHTML = products.map(p => `
      <div class="shop-link">
        <h3>${p.title}</h3>
        <img src="${p.image}" 
             alt="${p.title}" 
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x240/cccccc/666666.png?text=Image+Not+Found'">
        <div class="price">$ ${parseFloat(p.price).toFixed(2)}</div>
        <a href="${p.link}">Shop now →</a>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">
      Failed to load products. Check your Apps Script URL.
    </p>`;
  }
}

loadProducts();
setInterval(loadProducts, 30000);
