const leaderboardApi = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/';
const gameID = 'vtL6cvMOxCyImcJYZjbt';

const gameName = async () => {
  const response = await fetch(`${leaderboardApi}games/`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'Tchasinga jack',
    }),
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
  });

  const id = await response.json();
  return id;
};

const showingScores = async () => {
  const receiveData = await fetch(`${leaderboardApi}games/${gameID}/scores/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await receiveData.json();
  generateScores(result.result);
};

const submitData = async (name, score, gameID) => {
  const submitData = await fetch(`${leaderboardApi}games/${gameID}/scores/`, {
    method: 'POST',
    body: JSON.stringify({
      user: name,
      score,
    }),
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
  });

  const response = await submitData.json();
  return response;
};

const generateScores = (score) => {
  const ul = document.querySelector('.content');
  ul.innerHTML = '';
  score.forEach((element) => {
    const li = document.createElement('li');
    li.innerHTML = `${element.user} : ${element.score}`;
    ul.appendChild(li);
  });
};

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

  const url = `${leaderboardApi}games/${gameID}/scores/`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      user: Name,
      score: Number,
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

window.addEventListener("load", () => {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("number").value = "";

  let existingData = JSON.parse(localStorage.getItem("savedData")) || [];

  displaySavedData(existingData);
});

function displaySavedData(data) {
  dataContainer.innerHTML = "";

  data.forEach((entry) => {
    const savedData = document.createElement("div");
    savedData.innerHTML = `Name: ${entry.name}<br>Email: ${entry.email}<br>Number: ${entry.number}<br><hr>`;
    dataContainer.appendChild(savedData);
  });
}

const submitButton = document.getElementById('submitBtn');
submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  const name = document.getElementById('name');
  const score = document.getElementById('score');
  const errDiv = document.getElementById('errDiv');
  if (name.value !== '' && score.value !== '') {
    submitData(name.value, score.value, gameID);
    name.value = '';
    score.value = '';
    showingScores();
    errDiv.style.display = 'none';
  } else if (name.value === '' && score.value === '') {
    errDiv.textContent = 'Name and Score fields are required';
    errDiv.style.display = 'block';
  } else if (name.value === '') {
    errDiv.textContent = 'Please fill in your name';
    errDiv.style.display = 'block';
  } else if (score.value === '') {
    errDiv.textContent = 'Please fill in your score';
    errDiv.style.display = 'block';
  }
});

const aLink = document.querySelector('a');
aLink.addEventListener('click', (e) => {
  e.preventDefault();
  showingScores();
});

function askReload() {
  return false;
}

window.onbeforeunload = askReload;
window.onload = () => {
  showingScores();
  askReload();
};
