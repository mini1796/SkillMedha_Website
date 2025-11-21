document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();

    // 1. Render Courses
    renderCards(data.courses, 'courses-container');

    // 2. Render Workshops
    renderCards(data.workshops, 'workshops-container');

  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// A reusable function to render cards into ANY container
function renderCards(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return; // If container doesn't exist on this page, skip

  // Check for Limit (e.g., show only 3 on homepage)
  const limit = container.dataset.limit;
  const itemsToDisplay = limit ? items.slice(0, limit) : items;

  container.innerHTML = ''; // Clear loading text

  itemsToDisplay.forEach(item => {
    // Generate Icons HTML
    let iconsHtml = '';
    if (item.techIcons) {
      item.techIcons.forEach(iconPath => {
        iconsHtml += `<img src="${iconPath}" alt="Tool icon" />`;
      });
    }

    // Determine Link: Redirect to course page or workshop page?
    // If it's a workshop, maybe you want a different page, or the same details page.
    // Here I assume same details page structure.
    const linkUrl = `course-details.html?id=${item.id}&type=${item.type}`;

    // Exact HTML Structure
    const cardHtml = `
        <a href="${linkUrl}" class="our-program-card">
          <div class="our-program-card-top-container">
            <div class="course-heading">
              ${item.title}
            </div>
            <div class="duration-container">
              <div class="calendar-icon-div">
                <img src="./images/calendar.png" alt="calendar icon" />
              </div>
              <div class="duration-text">Min Duration : ${item.duration}</div>
            </div>
          </div>

          <div class="our-program-card-bottom-container">
            <div class="projects-guided-container">
              <strong class="experience_strong">Experience:-</strong>
              <div class="projects-guided-text-container">
                <div class="duration-text">
                  ${item.experienceText}
                </div>
              </div>
            </div>
            
            <div class="course-icons-container">
               ${iconsHtml}
            </div>
            
            <div class="our-program-bottom-para">
              ${item.description}
            </div>
            
            <span class="btn btn-green"> Register Now </span>
          </div>
        </a>
      `;

    container.innerHTML += cardHtml;
  });
}