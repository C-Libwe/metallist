const WHATSAPP_NUMBER = "265995783419";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".whatsapp-float");
  const link = document.getElementById("whatsapp-link");
  if (!btn || !link) return;

  btn.addEventListener("click", () => {
    const city = document.getElementById("deliveryCity")?.value || "Malawi";
    const total = document.getElementById("cartTotal")?.textContent || "";
    const items = Array.from(document.querySelectorAll(".cart-item h3"))
      .map(h => h.textContent).join("\n");

    let message = "Hi Metallist Furniture!\n\n";
    if (items) {
      message += `My Order:\n${items}\nTotal: ${total}\nDelivery: ${city}\n\nPlease confirm!`;
    } else {
      message += "I'm interested in your furniture.\nPlease contact me!";
    }

    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    link.click();
  });
});
