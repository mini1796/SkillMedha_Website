document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    const courseType = urlParams.get('type'); // 'course' or 'workshop'

    if (courseId) {
        loadCourseDetails(courseId, courseType);
    } else {
        document.body.innerHTML = "<h1>No course specified</h1>";
    }
});

async function loadCourseDetails(id, type) {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        let item = null;

        // 1. Find the item based on the 'type' URL parameter
        if (type === 'workshop') {
            item = data.workshops.find(w => w.id === id);
        } else {
            // Default to course if type is missing or 'course'
            item = data.courses.find(c => c.id === id);
        }

        if (item) {
            renderDetails(item);
        } else {
            document.body.innerHTML = "<h1>Course/Workshop not found</h1>";
        }

    } catch (error) {
        console.error("Error loading details:", error);
    }
}

function renderDetails(course) {
    // --- Basic Info ---
    document.getElementById('course-title').innerHTML = course.title;
    // Use projects OR experienceText (fallback)
    const subtitle = course.description;
    document.getElementById('course-subtitle').textContent = subtitle;

    // --- Pricing (Sidebar) ---
    const priceEl = document.getElementById('coursePrice');
    if (priceEl) priceEl.textContent = `₹${course.price}`;

    const origPriceEl = document.getElementById('sidebar-original-price');
    if (origPriceEl) origPriceEl.textContent = `₹${course.originalPrice || (course.price + 2000)}`;

    // Calculate Discount Tag
    if (course.originalPrice) {
        const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
        const discountEl = document.querySelector('.price-discount');
        if (discountEl) discountEl.textContent = `${discount}% off`;
    }

    // --- Learning Points ---
    const learningList = document.getElementById('learning-list');
    if (learningList && course.learningPoints) {
        learningList.innerHTML = '';
        course.learningPoints.forEach(point => {
            learningList.innerHTML += `<li><i data-feather="check"></i>${point}</li>`;
        });
    }

    // --- Instructors ---
    const instContainer = document.getElementById('instructors-container');
    if (instContainer && course.courseInstructors) {
        instContainer.innerHTML = '';
        course.courseInstructors.forEach(inst => {
            instContainer.innerHTML += `
                <div class="instructor-badge" style="background:#f0f0f0; padding:10px 15px; border-radius:8px;">
                    <i data-feather="user" style="width:16px;"></i> <strong>${inst}</strong>
                </div>`;
        });
    }

    // --- "Includes" Section (Object Handling) ---
    if (course.courseIncludes) {
        const inc = course.courseIncludes;

        // Update Text
        setTextIfFound('inc-video-text', `${inc.videoDuration} on-demand video`);
        setTextIfFound('inc-articles-text', `${inc.articles} articles`);
        setTextIfFound('inc-resources-text', `${inc.downloadableResources} downloadable resources`);

        // Toggle Visibility based on "yes"/"no"
        toggleDisplay('inc-mobile-box', inc.accessOnMobile === "yes");
        toggleDisplay('inc-cert-box', inc.certificateOfCompletion === "yes");
    }

    // --- Curriculum / Accordion (The Complex Part) ---
    const accordionContainer = document.querySelector('.accordion');
    const curriculumSection = document.querySelector('.course-content-section');

    // Only run if the element exists AND data exists
    if (accordionContainer && curriculumSection) {
        if (course.curriculum && course.curriculum.length > 0) {
            accordionContainer.innerHTML = ''; // Clear placeholder

            course.curriculum.forEach((module, index) => {
                // 1. Build Lectures List
                let lecturesHtml = '';
                module.lectures.forEach(lecture => {
                    lecturesHtml += `
                        <li class="lecture-item">
                            <i data-feather="play-circle"></i>
                            <span>${lecture.title}</span>
                            <span class="lecture-duration">${lecture.time}</span>
                        </li>
                    `;
                });

                // 2. Build Section Wrapper
                const sectionHtml = `
                    <li class="accordion-item">
                        <button class="accordion-header">
                            <i data-feather="chevron-down"></i>
                            <span>${module.sectionTitle}</span>
                            <span class="lesson-meta">${module.lectures.length} lectures</span>
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

            // Re-attach event listeners for the accordion logic
            attachAccordionListeners();
        } else {
            // If it's a Workshop (no curriculum), hide the section
            curriculumSection.style.display = 'none';
        }
    }

    // Refresh Icons
    if (typeof feather !== 'undefined') feather.replace();
}

// Helper: Set text if element exists
function setTextIfFound(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// Helper: Hide/Show element
function toggleDisplay(id, shouldShow) {
    const el = document.getElementById(id);
    if (el) el.style.display = shouldShow ? 'flex' : 'none';
}

// Your Existing Accordion Logic (Wrapped in a function to call later)
function attachAccordionListeners() {
    const acc = document.getElementsByClassName("accordion-header");
    for (let i = 0; i < acc.length; i++) {
        // Remove old listeners to prevent duplicates
        acc[i].replaceWith(acc[i].cloneNode(true));
    }
    // Re-select and add new listeners
    const newAcc = document.getElementsByClassName("accordion-header");
    for (let i = 0; i < newAcc.length; i++) {
        newAcc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
}