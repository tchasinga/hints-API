const form = document.getElementById("form");
const dataContainer = document.getElementById("data-container");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let Name = document.getElementById("name").value;
  let Email = document.getElementById("email").value;
  let Number = document.getElementById("number").value;

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("number").value = "";

  const url = "https://jsonplaceholder.typicode.com/posts";
  const options = {
    method: "POST",
    body: JSON.stringify({
      name: Name,
      email: Email,
      number: Number,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);

    // Retrieve existing saved data from localStorage
    let existingData = JSON.parse(localStorage.getItem("savedData")) || [];

    // Add newly entered data to existing saved data
    existingData.push({ name: Name, email: Email, number: Number });

    // Save the updated data in localStorage
    localStorage.setItem("savedData", JSON.stringify(existingData));

    // Display all saved data on the page
    displaySavedData(existingData);
  } catch (error) {
    console.error("Error:", error);
  }
});

// Retrieve the data from localStorage on page load
window.addEventListener("load", () => {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("number").value = "";

  // Retrieve existing saved data from localStorage
  let existingData = JSON.parse(localStorage.getItem("savedData")) || [];

  // Display all saved data on the page
  displaySavedData(existingData);
});

// Display saved data on the page
function displaySavedData(data) {
  dataContainer.innerHTML = "";

  data.forEach((entry) => {
    const savedData = document.createElement("div");
    savedData.innerHTML = `Name: ${entry.name}<br>Email: ${entry.email}<br>Number: ${entry.number}<br><hr>`;
    dataContainer.appendChild(savedData);
  });
}
