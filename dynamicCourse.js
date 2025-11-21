/**
 * ==============================================================================
 * Course Page Main JavaScript Logic
 * * This file combines all functionality for the course detail page, including:
 * 1. Data loading and rendering (from data.json).
 * 2. Sidebar interactions (tabs, coupon, purchase modal).
 * 3. Media and modal control (course/lecture video previews).
 * 4. Dynamic UI logic (Show More buttons for learning points and curriculum).
 * ==============================================================================
 */

let DYNAMIC_VALID_COUPON = null;
let DYNAMIC_DISCOUNT_AMOUNT = 0;
let isCouponApplied = false;

document.addEventListener('DOMContentLoaded', () => {
    // Initial setup: Load course details based on URL ID
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (courseId) {
        loadCourseDetails(courseId);
    } else {
        console.error("No course ID found in URL parameters.");
    }

    // Attach all general event listeners that target static elements
    attachGeneralListeners();
});


// ==============================================================================
// 1. DATA LOADING AND RENDERING LOGIC
// ==============================================================================

async function loadCourseDetails(id) {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        const course = data.find(item => item.id === id);

        if (course) {
            renderDetails(course);

            applyDynamicVisibility();
            attachVideoPreviewListeners();

            if (course.couponCode && course.couponDiscount !== undefined) {
                // CORRECT: Assigns the loaded values to the global variables
                DYNAMIC_VALID_COUPON = course.couponCode.trim().toUpperCase();
                // Ensure discount is treated as a number
                DYNAMIC_DISCOUNT_AMOUNT = Number(course.couponDiscount);

                const couponInput = document.getElementById("couponInput");
                if (couponInput) {
                    couponInput.placeholder = `Enter Coupon (e.g., ${course.couponCode})`;
                }
            }
        } else {
            document.querySelector('.course-main-content').innerHTML = "<h1>Course Not Found</h1>";
        }
    } catch (error) {
        console.error("Error loading course details:", error);
    }
}

function renderDetails(course) {
    // --- Basic Info ---
    const titleEl = document.getElementById('course-title');
    if (titleEl) titleEl.innerHTML = course.title;

    const subEl = document.getElementById('course-subtitle');
    if (subEl) subEl.textContent = course.description;

    // --- Pricing & Discount ---
    const priceEl = document.getElementById('sidebar-price');
    if (priceEl) priceEl.textContent = `₹${course.price}`;

    const origPriceEl = document.getElementById('sidebar-original-price');
    if (origPriceEl) origPriceEl.textContent = `₹${course.originalPrice}`;

    if (course.originalPrice && course.price) {
        const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
        const discountEl = document.getElementById('sidebar-discount');
        if (discountEl) discountEl.textContent = `${discount}% off`;
    }

    // --- Instructors ---
    const instContainer = document.querySelector('.author-info');
    if (instContainer && course.courseInstructors) {
        instContainer.innerHTML = 'Course Instructors: ';

        course.courseInstructors.forEach((inst, index) => {
            instContainer.innerHTML += `
                <a href="#">${inst}</a>${index < course.courseInstructors.length - 1 ? ',' : ''}
            `;
        });
    }

    // --- Learning Points ---
    const learningList = document.getElementById('learning-list');
    if (learningList && course.learningPoints) {
        learningList.innerHTML = '';

        course.learningPoints.forEach((point, index) => {
            const hiddenClass = index >= 6 ? 'class="hidden-item"' : '';
            learningList.innerHTML += `<li ${hiddenClass}><i data-feather="check"></i>${point}</li>`;
        });
    }

    // --- Curriculum / Accordion ---
    const accordionContainer = document.getElementById('accordion-container');
    const contentHeader = document.querySelector('.course-content-header span');

    if (accordionContainer && course.curriculum && Array.isArray(course.curriculum)) {
        accordionContainer.innerHTML = '';
        let totalLectures = 0;
        let totalTimeMinutes = 0;

        course.curriculum.forEach((module, index) => {
            let lecturesHtml = '';
            // Hide sections after the 4th - handled by applyDynamicVisibility
            const isHidden = index >= 4 ? 'hidden-section' : '';

            if (module.lectures) {
                module.lectures.forEach(lecture => {
                    totalLectures++;

                    const [minutes, seconds] = lecture.time.split(':').map(Number);
                    totalTimeMinutes += minutes + (seconds / 60);

                    // Add preview link only if lecture has one and use the required class
                    const previewLink = lecture.videoPreview
                        ? `<a class="lecture-preview js-video-preview" data-video-id="dQw4w9WgXcQ">Preview</a>`
                        : '';

                    lecturesHtml += `
                        <li class="lecture-item">
                            <i data-feather="play-circle"></i>
                            <span>${lecture.title}</span>
                            ${previewLink}
                            <span class="lecture-duration">${lecture.time}</span>
                        </li>
                    `;
                });
            }

            // Section HTML structure
            const sectionHtml = `
                <li class="accordion-item ${isHidden}">
                    <button class="accordion-header">
                        <i data-feather="chevron-down"></i>
                        <span>${module.sectionTitle}</span>
                        <span class="lesson-meta">${module.lectures ? module.lectures.length : 0} lectures</span>
                    </button>
                    <div class="accordion-content">
                        <div class="accordion-inner">
                            <ul class="lecture-list">
                                ${lecturesHtml}
                            </ul>
                        </div>
                    </div>
                </li>
            `;
            accordionContainer.innerHTML += sectionHtml;
        });

        // Update content header summary
        const totalDurationHours = Math.floor(totalTimeMinutes / 60);
        const totalDurationMins = Math.round(totalTimeMinutes % 60);
        if (contentHeader) {
            contentHeader.textContent = `${course.curriculum.length} sections • ${totalLectures} lectures • ${totalDurationHours}h ${totalDurationMins}m total length`;
        }


        // Re-attach individual accordion and expand-all listeners after DOM update
        attachAccordionListeners();
        attachExpandAllListener();

    } else {
        const section = document.querySelector('.course-content-section');
        if (section) section.style.display = 'none';
    }

    if (typeof feather !== 'undefined') feather.replace();
}

