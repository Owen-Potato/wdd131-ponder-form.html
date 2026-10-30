
// grab the form elements from the DOM
const form = document.querySelector("#fsyForm");
const travelRange = document.querySelector("#travelRange");
const notesContainer = document.querySelector("#notesContainer");
const notes = document.querySelector("#notes");
const output = document.querySelector("#output");
const campusBoxes = document.querySelectorAll('input[name="campus"]');

function updateNotesField() {
  // Show the travel notes if they are choosing many campuses and require it
  const needsNotes = travelRange.value === "many"; // match your <option> value
  notesContainer.hidden = !needsNotes;
  if (!needsNotes) notes.value = "";
}

travelRange.addEventListener("change", updateNotesField);
updateNotesField();

// Ensure they choose a date later than the current date
function isPastDate(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const chosen = new Date(value + "T00:00:00"); // parse as local time
  return chosen <= today; // today counts as not "later"
}

function getSelectedCampuses() {
  // Array.from converts a NodeList into a real array so you can use .filter and .map
  return Array.from(campusBoxes)
    .filter(box => box.checked)
    .map(box => box.value);
}

// keeps user text from being interpreted as HTML
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// run a function when the user submits the form
form.addEventListener("submit", function (event) {
  event.preventDefault();
  output.textContent = "";

  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const type = form.travelRange.value;
  const availableDate = form.availableDate.value;
  const selectedCampuses = getSelectedCampuses();
  const note = form.notes.value.trim();

  // Validate the input
  if (selectedCampuses.length === 0) {
    output.textContent = "Por favor, Please select at least one campuso.";
    return;
  }

  // Many campuses requires at least two selected
  if (type === "many" && selectedCampuses.length < 2) {
    output.textContent = "You chose many campuses, so please select at least two.";
    return;
  }

  // Many campuses requires a note
  if (type === "many" && note === "") {
    output.textContent = "Please add a note explaining your travel preferences.";
    return;
  }

  if (!availableDate) {
    output.textContent = "Please choose an available date.";
    return;
  }

  if (isPastDate(availableDate)) {
    output.textContent = "Please choose a later date.";
    return;
  }

  output.innerHTML = `
    <h2>Preference Submitted</h2>
    <p>${escapeHTML(firstName)} ${escapeHTML(lastName)}</p>
    <p>Email: ${escapeHTML(email)}</p>
    <p>Availability: ${escapeHTML(availableDate)}</p>
    <p>Campuses: ${escapeHTML(selectedCampuses.join(", "))}</p>
    <p>Preference Level: ${escapeHTML(type)}</p>
    ${note ? `<p>Notes: ${escapeHTML(note)}</p>` : ""}
  `;

  form.reset();
  updateNotesField();
});