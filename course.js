// 1111111111. show more button functionality in "what you will learn" section

document.addEventListener("DOMContentLoaded", () => {
    const showMoreBtn = document.getElementById("show-more-btn");
    const hiddenItems = document.querySelectorAll(".hidden-item");
    let isExpanded = false;

    if (showMoreBtn) {
        showMoreBtn.addEventListener("click", () => {
            isExpanded = !isExpanded;

            // 1. Toggle Visibility
            hiddenItems.forEach(item => {
                if (isExpanded) {
                    item.classList.add("is-visible");
                } else {
                    item.classList.remove("is-visible");
                }
            });

            // 2. Update Button Text & Icon
            if (isExpanded) {
                showMoreBtn.innerHTML = `Show less <i data-feather="chevron-up"></i>`;
            } else {
                showMoreBtn.innerHTML = `Show more <i data-feather="chevron-down"></i>`;
            }

            // 3. Re-render the new Feather icon
            feather.replace();
        });
    }
});







// 2222222222. course structure accordion functionality, expand and more sections, preview video modal

document.addEventListener("DOMContentLoaded", () => {

    // --- SELECTORS ---
    const accordionItems = document.querySelectorAll(".accordion-item");
    const expandAllBtn = document.getElementById("expandAllBtn");
    const showMoreBtn = document.getElementById("showMoreSectionsBtn");
    const hiddenSections = document.querySelectorAll(".accordion-item.hidden-section");

    // Modal Selectors
    const modal = document.getElementById("videoModal");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const videoFrame = document.getElementById("videoFrame");
    const previewButtons = document.querySelectorAll(".js-video-preview");

    let allExpanded = false;
    let sectionsRevealed = false;

    // --- 1. INDIVIDUAL ACCORDION TOGGLE ---
    accordionItems.forEach(item => {
        const header = item.querySelector(".accordion-header");
        header.addEventListener("click", () => {
            // Toggle class for smooth animation and rotation
            item.classList.toggle("is-open");
        });
    });

    // --- 2. EXPAND / COLLAPSE ALL ---
    if (expandAllBtn) {
        expandAllBtn.addEventListener("click", () => {
            allExpanded = !allExpanded;
            expandAllBtn.textContent = allExpanded ? "Collapse all sections" : "Expand all sections";

            accordionItems.forEach(item => {
                if (allExpanded) {
                    item.classList.add("is-open");
                } else {
                    item.classList.remove("is-open");
                }
            });
        });
    }

    // --- 3. SHOW MORE / HIDE SECTIONS ---
    if (showMoreBtn && hiddenSections.length > 0) {
        // Initialize Text
        const count = hiddenSections.length;
        showMoreBtn.textContent = `${count} more sections`;

        showMoreBtn.addEventListener("click", () => {
            sectionsRevealed = !sectionsRevealed;

            if (sectionsRevealed) {
                // Show Items
                hiddenSections.forEach(el => el.classList.add("force-show"));
                showMoreBtn.textContent = "Hide sections";
            } else {
                // Hide Items
                hiddenSections.forEach(el => el.classList.remove("force-show"));
                showMoreBtn.textContent = `${count} more sections`;

                // Optional: Collapse them when re-hiding so they aren't open next time
                hiddenSections.forEach(el => el.classList.remove("is-open"));
            }
        });
    } else if (showMoreBtn) {
        // If no hidden sections, hide button
        showMoreBtn.style.display = "none";
    }

    // --- 4. VIDEO MODAL LOGIC ---
    const openModal = (videoId) => {
        // For demo, using a Rick Roll. In production, use `videoId` to fetch real URL.
        // const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        const videoUrl = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`;

        videoFrame.src = videoUrl;
        modal.classList.add("active");
    };

    const closeModal = () => {
        modal.classList.remove("active");
        videoFrame.src = ""; // Stop video playback
    };

    previewButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent accordion from toggling
            const videoId = btn.getAttribute("data-video-id");
            openModal(videoId);
        });
    });

    if (modalOverlay) modalOverlay.addEventListener("click", closeModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
});









