const experienceContainer = document.getElementById("experiences-container");
const searchInput = document.getElementById("experience-search");
const catgeoryFilter = document.getElementById("category-filter");

let allExperiences = [];

searchInput.addEventListener("input", filterExperiences);
catgeoryFilter.addEventListener("change", filterExperiences);

function loadExperiences() {
  fetch("assets/data/experiences.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load experiences");
      }
      return response.json();
    })
    .then((experiences) => {
      allExperiences = experiences;
      displayExperiences(experiences);
    })
    .catch((error) => {
      console.error("Error loading experiences:", error);
      experienceContainer.textContent = "Unable to load experiences";
    });
}

function displayExperiences(experiences) {
  experienceContainer.innerHTML = "";

  if (experiences.length === 0) {
    experienceContainer.innerHTML =
      "<p>No experiences found. Try a different search or category.</p>";
  }

  experiences.forEach((experience) => {
    const card = document.createElement("article");
    card.classList.add("experience-card");

    let price = "Price on request";
    if (experience.price !== null) {
      let currency = experience.currency === "GBP" ? "£" : "€";
      price = `From ${currency}${experience.price}`;
    }

    card.innerHTML = `
        <img
              src="${experience.image}"
              alt="${experience.imageAlt}"
              class="experience-image"
              loading="lazy"
            />
            <div class="experience-content">
              <h3>${experience.title}</h3>
              <p class="experience-location">${experience.location}</p>
              <div class="experience-details">
                <span>${experience.duration}</span> <span>${price}</span>
              </div>
              <button type="button" class="experience-btn">View Details</button>
            </div>
        `;
    experienceContainer.appendChild(card);
  });
  document.getElementById("results-count").textContent =
    `Showing ${experiences.length} experiences`;
}

function filterExperiences() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = catgeoryFilter.value;

  const filteredExperiences = allExperiences.filter((experience) => {
    const matchesSearch =
      experience.title.toLowerCase().includes(searchTerm) ||
      experience.location.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory == "all" || experience.category == selectedCategory;
    return matchesSearch && matchesCategory;
  });
  displayExperiences(filteredExperiences);
}
loadExperiences();
