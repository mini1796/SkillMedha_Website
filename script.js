// Initialize Feather Icons
feather.replace();

document.addEventListener('DOMContentLoaded', () => {
  // --- Get All Triggers and Panels ---
  const learnToggleButtons = document.querySelectorAll('.js-learn-toggle');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');

  const megaMenuPanel = document.getElementById('mega-menu-panel');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');
  const pageOverlay = document.getElementById('page-overlay');


  // --- Function to close all menus ---
  function closeAllMenus() {
    // Close mega-menu
    megaMenuPanel.classList.remove('is-open');
    learnToggleButtons.forEach(btn => btn.classList.remove('is-active'));

    // Close mobile menu
    mobileNavPanel.classList.remove('is-open');
    menuToggleBtn.classList.remove('is-open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');

    // Deactivate overlay
    pageOverlay.classList.remove('is-active');
  }


  // --- Learn Button Click Event (Mega-Menu) ---
  learnToggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      // Check if it's *already* open
      const isAlreadyOpen = megaMenuPanel.classList.contains('is-open');

      // 1. Close all menus first
      closeAllMenus();

      // 2. If it was NOT already open, open it
      if (!isAlreadyOpen) {
        megaMenuPanel.classList.add('is-open');
        pageOverlay.classList.add('is-active');
        learnToggleButtons.forEach(btn => btn.classList.add('is-active'));
      }
    });
  });


  // --- Mobile Hamburger Menu Click Event (CORRECTED) ---
  menuToggleBtn.addEventListener('click', () => {
    // --- FIX IS HERE ---
    // 1. Check if it's already open BEFORE closing
    const isAlreadyOpen = mobileNavPanel.classList.contains('is-open');

    // 2. Close all other menus (like the mega-menu)
    closeAllMenus();

    // 3. If it was NOT already open, open it
    if (!isAlreadyOpen) {
      mobileNavPanel.classList.add('is-open');
      menuToggleBtn.classList.add('is-open');
      menuToggleBtn.setAttribute('aria-expanded', 'true');
    }
    // If it *was* open, closeAllMenus() already handled it.
  });


  // --- Overlay Click Event (to close menus) ---
  pageOverlay.addEventListener('click', () => {
    closeAllMenus();
  });
});
// Carousel Navigation
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("learners-carousel-wrapper");
  const prevBtn = document.getElementById("learners-prev-btn");
  const nextBtn = document.getElementById("learners-next-btn");

  if (wrapper && prevBtn && nextBtn) {
    // Function to get the width of a single card
    const getScrollAmount = () => {
      // Get the first card in the carousel
      const firstCard = wrapper.querySelector(".testimonial-card");
      if (firstCard) {
        // Scroll by the card's width + the gap (20px)
        return firstCard.offsetWidth + 20;
      }
      return 300; // Fallback scroll amount
    };

    nextBtn.addEventListener("click", () => {
      const scrollAmount = getScrollAmount();
      wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      const scrollAmount = getScrollAmount();
      wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }
});
