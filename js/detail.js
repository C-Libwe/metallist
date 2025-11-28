async function loadProductDetail() {
  try {
    console.log("Fetching from API...");
    const response = await fetch(API_URL + "?t=" + Date.now());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const products = await response.json();
    console.log("Products received:", products);  // ← Check this in browser console!

    // Decode and clean the requested title
    const params = new URLSearchParams(window.location.search);
    let requestedTitle = decodeURIComponent(params.get("title") || "").trim();

    // DEBUG: Show what we're searching for
    console.log("Looking for title:", requestedTitle);

    // Try exact match first
    let product = products.find(p => 
      p.title && p.title.trim().toLowerCase() === requestedTitle.toLowerCase()
    );

    // If not found, try partial match
    if (!product) {
      product = products.find(p => 
        p.title && p.title.trim().toLowerCase().includes(requestedTitle.toLowerCase())
      );
    }

    // FINAL FALLBACK: Use first product if nothing matches (for testing)
    if (!product && products.length > 0) {
      console.warn("No match found — using first product as fallback");
      product = products[0];
    }

    if (!product) {
      throw new Error("No products in sheet");
    }

    // SUCCESS — Populate
    detailImg.src = product.image || "https://via.placeholder.com/600x600/eee/666?text=No+Image";
    detailImg.alt = product.title;
    detailTitle.textContent = product.title;
    detailPrice.textContent = parseFloat(product.price || 0).toLocaleString() + " MKW";
    if (product.description) detailDesc.textContent = product.description;

    addToCartBtn.onclick = () => addToCart({
      title: product.title,
      price: product.price,
      image: product.image
    });

    whatsappBtn.onclick = () => {
      const message = `Hi Metallist Furniture!\n\nI'm interested in:\n${product.title}\nPrice: ${parseFloat(product.price).toLocaleString()} MKW\n\nPlease contact me!`;
      whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      whatsappLink.click();
    };

    saveCart(getCart());

  } catch (err) {
    console.error("Detail page error:", err);
    document.querySelector(".detail-container").innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:120px 20px;color:#B12704;">
        <h2>Product Not Loading</h2>
        <p>Open browser console (F12) and send me the logs.</p>
        <a href="index.html" style="color:#28a745;font-weight:600;">Back to Shop</a>
      </div>`;
  }
}
