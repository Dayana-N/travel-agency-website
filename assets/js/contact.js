const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  formFeedback.textContent = `Thank you ${name}! Your enquiry has recieved and we will be in touch via ${email} `;
  formFeedback.className = "form-success";
  contactForm.reset();
});
