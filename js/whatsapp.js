// js/whatsapp.js — Shared WhatsApp Button for EVERY page
const WHATSAPP_NUMBER = "265995783419"; // Your number

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".whatsapp-float");
  const link = document.getElementById("whatsapp-link");

  if (!btn || !link) return; // Safety check

  btn.addEventListener("click", () => {
    // Try to get cart info (only exists on cart page)
    const city = document.getElementById("deliveryCity")?.value || "Malawi";
    const total = document.getElementById("cartTotal")?.textContent || "";
    const items = Array.from(document.querySelectorAll(".cart-item h3"))
      .map(h => h.textContent)
      .join("\n");

    let message = "Hi Metallist Furniture!\n\n";

    if (items) {
      // On cart page — send full order
      message += `My Order:\n${items}\nTotal: ${total}\nDelivery: ${city}\n\nPlease confirm and arrange delivery!`;
    } else {
      // On index, detail, contact — general inquiry
      const pageTitle = document.title || "";
      message += `I'm on your website (${pageTitle}) and interested in your furniture.\nPlease contact me!`;
    }

    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    link.click();
  });
});
