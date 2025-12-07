// Fetch courses from MongoDB API instead of hardcoded data
let coursesDatabase = {};
let allCourses = [];
let currentReviewSubmitHandler = null; // Track current form handler to prevent duplicates

// Department name mapping
const deptNames = {
  cs: "COMPUTER SCIENCE",
  cmpinf: "COMPUTING & INFORMATION",
  infsci: "INFORMATION SCIENCE",
  engcmp: "COMPOSITION",
  math: "MATHEMATICS",
  stat: "STATISTICS",
  econ: "ECONOMICS",
  phil: "PHILOSOPHY",
  sensq: "SENSOR QUANTUM",
  wwph: "PHYSICS",
};

// Fetch all courses from the database on page load
async function fetchCourses() {
  try {
    const response = await fetch("/api/courses");
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    allCourses = await response.json();

    // Group courses by department
    coursesDatabase = {};
    allCourses.forEach((course) => {
      // Normalize department name to match the deptNames keys
      const dept = course.department
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/&/g, "");
      if (!coursesDatabase[dept]) {
        coursesDatabase[dept] = [];
      }
      coursesDatabase[dept].push(course);
    });

    console.log("✅ Loaded courses from database:", allCourses.length);
    console.log("📊 Departments:", Object.keys(coursesDatabase));
    return coursesDatabase;
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    return {};
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", async function () {
  // Show loading indicator
  console.log("🔄 Loading courses from database...");

  // Fetch courses first
  await fetchCourses();

  // Render department cards with dynamic counts
  renderDepartmentCards();

  initializeSearch();
  initializeKeyboardShortcuts();
});

function initializeSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");

  if (searchQuery) {
    document.getElementById("searchInput").value = searchQuery;

    // Check if search query is a course code (e.g., CS1530, CS 1530, INFSCI2710)
    const courseCodeMatch = searchQuery
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");
    const foundCourse = findCourseByCode(courseCodeMatch);

    if (foundCourse) {
      // Open the course detail directly
      openCourseDetail(foundCourse.dept, foundCourse.courseCode);
    } else {
      // Otherwise, just filter departments normally
      filterCourses(searchQuery);
    }
  }

  const searchInput = document.getElementById("searchInput");

  // Add spotlight-style suggestions
  searchInput.addEventListener("input", function (e) {
    const query = e.target.value.trim();

    if (query.length > 0) {
      updateSpotlightSuggestions(query);
      filterCourses(query);
    } else {
      clearSpotlightSuggestions();
      filterCourses("");
    }
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const query = e.target.value.trim();

      // Check if it's a course code
      const courseCodeMatch = query.toUpperCase().replace(/\s+/g, "");
      const foundCourse = findCourseByCode(courseCodeMatch);

      if (foundCourse) {
        // Open course detail directly
        clearSpotlightSuggestions();
        openCourseDetail(foundCourse.dept, foundCourse.courseCode);
      } else {
        // Otherwise filter normally
        filterCourses(query);
      }
    }
  });
}

// Helper function to find a course by its code across all departments
function findCourseByCode(courseCode) {
  // Remove all spaces from the search query
  const normalizedQuery = courseCode.replace(/\s+/g, "").toUpperCase();

  for (const [dept, courses] of Object.entries(coursesDatabase)) {
    const found = courses.find((c) => {
      // Remove all spaces from the course code too
      const normalizedCourseCode = c.courseCode
        .replace(/\s+/g, "")
        .toUpperCase();
      return normalizedCourseCode === normalizedQuery;
    });
    if (found) {
      return { dept, courseCode: found.courseCode };
    }
  }
  return null;
}

