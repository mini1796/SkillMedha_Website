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
  if (!container) return;

  const limit = container.dataset.limit;
  const itemsToDisplay = limit ? items.slice(0, limit) : items;

  container.innerHTML = '';

  itemsToDisplay.forEach(item => {
    // 1. Generate Icons
    let iconsHtml = '';
    if (item.techIcons) {
      item.techIcons.forEach(iconPath => {
        iconsHtml += `<img src="${iconPath}" alt="Tool icon" />`;
      });
    }

    // 2. Handle Data variations (Course vs Workshop)
    // Courses have "projects", Workshops might still use "experienceText" or similar.
    // We use || (OR) to be safe.
    const experienceData = item.projects || item.experienceText || "Hands-on Practice";
    const linkUrl = `course-details.html?id=${item.id}&type=${item.type}`;

    const cardHtml = `
        <a href="${linkUrl}" class="our-program-card">
          <div class="our-program-card-top-container">
            <div class="course-heading">${item.title}</div>
            <div class="duration-container">
              <div class="calendar-icon-div">
                <img src="./images/calendar.png" alt="calendar icon" />
              </div>
              <div class="duration-text">Duration : ${item.duration}</div>
            </div>
          </div>

          <div class="our-program-card-bottom-container">
            <div class="projects-guided-container">
              <strong class="experience_strong">Experience:</strong>
              <div class="projects-guided-text-container">
                <div class="duration-text">${experienceData}</div>
              </div>
            </div>
            
            <div class="course-icons-container">${iconsHtml}</div>
            
            <div class="our-program-bottom-para">${item.description}</div>
            
            <span class="btn btn-green"> Register Now </span>
          </div>
        </a>
      `;

    container.innerHTML += cardHtml;
  });
}

