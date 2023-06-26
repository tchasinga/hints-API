const baseURL = "https://us-central1-js-capstone-backend.cloudfunctions.net/api/";
const gameName = "My cool new game"; // Change this to your desired game name

let gameId;
let scores = [];

// Create a new game
async function createGame() {
  try {
    const response = await fetch(`${baseURL}games/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: gameName,
      }),
    });

    const data = await response.json();
    gameId = data.result.split("ID: ")[1]; // Extract the game ID from the response
  } catch (error) {
    console.error("Error creating game:", error);
  }
}

// Add a new score
async function addScore(user, score) {
  try {
    const response = await fetch(`${baseURL}games/${gameId}/scores/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        score: score,
      }),
    });

    const data = await response.json();
    console.log(data.result); // Log the result from the API

    // Retrieve the updated scores from the API
    await getScores();
  } catch (error) {
    console.error("Error adding score:", error);
  }
}

// Get all scores for the game
async function getScores() {
  try {
    const response = await fetch(`${baseURL}games/${gameId}/scores/`);
    const data = await response.json();
    scores = data.result; // Update the scores array
    displayScores(scores); // Display the scores on the page
  } catch (error) {
    console.error("Error getting scores:", error);
  }
}

// Event listener for the form submit
document.getElementById("score-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.getElementById("user").value;
  const score = parseInt(document.getElementById("score").value);

  document.getElementById("user").value = "";
  document.getElementById("score").value = "";

  await addScore(user, score);
});

// Event listener for the refresh button
document.getElementById("refresh-btn").addEventListener("click", async () => {
  await getScores();
});

// Initialize the game and display scores on page load
window.addEventListener("load", async () => {
  await createGame();
  await getScores();
});

// Display scores on the page
function displayScores(scores) {
  const scoresContainer = document.getElementById("scores-container");
  scoresContainer.innerHTML = "";

  scores.forEach((entry) => {
    const scoreData = document.createElement("div");
    scoreData.innerHTML = `User: ${entry.user}<br>Score: ${entry.score}<br><hr>`;
    scoresContainer.appendChild(scoreData);
  });
}

// Retrieve names and scores from the API
const refreshScores = async (gameID) => {
  try {
    const response = await fetch(`${baseURL}games/${gameID}/scores/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error retrieving scores:", error);
    return [];
  }
};