// Show error message when course is not found
function showCourseNotFoundError(searchQuery) {
  const modal = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");

  modalTitle.innerHTML = `<span style="color: #f97316;">❌ COURSE NOT FOUND</span>`;

  modalContent.innerHTML = `
    <div style="text-align: center; padding: 3rem 2rem;">
      <div style="font-size: 4rem; margin-bottom: 2rem;">🔍</div>
      <div style="font-size: 1.2rem; color: #f97316; margin-bottom: 1rem; letter-spacing: 2px;">
        COURSE NOT FOUND
      </div>
      <div style="font-size: 0.8rem; color: #cbd5e1; line-height: 2; margin-bottom: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        We couldn't find a course matching "<strong style="color: #f97316;">${searchQuery}</strong>"
      </div>
      <div style="background: rgba(249, 115, 22, 0.1); border-left: 4px solid #f97316; padding: 1.5rem; margin-bottom: 2rem; text-align: left;">
        <div style="font-size: 0.7rem; color: #f97316; margin-bottom: 0.8rem; letter-spacing: 1px;">
          SUGGESTIONS:
        </div>
        <div style="font-size: 0.65rem; color: #cbd5e1; line-height: 1.8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          • Double-check the course code spelling<br>
          • Try removing spaces (e.g., "CS1530" instead of "CS 1530")<br>
          • Make sure the course exists in our database<br>
          • Try searching by department (e.g., "CS", "INFSCI")
        </div>
      </div>
      <button onclick="closeModal(); document.getElementById('searchInput').focus();" style="background: #2d1b4e; border: 3px solid #f97316; padding: 1rem 2rem; color: #fff; font-family: 'Press Start 2P', cursive; font-size: 0.7rem; cursor: pointer; letter-spacing: 2px; transition: all 0.2s;">
        TRY AGAIN
      </button>
    </div>
  `;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

// Update spotlight-style suggestions below search bar
function updateSpotlightSuggestions(query) {
  let suggestionsBox = document.getElementById("spotlightSuggestions");

  // Create suggestions box if it doesn't exist
  if (!suggestionsBox) {
    suggestionsBox = document.createElement("div");
    suggestionsBox.id = "spotlightSuggestions";
    suggestionsBox.className = "spotlight-suggestions";

    // Insert after search container
    const searchContainer = document.querySelector(".search-container");
    searchContainer.parentNode.insertBefore(
      suggestionsBox,
      searchContainer.nextSibling
    );
  }

  // Find matching courses
  const matches = [];
  const queryUpper = query.toUpperCase();

  for (const [dept, courses] of Object.entries(coursesDatabase)) {
    courses.forEach((course) => {
      // Check if course code or name matches
      if (
        course.courseCode.toUpperCase().includes(queryUpper) ||
        course.courseName.toUpperCase().includes(queryUpper) ||
        dept.toUpperCase().includes(queryUpper)
      ) {
        matches.push({
          dept,
          code: course.courseCode,
          name: course.courseName,
        });
      }
    });
  }

  if (matches.length > 0) {
    // Group by first 3-5 matches and show inline
    const topMatches = matches.slice(0, 6);
    const courseCodes = topMatches.map((m) => m.code).join(", ");

    // Check if we're on index page or reviews page
    const isIndexPage =
      window.location.pathname.includes("index.html") ||
      window.location.pathname === "/" ||
      !window.location.pathname.includes("reviews.html");

    suggestionsBox.innerHTML = `
      <div class="spotlight-hint">
        <span class="spotlight-icon">🔍</span>
        <span class="spotlight-text">
          Found ${matches.length} course${matches.length !== 1 ? "s" : ""}: 
          <span class="spotlight-courses">${courseCodes}${
      matches.length > 6 ? "..." : ""
    }</span>
        </span>
      </div>
      <div class="spotlight-items">
        ${topMatches
          .map(
            (match) => `
          <button class="spotlight-item" onclick="${
            isIndexPage
              ? `window.location.href='reviews.html?search=${encodeURIComponent(
                  match.code
                )}'`
              : `openCourseDetail('${match.dept}', '${match.code}')`
          }">
            <span class="spotlight-item-code">${match.code}</span>
            <span class="spotlight-item-name">${match.name}</span>
          </button>
        `
          )
          .join("")}
      </div>
      ${
        matches.length > 6
          ? `<div class="spotlight-more">+${
              matches.length - 6
            } more courses</div>`
          : ""
      }
    `;
    suggestionsBox.style.display = "block";
  } else {
    suggestionsBox.innerHTML = `
      <div class="spotlight-hint spotlight-empty">
        <span class="spotlight-icon">❌</span>
        <span class="spotlight-text">No courses found matching "${query}"</span>
      </div>
    `;
    suggestionsBox.style.display = "block";
  }
}

