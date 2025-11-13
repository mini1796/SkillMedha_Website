document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Initialize Feather Icons ---
    try {
        feather.replace();
    } catch (e) {
        console.warn("Feather icons not found.");
    }

    // --- 2. Influencer Carousel Logic ---
    const track = document.getElementById("influencer-track");

    // Check if the track exists
    if (track) {
        const slides = Array.from(track.children);
        let currentSlide = 0;
        const slideInterval = 5000; // 5 seconds

        const changeSlide = () => {
            // Get the current and next slide indexes
            const lastSlide = slides.length - 1;
            const nextSlide = currentSlide === lastSlide ? 0 : currentSlide + 1;

            // Fade out the current slide
            slides[currentSlide].classList.remove("is-active");

            // Fade in the next slide
            slides[nextSlide].classList.add("is-active");

            // Update the current slide index
            currentSlide = nextSlide;
        };

        // Start the automatic slideshow
        setInterval(changeSlide, slideInterval);
    }
});