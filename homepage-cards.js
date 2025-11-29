document.addEventListener("DOMContentLoaded", () => {
  console.log("Script started: Fetching data...");
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // DATA IS NOW AN ARRAY, NOT AN OBJECT
    const data = await response.json();
    console.log("Data loaded:", data);

    // 1. Filter the Array to get Courses
    const coursesList = data.filter((item) => item.type === "course");
    console.log("Found Courses:", coursesList.length);
    renderCards(coursesList, "courses-container");

    // 2. Filter the Array to get Workshops
    const workshopsList = data.filter((item) => item.type === "workshop");
    console.log("Found Workshops:", workshopsList.length);
    renderCards(workshopsList, "workshops-container");
  } catch (error) {
    console.error("Error loading data:", error);
    // Visual feedback for debugging
    document.body.insertAdjacentHTML(
      "beforeend",
      `<p style="color:red; padding:20px;">Error: ${error.message}. Check Console.</p>`
    );
  }
}

function renderCards(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container #${containerId} not found on this page.`);
    return;
  }

  const limit = container.dataset.limit;
  const itemsToDisplay = limit ? items.slice(0, limit) : items;

  container.innerHTML = "";

  itemsToDisplay.forEach((item) => {
    // 1. Generate Icons
let iconsHtml = '';
if (item.techIcons) {
    item.techIcons.forEach(tech => {
        // We create a container div for the image AND the text
        iconsHtml += `
            <div class="tech-item">
                <img src="${tech.icon}" alt="${tech.name}" />
                <span class="tech-name">${tech.name}</span>
            </div>
        `;
    });
}

    // 2. Handle Experience/Projects Text
    // Your JSON uses "projects", but we keep fallbacks just in case
    const experienceData =
      item.projects || item.experienceText || "Hands-on Practice";

    // 3. Build Link
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
              <strong class="experience_strong">Projects:</strong>
              <div class="projects-guided-text-container">
                <div class="duration-text">${experienceData}</div>
              </div>
            </div>
            
            <div class="course-icons-container">${iconsHtml}</div>
            
            <div class="our-program-bottom-para">${item.description}</div>
            
            <div class="price-register">
            <span class="btn btn-light-blue"><span class="original-price">₹${item.originalPrice}</span> ₹ ${item.price}</span>
            <span class="btn btn-green"> Register Now </span>
            </div>
          </div>
        </a>
      `;

    container.innerHTML += cardHtml;
  });
}