// Clear spotlight suggestions
function clearSpotlightSuggestions() {
  const suggestionsBox = document.getElementById("spotlightSuggestions");
  if (suggestionsBox) {
    suggestionsBox.style.display = "none";
  }
}

function filterCourses(query) {
  const cards = document.querySelectorAll(".department-card");
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    cards.forEach((card) => {
      card.classList.remove("hiding");
      setTimeout(() => {
        card.style.display = "block";
      }, 0);
    });
    return;
  }

  cards.forEach((card) => {
    const deptName = card
      .querySelector(".department-name")
      .textContent.toLowerCase();
    const deptCode = card
      .querySelector(".department-code")
      .textContent.toLowerCase();

    if (deptName.includes(searchTerm) || deptCode.includes(searchTerm)) {
      card.classList.remove("hiding");
      card.style.display = "block";
    } else {
      // Add hiding class for fade out animation
      card.classList.add("hiding");
      // Wait for animation to complete before hiding
      setTimeout(() => {
        if (card.classList.contains("hiding")) {
          card.style.display = "none";
        }
      }, 200);
    }
  });
}

function openModal(dept) {
  const modal = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");

  modalTitle.textContent = deptNames[dept] || dept.toUpperCase();

  const courses = coursesDatabase[dept] || [];

  if (courses.length === 0) {
    modalContent.innerHTML = `
            <div class="no-courses">
                NO COURSES FOUND IN DATABASE<br><br>
                Add courses using the seed script or API!
            </div>
        `;
  } else {
    modalContent.innerHTML = `
            <div class="course-list">
                ${courses
                  .map(
                    (course) => `
                    <button class="course-item" onclick="openCourseDetail('${dept}', '${
                      course.courseCode
                    }')">
                        <div class="course-header">
                            <div class="course-code">${course.courseCode}</div>
                            <div class="course-level">${
                              course.courseLevel
                            }</div>
                        </div>
                        <div class="course-name">${course.courseName}</div>
                        <div class="course-credits">
                            <span style="color: #f97316;">●</span> ${
                              course.credits
                            } Credits
                        </div>
                        <div class="course-description">${course.description.substring(
                          0,
                          300
                        )}...</div>
                        <div class="view-details-link">
                            CLICK TO VIEW DETAILS & REVIEWS →
                        </div>
                    </button>
                `
                  )
                  .join("")}
            </div>
        `;
  }

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("modalOverlay");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

