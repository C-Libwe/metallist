// js/cart-sync.js — Shared cart count update for ALL pages
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("#cartCount").forEach(el => {
    el.textContent = total || "0";
  });
}

// Run on load + when storage changes (works across tabs)
document.addEventListener("DOMContentLoaded", updateCartCount);
window.addEventListener("storage", updateCartCount);
setInterval(updateCartCount, 2000); // Fallback
