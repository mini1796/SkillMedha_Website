feather.replace();

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".logo-tab-btn");
    const items = document.querySelectorAll(".testimonial-item");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let currentIndex = 0;
    const totalItems = items.length;

    const showTestimonial = (index) => {
        // Handle Loop
        if (index < 0) index = totalItems - 1;
        if (index >= totalItems) index = 0;

        currentIndex = index;

        // 1. Activate Tab
        tabs.forEach(tab => tab.classList.remove("active"));
        if (tabs[currentIndex]) tabs[currentIndex].classList.add("active");

        // 2. Activate Slide (CSS Grid Stack handles visibility)
        items.forEach((item, i) => {
            if (i === currentIndex) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    };

    // Click Events
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => showTestimonial(index));
    });

    if (prevBtn) prevBtn.addEventListener("click", () => showTestimonial(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => showTestimonial(currentIndex + 1));

    // Video Modal Logic (Keep your existing one)
    // ...
});