function openCourseDetail(dept, courseCode) {
  const course = coursesDatabase[dept]?.find(
    (c) => c.courseCode === courseCode
  );

  if (!course) {
    console.error("Course not found:", courseCode);
    return;
  }

  const modal = document.getElementById("courseDetailModal");
  const modalTitle = document.getElementById("courseDetailTitle");
  const modalContent = document.getElementById("courseDetailContent");

  modalTitle.innerHTML = `
        <div class="course-code-large">${course.courseCode}</div>
        <div class="course-name-large">${course.courseName}</div>
    `;

  // Get unique professors from reviews if they exist
  const professorsList =
    course.professors && course.professors.length > 0
      ? course.professors
      : [...new Set((course.reviews || []).map((r) => r.professor))];

  // Calculate overall average ratings from ALL reviews
  const allReviewsAvg =
    course.reviews && course.reviews.length > 0
      ? calculateAverageRatings(course.reviews)
      : null;

  modalContent.innerHTML = `
        <div class="course-info-grid">
            <div class="info-item">
                <div class="info-label">CREDITS</div>
                <div class="info-value">${course.credits}</div>
            </div>
            <div class="info-item">
                <div class="info-label">LEVEL</div>
                <div class="info-value">${course.courseLevel}</div>
            </div>
            <div class="info-item">
                <div class="info-label">DEPARTMENT</div>
                <div class="info-value">${course.department}</div>
            </div>
        </div>

        ${
          allReviewsAvg
            ? `
        <div class="average-ratings-box">
            <h4 class="ratings-title">AVERAGE RATINGS (${
              course.reviews.length
            } ${course.reviews.length === 1 ? "review" : "reviews"})</h4>
            <div class="ratings-grid">
                <div class="rating-item">
                    <span class="rating-label">Overall</span>
                    <span class="rating-value">⭐ ${
                      allReviewsAvg.overall
                    }/5</span>
                </div>
                <div class="rating-item">
                    <span class="rating-label">Workload</span>
                    <span class="rating-value">📚 ${
                      allReviewsAvg.workload
                    }/5</span>
                </div>
                <div class="rating-item">
                    <span class="rating-label">Difficulty</span>
                    <span class="rating-value">💪 ${
                      allReviewsAvg.difficulty
                    }/5</span>
                </div>
                <div class="rating-item">
                    <span class="rating-label">Usefulness</span>
                    <span class="rating-value">💡 ${
                      allReviewsAvg.usefulness
                    }/5</span>
                </div>
            </div>
        </div>
        `
            : ""
        }

        <div class="detail-section">
            <div class="section-title">DESCRIPTION</div>
            <div class="section-content">${course.description}</div>
        </div>

        <div class="detail-section">
            <div class="section-title">PREREQUISITES</div>
            <div class="section-content">
                ${
                  course.prerequisites && course.prerequisites.length > 0
                    ? course.prerequisites
                        .map((prereq) => `<span class="tag">${prereq}</span>`)
                        .join("")
                    : '<span class="tag">None</span>'
                }
            </div>
        </div>

        ${
          professorsList.length > 0
            ? `
        <div class="detail-section">
            <div class="section-title">PROFESSORS & REVIEWS</div>
            <div class="professors-list">
                ${professorsList
                  .map((prof) => {
                    const profReviews = getProfessorReviews(
                      course.reviews || [],
                      prof
                    );
                    const avgRatings =
                      profReviews.length > 0
                        ? calculateAverageRatings(profReviews)
                        : null;
                    return `
                    <div class="professor-card">
                        <button class="professor-toggle" onclick="toggleProfessorReviews('${courseCode}', '${prof}')">
                            <span class="professor-name">👨‍🏫 ${prof}</span>
                            <span class="professor-review-count">${
                              profReviews.length
                            } reviews${
                      avgRatings ? ` • ⭐ ${avgRatings.overall}/5` : ""
                    }</span>
                            <span class="toggle-arrow" id="arrow-${courseCode}-${prof.replace(
                      /\s+/g,
                      "-"
                    )}">▼</span>
                        </button>
                        <div class="professor-reviews" id="reviews-${courseCode}-${prof.replace(
                      /\s+/g,
                      "-"
                    )}" style="display: none;">
                            ${
                              profReviews.length > 0
                                ? profReviews
                                    .map(
                                      (review) => `
                                <div class="review-item">
                                    <div class="review-header">
                                        <span class="review-rating">⭐ ${
                                          review.ratings.overall
                                        }/5 Overall</span>
                                        <span class="review-date">${
                                          review.semester
                                        }</span>
                                    </div>
                                    <div class="review-ratings-row">
                                        <span class="review-meta">Workload: ${
                                          review.ratings.workload
                                        }/5</span>
                                        <span class="review-meta">Difficulty: ${
                                          review.ratings.difficulty
                                        }/5</span>
                                        <span class="review-meta">Usefulness: ${
                                          review.ratings.usefulness
                                        }/5</span>
                                    </div>
                                    <div class="review-text">${
                                      review.comment
                                    }</div>
                                    <div class="review-timestamp">${new Date(
                                      review.timestamp
                                    ).toLocaleDateString()}</div>
                                </div>
                              `
                                    )
                                    .join("")
                                : '<div class="no-reviews">No reviews yet. Be the first to review!</div>'
                            }
                        </div>
                    </div>
                `;
                  })
                  .join("")}
            </div>
        </div>
        `
            : ""
        }

        <button class="add-review-btn" onclick="openAddReviewModal('${dept}', '${courseCode}')">
            + ADD A REVIEW
        </button>
    `;

  closeModal();
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function getProfessorReviewCount(reviews, professor) {
  return reviews.filter((r) => r.professor === professor).length;
}

function calculateAverageRatings(reviews) {
  if (!reviews || reviews.length === 0)
    return { workload: 0, difficulty: 0, usefulness: 0, overall: 0 };

  const totals = reviews.reduce(
    (acc, review) => {
      acc.workload += review.ratings.workload;
      acc.difficulty += review.ratings.difficulty;
      acc.usefulness += review.ratings.usefulness;
      acc.overall += review.ratings.overall;
      return acc;
    },
    { workload: 0, difficulty: 0, usefulness: 0, overall: 0 }
  );

  return {
    workload: (totals.workload / reviews.length).toFixed(1),
    difficulty: (totals.difficulty / reviews.length).toFixed(1),
    usefulness: (totals.usefulness / reviews.length).toFixed(1),
    overall: (totals.overall / reviews.length).toFixed(1),
  };
}

function getProfessorReviews(reviews, professor) {
  return reviews.filter(
    (r) => r.professor.toLowerCase() === professor.toLowerCase()
  );
}

function toggleProfessorReviews(courseCode, professor) {
  const reviewsDiv = document.getElementById(
    `reviews-${courseCode}-${professor.replace(/\s+/g, "-")}`
  );
  const arrow = document.getElementById(
    `arrow-${courseCode}-${professor.replace(/\s+/g, "-")}`
  );

  if (reviewsDiv.style.display === "none") {
    reviewsDiv.style.display = "block";
    arrow.textContent = "▲";
  } else {
    reviewsDiv.style.display = "none";
    arrow.textContent = "▼";
  }
}

function openAddReviewModal(dept, courseCode) {
  const course = coursesDatabase[dept]?.find(
    (c) => c.courseCode === courseCode
  );

  if (!course) {
    console.error("Course not found:", courseCode);
    return;
  }

  const modal = document.getElementById("addReviewModal");
  const modalTitle = document.getElementById("addReviewModalTitle");
  const modalForm = document.getElementById("addReviewForm");

  modalTitle.textContent = `Add Review for ${course.courseCode}`;

  const professorsList =
    course.professors && course.professors.length > 0
      ? course.professors
      : [...new Set((course.reviews || []).map((r) => r.professor))];

  modalForm.innerHTML = `
        <div class="form-group">
            <label for="professorSelect">Professor *</label>
            ${
              professorsList.length > 0
                ? `
                <select id="professorSelect" required>
                    <option value="">Select a professor</option>
                    ${professorsList
                      .map((prof) => `<option value="${prof}">${prof}</option>`)
                      .join("")}
                    <option value="other">Other (specify below)</option>
                </select>
            `
                : ""
            }
            <div id="newProfessorContainer" style="display: ${
              professorsList.length === 0 ? "block" : "none"
            }; margin-top: 10px;">
                <input type="text" id="newProfessorInput" placeholder="Enter professor name" ${
                  professorsList.length === 0 ? "required" : ""
                }>
            </div>
        </div>

        <div class="form-group">
            <label for="semesterInput">Semester *</label>
            <input type="text" id="semesterInput" placeholder="e.g., Fall 2024" required>
        </div>

        <div class="ratings-grid">
            <div class="rating-group">
                <label>Workload *</label>
                <div class="rating-stars">
                    ${[1, 2, 3, 4, 5]
                      .map(
                        (i) =>
                          `<button type="button" class="star-btn" data-rating="workload" data-value="${i}">★</button>`
                      )
                      .join("")}
                </div>
                <input type="hidden" id="workloadRating" required>
            </div>

            <div class="rating-group">
                <label>Difficulty *</label>
                <div class="rating-stars">
                    ${[1, 2, 3, 4, 5]
                      .map(
                        (i) =>
                          `<button type="button" class="star-btn" data-rating="difficulty" data-value="${i}">★</button>`
                      )
                      .join("")}
                </div>
                <input type="hidden" id="difficultyRating" required>
            </div>

            <div class="rating-group">
                <label>Usefulness *</label>
                <div class="rating-stars">
                    ${[1, 2, 3, 4, 5]
                      .map(
                        (i) =>
                          `<button type="button" class="star-btn" data-rating="usefulness" data-value="${i}">★</button>`
                      )
                      .join("")}
                </div>
                <input type="hidden" id="usefulnessRating" required>
            </div>

            <div class="rating-group">
                <label>Overall *</label>
                <div class="rating-stars">
                    ${[1, 2, 3, 4, 5]
                      .map(
                        (i) =>
                          `<button type="button" class="star-btn" data-rating="overall" data-value="${i}">★</button>`
                      )
                      .join("")}
                </div>
                <input type="hidden" id="overallRating" required>
            </div>
        </div>

        <div class="form-group">
            <label for="commentTextarea">Your Review *</label>
            <textarea id="commentTextarea" rows="6" placeholder="Share your experience with this course..." required maxlength="1000"></textarea>
            <div class="char-count">
                <span id="charCount">0</span>/1000
            </div>
        </div>

        <div class="form-actions">
            <button type="button" class="cancel-btn" onclick="closeAddReviewModal()">Cancel</button>
            <button type="submit" class="submit-btn">Submit Review</button>
        </div>
    `;

  // Add event listeners for rating stars
  document.querySelectorAll(".star-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const ratingType = this.dataset.rating;
      const value = this.dataset.value;

      // Update hidden input
      document.getElementById(`${ratingType}Rating`).value = value;

      // Update visual stars
      const stars = this.parentElement.querySelectorAll(".star-btn");
      stars.forEach((star, index) => {
        if (index < value) {
          star.classList.add("active");
        } else {
          star.classList.remove("active");
        }
      });
    });
  });

  // Add professor select listener
  const professorSelect = document.getElementById("professorSelect");
  if (professorSelect) {
    professorSelect.addEventListener("change", toggleNewProfessor);
  }

  // Add character count listener
  const commentTextarea = document.getElementById("commentTextarea");
  const charCount = document.getElementById("charCount");
  commentTextarea.addEventListener("input", function () {
    charCount.textContent = this.value.length;
  });

  // Remove old submit handler if exists
  if (currentReviewSubmitHandler) {
    modalForm.removeEventListener("submit", currentReviewSubmitHandler);
  }

  // Create new submit handler
  currentReviewSubmitHandler = function (e) {
    submitReview(e, dept, courseCode);
  };

  // Add the new submit listener
  modalForm.addEventListener("submit", currentReviewSubmitHandler);

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function toggleNewProfessor() {
  const professorSelect = document.getElementById("professorSelect");
  const newProfessorContainer = document.getElementById(
    "newProfessorContainer"
  );
  const newProfessorInput = document.getElementById("newProfessorInput");

  if (professorSelect.value === "other") {
    newProfessorContainer.style.display = "block";
    newProfessorInput.required = true;
  } else {
    newProfessorContainer.style.display = "none";
    newProfessorInput.required = false;
    newProfessorInput.value = "";
  }
}

