document.addEventListener("DOMContentLoaded", () => {
  // Function to fetch and load a component
  const loadComponent = async (url, placeholderId) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Could not load ${url}: ${response.statusText}`);
      }
      const html = await response.text();
      document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
      console.warn(error);
    }
  };

  // Load header and footer, THEN run all scripts
  const loadAllComponents = async () => {
    // Wait for both header and footer to be loaded
    await Promise.all([
      loadComponent("components/header.html", "header-placeholder"),
      loadComponent("components/footer.html", "footer-placeholder"),
    ]);

    // --- All HTML is now loaded, run all component-specific scripts ---

    // 1. Initialize Feather Icons
    try {
      feather.replace();
    } catch (e) {
      console.warn("Feather icons not found.");
    }

    // 2. Initialize Header/Menu JavaScript
    const learnToggleButtons = document.querySelectorAll(".js-learn-toggle");
    const menuToggleBtn = document.getElementById("menu-toggle-btn");
    const megaMenuPanel = document.getElementById("mega-menu-panel");
    const mobileNavPanel = document.getElementById("mobile-nav-panel");
    const pageOverlay = document.getElementById("page-overlay");

    // Check if all header elements were found
    if (
      learnToggleButtons.length > 0 &&
      menuToggleBtn &&
      megaMenuPanel &&
      mobileNavPanel &&
      pageOverlay
    ) {
      // Function to close all menus
      const closeAllMenus = () => {
        megaMenuPanel.classList.remove("is-open");
        learnToggleButtons.forEach((btn) => btn.classList.remove("is-active"));

        mobileNavPanel.classList.remove("is-open");
        menuToggleBtn.classList.remove("is-open");
        menuToggleBtn.setAttribute("aria-expanded", "false");

        pageOverlay.classList.remove("is-active");
      };

      // Learn Button Click Event (Mega-Menu)
      learnToggleButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const isAlreadyOpen = megaMenuPanel.classList.contains("is-open");
          closeAllMenus();
          if (!isAlreadyOpen) {
            megaMenuPanel.classList.add("is-open");
            pageOverlay.classList.add("is-active");
            learnToggleButtons.forEach((btn) => btn.classList.add("is-active"));
          }
        });
      });

      // Mobile Hamburger Menu Click Event
      menuToggleBtn.addEventListener("click", () => {
        const isAlreadyOpen = mobileNavPanel.classList.contains("is-open");
        closeAllMenus();
        if (!isAlreadyOpen) {
          mobileNavPanel.classList.add("is-open");
          menuToggleBtn.classList.add("is-open");
          menuToggleBtn.setAttribute("aria-expanded", "true");
        }
      });

      // Overlay Click Event
      pageOverlay.addEventListener("click", () => {
        closeAllMenus();
      });
    } // End of header scripts

    // 3. Initialize Advantage Carousel
    const advantageWrapper = document.getElementById(
      "advantage-carousel-wrapper"
    );
    const advantagePrevBtn = document.getElementById("advantage-prev-btn");
    const advantageNextBtn = document.getElementById("advantage-next-btn");

    if (advantageWrapper && advantagePrevBtn && advantageNextBtn) {
      const getAdvantageScrollAmount = () => {
        const firstCard = advantageWrapper.querySelector(".advantage-card");
        if (firstCard) {
          return firstCard.offsetWidth + 20; // Card width + gap
        }
        return 300;
      };

      advantageNextBtn.addEventListener("click", () => {
        const scrollAmount = getAdvantageScrollAmount();
        advantageWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });

      advantagePrevBtn.addEventListener("click", () => {
        const scrollAmount = getAdvantageScrollAmount();
        advantageWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });
    } // End of Advantage carousel scripts

    // 4. Initialize Learners Carousel
    const learnersWrapper = document.getElementById(
      "learners-carousel-wrapper"
    );
    const learnersPrevBtn = document.getElementById("learners-prev-btn");
    const learnersNextBtn = document.getElementById("learners-next-btn");

    if (learnersWrapper && learnersPrevBtn && learnersNextBtn) {
      const getLearnersScrollAmount = () => {
        const firstCard = learnersWrapper.querySelector(".testimonial-card");
        if (firstCard) {
          return firstCard.offsetWidth + 20; // Card width + gap
        }
        return 300;
      };

      learnersNextBtn.addEventListener("click", () => {
        const scrollAmount = getLearnersScrollAmount();
        learnersWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });

      learnersPrevBtn.addEventListener("click", () => {
        const scrollAmount = getLearnersScrollAmount();
        learnersWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });
    } // End of Learners carousel scripts

  }; // End of loadAllComponents function

  // Run the main function
  loadAllComponents();
});

// 5. Initialize "Show More" Button
const showMoreBtn = document.getElementById("show-more-btn");
const hiddenItems = document.querySelectorAll(".hidden-item");

if (showMoreBtn && hiddenItems.length > 0) {
  showMoreBtn.addEventListener("click", () => {
    // Toggle visibility of hidden items
    hiddenItems.forEach(item => {
      // Check current display style and toggle
      const isHidden = item.style.display === "none" || item.style.display === "";
      item.style.display = isHidden ? "flex" : "none";
    });

    // Change button text and icon
    if (showMoreBtn.innerText.includes("Show more")) {
      showMoreBtn.innerHTML = 'Show less <i data-feather="chevron-up"></i>';
    } else {
      showMoreBtn.innerHTML = 'Show more <i data-feather="chevron-down"></i>';
    }

    // Re-run Feather Icons to render the new icon
    try {
      feather.replace();
    } catch (e) {
      console.warn("Feather icons not found.");
    }
  });
} // End of Show More scripts