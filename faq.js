document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      const answer = item.querySelector(".faq-answer");

      // 1. Toggle Active Class
      item.classList.toggle("active");

      // 2. Control Max-Height for Smooth Slide Animation
      if (item.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }

      // 3. Optional: Close other items when one is opened (Accordion behavior)
      closeOtherFaqs(item);
    });
  });

  // Helper function to close siblings
  function closeOtherFaqs(currentItem) {
    const allItems = document.querySelectorAll(".faq-item");
    allItems.forEach((item) => {
      if (item !== currentItem && item.classList.contains("active")) {
        item.classList.remove("active");
        item.querySelector(".faq-answer").style.maxHeight = null;
      }
    });
  }
});