async function submitReview(event, dept, courseCode) {
  event.preventDefault();

  const professorSelect = document.getElementById("professorSelect");
  const newProfessorInput = document.getElementById("newProfessorInput");
  const professor =
    professorSelect && professorSelect.value === "other"
      ? newProfessorInput.value.trim()
      : professorSelect
      ? professorSelect.value
      : newProfessorInput.value.trim();

  const semester = document.getElementById("semesterInput").value.trim();
  const workload = parseInt(document.getElementById("workloadRating").value);
  const difficulty = parseInt(
    document.getElementById("difficultyRating").value
  );
  const usefulness = parseInt(
    document.getElementById("usefulnessRating").value
  );
  const overall = parseInt(document.getElementById("overallRating").value);
  const comment = document.getElementById("commentTextarea").value.trim();

  if (
    !professor ||
    !semester ||
    !workload ||
    !difficulty ||
    !usefulness ||
    !overall ||
    !comment
  ) {
    alert("Please fill in all required fields!");
    return;
  }

  const reviewData = {
    professor,
    semester,
    ratings: {
      workload,
      difficulty,
      usefulness,
      overall,
    },
    comment,
  };

  try {
    // 1. Submit the review
    const response = await fetch(`/api/courses/${courseCode}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit review");
    }

    const updatedCourse = await response.json();

    // 2. If new professor, add to professors array
    const isNewProfessor =
      (professorSelect && professorSelect.value === "other") ||
      (!professorSelect && newProfessorInput);

    if (
      isNewProfessor &&
      updatedCourse.professors &&
      !updatedCourse.professors.includes(professor)
    ) {
      // Update the course to add the new professor
      await fetch(`/api/courses/${courseCode}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professors: [...updatedCourse.professors, professor],
        }),
      });
    }

    alert("✅ Review submitted successfully!");
    closeAddReviewModal();

    // 3. Refresh data from database to ensure consistency
    await fetchCourses();

    // 4. Refresh the course detail view with fresh data
    openCourseDetail(dept, courseCode);
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("❌ Failed to submit review. Please try again.");
  }
}