// 3333333333. sidebar functionality
document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // 1. VIDEO MODAL LOGIC
    // ==============================
    const videoModal = document.getElementById("videoModal");
    const videoIframe = document.getElementById("videoModalIframe");
    const videoTriggers = document.querySelectorAll(".js-video-preview");
    const videoCloseBtn = document.getElementById("modalCloseBtn");
    const videoOverlay = document.getElementById("modalOverlay");

    const openVideoModal = (videoId) => {
        // Set source only when opening to load video
        videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        videoModal.classList.add("active");
    };

    const closeVideoModal = () => {
        videoModal.classList.remove("active");
        videoIframe.src = ""; // Stop video audio
    };

    videoTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const videoId = trigger.getAttribute("data-video-id");
            openVideoModal(videoId);
        });
    });

    if (videoCloseBtn) videoCloseBtn.addEventListener("click", closeVideoModal);
    if (videoOverlay) videoOverlay.addEventListener("click", closeVideoModal);


    // ==============================
    // 2. TAB SWITCHING LOGIC
    // ==============================
    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");

    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Remove active class from all links and contents
            tabLinks.forEach(l => l.classList.remove("is-active"));
            tabContents.forEach(c => {
                c.classList.remove("active");
                c.style.display = "none"; // Ensure CSS display is toggled
            });

            // Activate clicked link
            link.classList.add("is-active");

            // Show corresponding content
            const targetId = `tab-content-${link.getAttribute("data-tab")}`;
            const targetContent = document.getElementById(targetId);
            targetContent.style.display = "block";
            // Small timeout to allow display:block to apply before adding opacity class
            setTimeout(() => targetContent.classList.add("active"), 10);
        });
    });


    // ==============================
    // 3. COUPON LOGIC
    // ==============================
    const couponInput = document.getElementById("couponInput");
    const couponBtn = document.getElementById("couponBtn");
    const couponMsg = document.getElementById("couponMessage");
    const priceDisplay = document.getElementById("coursePrice");

    const VALID_COUPON = "MEDHA100";
    const DISCOUNT_AMOUNT = 100;
    let isCouponApplied = false;

    couponBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission refresh

        if (isCouponApplied) {
            couponMsg.textContent = "Coupon already applied!";
            couponMsg.className = "coupon-msg error";
            return;
        }

        const enteredCode = couponInput.value.trim().toUpperCase();

        if (enteredCode === VALID_COUPON) {
            // Parse current price (remove ₹ and commas if any)
            let currentPrice = parseInt(priceDisplay.textContent.replace(/[^0-9]/g, ''));

            // Calculate new price
            let newPrice = currentPrice - DISCOUNT_AMOUNT;
            if (newPrice < 0) newPrice = 0;

            // Update UI
            priceDisplay.textContent = `₹${newPrice}`;
            couponMsg.textContent = `Success! ₹${DISCOUNT_AMOUNT} saved.`;
            couponMsg.className = "coupon-msg success";

            // Disable button
            couponBtn.textContent = "Applied";
            couponBtn.disabled = true;
            isCouponApplied = true;
        } else {
            couponMsg.textContent = "Invalid Coupon Code";
            couponMsg.className = "coupon-msg error";
        }
    });


    // ==============================
    // 4. PURCHASE MODAL & REDIRECT
    // ==============================
    const paymentModal = document.getElementById("paymentModal");
    const purchaseBtns = document.querySelectorAll(".js-purchase-btn");
    const paymentCancel = document.getElementById("paymentCancelBtn");
    const paymentOverlay = document.getElementById("paymentModalOverlay");
    const paymentClose = document.getElementById("paymentModalCloseBtn");
    const paymentConfirm = document.getElementById("paymentConfirmBtn");
    const paymentAmountDisplay = document.getElementById("paymentModalAmount");

    const closePaymentModal = () => {
        paymentModal.classList.remove("active");
    };

    purchaseBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Update the modal with the current final price
            paymentAmountDisplay.textContent = priceDisplay.textContent;
            paymentModal.classList.add("active");
        });
    });

    // Close events
    if (paymentCancel) paymentCancel.addEventListener("click", closePaymentModal);
    if (paymentClose) paymentClose.addEventListener("click", closePaymentModal);
    if (paymentOverlay) paymentOverlay.addEventListener("click", closePaymentModal);

    // Redirect Logic
    if (paymentConfirm) {
        paymentConfirm.addEventListener("click", () => {
            // Change button text to indicate processing
            paymentConfirm.textContent = "Processing...";

            // Simulate delay then redirect
            setTimeout(() => {
                // REPLACE THIS URL WITH YOUR ACTUAL PAYMENT GATEWAY
                window.location.href = "payment_success.html";
                alert("Redirecting to Payment Gateway..."); // Alert for demo purposes
            }, 1000);
        });
    }
});