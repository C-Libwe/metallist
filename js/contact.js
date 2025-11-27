// FREE Email Service — Sign up at https://www.emailjs.com (takes 2 minutes)
emailjs.init("YOUR_PUBLIC_KEY"); // ← Get this free from EmailJS

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const templateParams = {
    from_name: document.getElementById("name").value,
    from_phone: document.getElementById("phone").value,
    from_email: document.getElementById("email").value || "No email",
    message: document.getElementById("message").value
  };

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    .then(() => {
      alert("Thank you! Your message has been sent. We'll reply soon!");
      document.getElementById("contactForm").reset();
    }, (error) => {
      alert("Failed to send. Please WhatsApp us directly.");
      console.error(error);
    });
});