function closeAddReviewModal() {
  const modal = document.getElementById("addReviewModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

function closeDetailModal() {
  const modal = document.getElementById("courseDetailModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Render department cards dynamically with live course counts
function renderDepartmentCards() {
  const gridContainer = document.getElementById("departmentsGrid");

  // If grid doesn't exist, we're probably not on the reviews page
  if (!gridContainer) return;

  const departmentInfo = {
    cs: {
      icon: "💻",
      name: "COMPUTER SCIENCE",
      code: "CS / COE / ECE",
      desc: "Core CS courses including algorithms, data structures, systems programming, and software engineering.",
    },
    infsci: {
      icon: "📊",
      name: "INFO SCIENCE",
      code: "INFSCI",
      desc: "Information sciences covering databases, information retrieval, data analytics, and information systems.",
    },
    engcmp: {
      icon: "✍️",
      name: "COMPOSITION",
      code: "ENGCMP",
      desc: "English composition and writing courses for building communication skills and technical writing.",
    },
    cmpinf: {
      icon: "🔬",
      name: "COMPUTING",
      code: "CMPINF",
      desc: "Computing and information courses covering programming, web development, and computational thinking.",
    },
    math: {
      icon: "📐",
      name: "MATHEMATICS",
      code: "MATH",
      desc: "Mathematics courses including calculus, linear algebra, discrete math, and probability theory.",
    },
    stat: {
      icon: "📈",
      name: "STATISTICS",
      code: "STAT",
      desc: "Statistics courses covering data analysis, probability, statistical inference, and machine learning.",
    },
    econ: {
      icon: "💰",
      name: "ECONOMICS",
      code: "ECON",
      desc: "Economics courses including micro, macro, econometrics, and applied economic analysis.",
    },
    phil: {
      icon: "🧠",
      name: "PHILOSOPHY",
      code: "PHIL",
      desc: "Philosophy courses including logic, ethics, epistemology, and philosophy of science.",
    },
  };

  const cardsHTML = Object.keys(departmentInfo)
    .map((dept) => {
      const info = departmentInfo[dept];
      const courseCount = coursesDatabase[dept]
        ? coursesDatabase[dept].length
        : 0;

      return `
      <button class="department-card" onclick="openModal('${dept}')">
        <div class="course-count">${courseCount} COURSE${
        courseCount !== 1 ? "S" : ""
      }</div>
        <div class="department-icon">${info.icon}</div>
        <div class="department-name">${info.name}</div>
        <div class="department-code">${info.code}</div>
        <div class="department-desc">${info.desc}</div>
      </button>
    `;
    })
    .join("");

  gridContainer.innerHTML = cardsHTML;
}

function initializeKeyboardShortcuts() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
      closeDetailModal();
      closeAddReviewModal();
    }
    if (
      e.key === "/" &&
      e.target.tagName !== "INPUT" &&
      e.target.tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      document.getElementById("searchInput").focus();
    }
  });

  // Click outside to close modals
  document
    .getElementById("modalOverlay")
    ?.addEventListener("click", function (e) {
      if (e.target === this) closeModal();
    });

  document
    .getElementById("courseDetailModal")
    ?.addEventListener("click", function (e) {
      if (e.target === this) closeDetailModal();
    });

  document
    .getElementById("addReviewModal")
    ?.addEventListener("click", function (e) {
      if (e.target === this) closeAddReviewModal();
    });
}