function attachAccordionListeners() {
    // Re-attach listeners for dynamically generated accordion headers
    const acc = document.querySelectorAll(".accordion-header");
    acc.forEach(header => {
        // Use cloneNode to safely remove old listeners and prevent duplicates
        const newEl = header.cloneNode(true);
        header.parentNode.replaceChild(newEl, header);

        newEl.addEventListener("click", function () {
            this.parentNode.classList.toggle("is-open");
        });
    });
}

function attachExpandAllListener() {
    const expandAllBtn = document.getElementById("expandAllBtn");
    const accordionItems = document.querySelectorAll(".accordion-item"); // CRITICAL: Re-select the items

    let allExpanded = false;

    if (expandAllBtn) {
        // Clone and replace to prevent duplicate listeners
        const newEl = expandAllBtn.cloneNode(true);
        expandAllBtn.parentNode.replaceChild(newEl, expandAllBtn);

        newEl.addEventListener("click", () => {
            allExpanded = !allExpanded;
            newEl.textContent = allExpanded ? "Collapse all sections" : "Expand all sections";

            accordionItems.forEach(item => {
                if (allExpanded) {
                    item.classList.add("is-open");
                } else {
                    item.classList.remove("is-open");
                }
            });
        });
    }
}


// ==============================================================================
// 2. DYNAMIC UI VISIBILITY (Needs to run AFTER renderDetails)
// ==============================================================================

function applyDynamicVisibility() {
    // 1. Dynamic visibility for the "What you'll learn" section
    const learningList = document.getElementById('learning-list');
    const showMoreBtn = document.getElementById('show-more-btn');
    const maxVisibleLearningPoints = 6;

    if (learningList && showMoreBtn) {
        const totalPoints = learningList.children.length;

        if (totalPoints > maxVisibleLearningPoints) {
            showMoreBtn.style.display = 'flex';

            // Ensure items 6 and over are hidden initially
            for (let i = maxVisibleLearningPoints; i < totalPoints; i++) {
                learningList.children[i].style.display = 'none';
            }

            const hiddenItems = learningList.querySelectorAll(".hidden-item");
            let isExpanded = false;

            showMoreBtn.addEventListener("click", () => {
                isExpanded = !isExpanded;

                hiddenItems.forEach(item => {
                    item.style.display = isExpanded ? 'list-item' : 'none';
                });

                if (isExpanded) {
                    showMoreBtn.innerHTML = `Show less <i data-feather="chevron-up"></i>`;
                } else {
                    showMoreBtn.innerHTML = `Show more <i data-feather="chevron-down"></i>`;
                }
                if (typeof feather !== 'undefined') feather.replace();
            });

        } else {
            showMoreBtn.style.display = 'none';
        }
    }


    // 2 & 3. Dynamic visibility and count for the "Show more sections" button
    const accordionContainer = document.getElementById('accordion-container');
    const showMoreSectionsBtn = document.getElementById('showMoreSectionsBtn');
    const maxVisibleSections = 4;

    if (accordionContainer && showMoreSectionsBtn) {
        const totalSections = accordionContainer.children.length;

        if (totalSections > maxVisibleSections) {
            const hiddenCount = totalSections - maxVisibleSections;

            // Apply 'hidden-section' class to sections 5 and onward and hide them
            for (let i = maxVisibleSections; i < totalSections; i++) {
                accordionContainer.children[i].classList.add('hidden-section');
                accordionContainer.children[i].style.display = 'none';
            }

            showMoreSectionsBtn.textContent = `${hiddenCount} more sections`;
            showMoreSectionsBtn.style.display = 'block';

            showMoreSectionsBtn.addEventListener('click', () => {
                const hiddenSections = accordionContainer.querySelectorAll('.hidden-section');

                hiddenSections.forEach(section => {
                    section.style.display = 'list-item';
                    section.classList.remove('hidden-section');
                });

                showMoreSectionsBtn.style.display = 'none';
            });

        } else {
            showMoreSectionsBtn.style.display = 'none';
        }
    }
}


// ==============================================================================
// 3. ATTACH ALL GENERAL EVENT LISTENERS (Sidebar, Modals, Purchase)
// ==============================================================================

