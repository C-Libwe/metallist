// ===== CONFIGURATION =====
const API_URL = "https://script.google.com/macros/s/AKfycbwXS0GSFmKnzHIplECt3vUs1yzSebsi2g_rJKsYN3SjfQOl8sdutLdl68mvmT_eXXmlqg/exec";
const WHATSAPP_NUMBER = "265995783419";

const detailImg = document.getElementById("detailImg");
const detailTitle = document.getElementById("detailTitle");
const detailPrice = document.getElementById("detailPrice");
const detailDesc = document.getElementById("detailDesc");
const addToCartBtn = document.getElementById("addToCartBtn");
const whatsappBtn = document.querySelector(".whatsapp-float");
const whatsappLink = document.getElementById("whatsapp-link");

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

async function loadProductDetail() {
  try {
    const res = await fetch(API_URL + "?t=" + Date.now());
    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    const products = await res.json();
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("No products in sheet");
    }

    const params = new URLSearchParams(window.location.search);
    let requestedTitle = decodeURIComponent(params.get("title") || "").trim();

    let product = products.find(p => 
      p.title?.trim().toLowerCase() === requestedTitle.toLowerCase()
    );

    if (!product && requestedTitle) {
      product = products.find(p => 
        p.title?.trim().toLowerCase().includes(requestedTitle.toLowerCase())
      );
    }

    if (!product && products.length > 0) product = products[0];

    if (!product) throw new Error("Product not found");

    detailImg.src = product.image || "https://via.placeholder.com/600x600/eee/666?text=No+Image";
    detailImg.alt = product.title;
    detailTitle.textContent = product.title;
    detailPrice.textContent = parseFloat(product.price || 0).toLocaleString() + " MKW";

    // REPLACED — Now uses real description from Column E only
    detailDesc.textContent = (product.description || "").trim() || "No description available.";

    addToCartBtn.onclick = () => addToCart({
      title: product.title,
      price: product.price,
      image: product.image
    });

    // REPLACED — WhatsApp uses real description
    whatsappBtn.onclick = () => {
      const descPreview = (product.description || "").trim()
        ? (product.description.split('\n')[0].substring(0, 120) + "...")
        : "Please send me more details!";
       
      const message = `Hi Metallist Furniture!\n\nI'm interested in:\n${product.title}\nPrice: ${parseFloat(product.price || 0).toLocaleString()} MKW\n\n${descPreview}\n\nPlease contact me!`;
      whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      whatsappLink.click();
    };

  } catch (err) {
    console.error("Detail load error:", err);
    document.querySelector(".detail-container").innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:120px;color:#B12704;">
        <h2>Product Not Loading</h2>
        <p>Please check your connection and try again.</p>
        <a href="index.html" style="color:#28a745;font-weight:600;">Back to Shop</a>
      </div>`;
  }
}

loadProductDetail();
