// Initialize Feather Icons
feather.replace();

document.addEventListener("DOMContentLoaded", () => {
    const accordionItems = document.querySelectorAll(".accordion-item");
    const modal = document.getElementById("videoModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalIframe = document.getElementById("videoModalIframe");
    const previewTriggers = document.querySelectorAll(".js-video-preview");
    const expandAllBtn = document.getElementById("expandAllBtn");

    let allExpanded = false; // Track state for "Expand All"
    const originalVideoSrc = modalIframe ? modalIframe.src : "";

    // --- 1. Accordion Logic ---
    accordionItems.forEach(item => {
        const header = item.querySelector(".accordion-header");
        const content = item.querySelector(".accordion-content");
        const icon = header.querySelector("i");

        header.addEventListener("click", () => {
            const isOpen = item.classList.contains("is-open");

            // Close all others (optional, for true accordion)
            // accordionItems.forEach(i => {
            //    i.classList.remove("is-open");
            //    i.querySelector(".accordion-content").style.display = "none";
            //    i.querySelector(".accordion-header i").setAttribute("data-feather", "chevron-down");
            // });

            if (isOpen) {
                item.classList.remove("is-open");
                content.style.display = "none";
                icon.setAttribute("data-feather", "chevron-down");
            } else {
                item.classList.add("is-open");
                content.style.display = "block";
                icon.setAttribute("data-feather", "chevron-up");
            }
            feather.replace(); // Redraw icon
        });
    });

    // --- 2. Expand All Logic ---
    if (expandAllBtn) {
        expandAllBtn.addEventListener("click", () => {
            allExpanded = !allExpanded; // Toggle state

            accordionItems.forEach(item => {
                const content = item.querySelector(".accordion-content");
                const icon = item.querySelector(".accordion-header i");

                if (allExpanded) {
                    item.classList.add("is-open");
                    content.style.display = "block";
                    icon.setAttribute("data-feather", "chevron-up");
                } else {
                    item.classList.remove("is-open");
                    content.style.display = "none";
                    icon.setAttribute("data-feather", "chevron-down");
                }
            });

            expandAllBtn.textContent = allExpanded ? "Collapse all sections" : "Expand all sections";
            feather.replace(); // Redraw all icons
        });
    }

    // --- 3. Video Modal Logic ---
    if (modal && modalCloseBtn && modalIframe && previewTriggers.length) {

        const openModal = () => {
            modal.classList.add("is-open");
            // Optional: Autoplay video. Note: May be blocked by browsers.
            // modalIframe.src = originalVideoSrc + "?autoplay=1";
        };

        const closeModal = () => {
            modal.classList.remove("is-open");
            // Stop the video by resetting its src
            modalIframe.src = originalVideoSrc;
        };

        previewTriggers.forEach(trigger => {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                openModal();
            });
        });

        modalCloseBtn.addEventListener("click", closeModal);
        modalOverlay.addEventListener("click", closeModal);
    }

});