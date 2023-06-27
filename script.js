window.addEventListener('DOMContentLoaded', (event) => {
  getScores();
});

document.getElementById('score-form').addEventListener('submit', submitScore);
document.getElementById('refresh-btn').addEventListener('click', getScores);

function getScores() {
  fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/')
    .then(response => response.json())
    .then(data => {
      displayScores(data.result);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function displayScores(scores) {
  const scoresContainer = document.getElementById('scores-container');
  scoresContainer.innerHTML = '';

  if (scores.length === 0) {
    scoresContainer.innerText = 'No scores available.';
    return;
  }

  const scoresList = document.createElement('ul');
  scores.forEach(score => {
    const scoreItem = document.createElement('li');
    scoreItem.innerText = `${score.user}: ${score.score}`;
    scoresList.appendChild(scoreItem);
  });

  scoresContainer.appendChild(scoresList);
}

function submitScore(event) {
  event.preventDefault();

  const user = document.getElementById('user').value;
  const score = document.getElementById('score').value;

  const formData = {
    user: user,
    score: score
  };

  fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/:id/scores/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response:', data);
      getScores();
    })
    .catch(error => {
      console.log('Error:', error);
    });

  document.getElementById('user').value = '';
  document.getElementById('score').value = '';
}