function attachGeneralListeners() {
    // --- 3.1. VIDEO MODAL LOGIC SETUP (Only the modal open/close functions) ---
    // The listeners for the buttons themselves are attached in attachVideoPreviewListeners()
    const videoModal = document.getElementById("videoModal");
    const videoIframe = document.getElementById("videoModalIframe");
    const videoCloseBtn = document.getElementById("modalCloseBtn");
    const videoOverlay = document.getElementById("modalOverlay");

    // Helper function to open modal (used by attachVideoPreviewListeners)
    window.openVideoModal = (videoId) => {
        // Using a fixed URL for demo based on your existing code
        videoIframe.src = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`;
        videoModal.classList.add("active");
    };

    const closeVideoModal = () => {
        videoModal.classList.remove("active");
        videoIframe.src = ""; // Stop video playback
    };

    if (videoCloseBtn) videoCloseBtn.addEventListener("click", closeVideoModal);
    if (videoOverlay) videoOverlay.addEventListener("click", closeVideoModal);


    // --- 3.2. TAB SWITCHING LOGIC (Personal/University) ---
    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");

    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            tabLinks.forEach(l => l.classList.remove("is-active"));
            tabContents.forEach(c => {
                c.classList.remove("active");
                c.style.display = "none";
            });

            link.classList.add("is-active");
            const targetId = `tab-content-${link.getAttribute("data-tab")}`;
            const targetContent = document.getElementById(targetId);
            targetContent.style.display = "block";
            setTimeout(() => targetContent.classList.add("active"), 10);
        });
    });


    // --- 3.3. COUPON LOGIC ---
    const couponInput = document.getElementById("couponInput");
    const couponBtn = document.getElementById("couponBtn");
    const couponMsg = document.getElementById("couponMessage");
    const priceDisplay = document.getElementById("sidebar-price");

    // The event listener is attached here, AFTER the document is ready.
    if (couponBtn) {
        couponBtn.addEventListener("click", (e) => {
            e.preventDefault();

            if (!priceDisplay) return;

            if (isCouponApplied) {
                couponMsg.textContent = "Coupon already applied! You've successfully locked in your discount.";
                couponMsg.className = "coupon-msg error";
                return;
            }

            const enteredCode = couponInput.value.trim().toUpperCase();

            // Check 1: Is the entered code the correct code?
            if (enteredCode === DYNAMIC_VALID_COUPON) {

                // Check 2: Does a valid discount amount exist? (Prevents applying $0 discount)
                if (DYNAMIC_DISCOUNT_AMOUNT > 0) {

                    // --- SUCCESS LOGIC ---

                    const currentPriceText = priceDisplay.textContent.replace(/[^0-9]/g, '');
                    let currentPrice = parseInt(currentPriceText, 10);

                    let newPrice = currentPrice - DYNAMIC_DISCOUNT_AMOUNT;
                    if (newPrice < 0) newPrice = 0;

                    priceDisplay.textContent = `₹${newPrice}`;
                    couponMsg.textContent = `Success! ₹${DYNAMIC_DISCOUNT_AMOUNT} saved.`;
                    couponMsg.className = "coupon-msg success";

                    couponBtn.textContent = "Applied";
                    couponBtn.disabled = true;
                    isCouponApplied = true;
                    return;

                }
            }

            // --- FAILURE LOGIC (If code is wrong OR if discount is missing/zero) ---
            couponMsg.textContent = "Sorry, that code is invalid or has expired. Please double-check the code and try again!";
            couponMsg.className = "coupon-msg error";

        });
    }


    // --- 3.4. PURCHASE MODAL & REDIRECT ---
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
            if (priceDisplay && paymentAmountDisplay) {
                paymentAmountDisplay.textContent = priceDisplay.textContent;
            }
            paymentModal.classList.add("active");
        });
    });

    if (paymentCancel) paymentCancel.addEventListener("click", closePaymentModal);
    if (paymentClose) paymentClose.addEventListener("click", closePaymentModal);
    if (paymentOverlay) paymentOverlay.addEventListener("click", closePaymentModal);

    if (paymentConfirm) {
        paymentConfirm.addEventListener("click", () => {
            paymentConfirm.textContent = "Processing...";
            setTimeout(() => {
                alert("Redirecting to Payment Gateway...");
                paymentConfirm.textContent = "Proceed to Pay";
                closePaymentModal();
            }, 1000);
        });
    }
}

// ==============================================================================
// 4. FIX: Re-attaches listeners to dynamically created video preview links
// ==============================================================================

function attachVideoPreviewListeners() {
    // Select all video preview elements across the page (static sidebar/hero AND dynamic lectures)
    const videoTriggers = document.querySelectorAll(".js-video-preview");

    videoTriggers.forEach(trigger => {
        // Use cloneNode to remove old listeners first, if this function is called multiple times
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);

        newTrigger.addEventListener("click", (e) => {
            e.stopPropagation(); // Stop event from bubbling up to accordion header
            const videoId = newTrigger.getAttribute("data-video-id");
            // Call the global open modal function
            window.openVideoModal(videoId);
        });
    });
}