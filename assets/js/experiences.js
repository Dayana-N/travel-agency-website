const experienceContainer = document.getElementById("experiences-container");
const searchInput = document.getElementById("experience-search");
const catgeoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");

let allExperiences = [];

searchInput.addEventListener("input", filterExperiences);
catgeoryFilter.addEventListener("change", filterExperiences);
priceFilter.addEventListener("change", filterExperiences);

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
              <p class="experience-description">${experience.shortDescription}</p>
              <div class="experience-details">
                <span>${experience.duration}</span> <span>${price}</span>
              </div>
              <button type="button" class="experience-btn" data-bs-toggle="modal" data-bs-target="#experienceModal" data-id="${experience.id}">View Details</button>
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
  const selectedPrice = priceFilter.value;

  const filteredExperiences = allExperiences.filter((experience) => {
    // Search
    const matchesSearch =
      experience.title.toLowerCase().includes(searchTerm) ||
      experience.location.toLowerCase().includes(searchTerm);
    // Category
    const matchesCategory =
      selectedCategory == "all" || experience.category == selectedCategory;

    let matchesPrice = false;
    if (selectedPrice === "all") {
      matchesPrice = true;
    } else if (experience.price !== null) {
      const price = experience.price;

      if (selectedPrice === "0-25") {
        matchesPrice = price < 25;
      } else if (selectedPrice === "25-50") {
        matchesPrice = price >= 25 && price < 50;
      } else if (selectedPrice === "50+") {
        matchesPrice = price >= 50;
      }
    }
    return matchesSearch && matchesCategory && matchesPrice;
  });
  displayExperiences(filteredExperiences);
}

function showExperienceDetails(id) {
  const experience = allExperiences.find((item) => item.id === id);
  if (!experience) {
    return;
  } // Format price
  let price = "Price on request";
  if (experience.price !== null) {
    const currency = "€";
    price = `From ${currency}${experience.price}`;
  }
  document.getElementById("experienceModalLabel").textContent =
    experience.title;
  document.getElementById("modal-image").src = experience.image;
  document.getElementById("modal-image").alt = experience.imageAlt;
  document.getElementById("modal-location").textContent = experience.location;
  document.getElementById("modal-description").textContent =
    experience.fullDescription;
  document.getElementById("modal-duration").textContent = experience.duration;
  document.getElementById("modal-price").textContent = price;
  document.getElementById("modal-website").href = experience.website;
}

experienceContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".experience-btn");
  if (!button) {
    return;
  }
  const id = Number(button.dataset.id);
  showExperienceDetails(id);
});
loadExperiences();
