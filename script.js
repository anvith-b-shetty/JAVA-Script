document.addEventListener('DOMContentLoaded', () => {
    const singlePlayerBtn = document.getElementById('single-player-btn');
    const twoPlayerBtn = document.getElementById('two-player-btn');
    const gameSection = document.querySelector('.game');
    const player2Section = document.getElementById('player2-section');
    const player2Title = document.getElementById('player2-title');
    const player1ChoiceElem = document.getElementById('player1-choice');
    const player2ChoiceElem = document.getElementById('player2-choice');
    const resultElem = document.getElementById('result');
    const player1ScoreElem = document.getElementById('player1-score');
    const player2ScoreElem = document.getElementById('player2-score');
    const player2ScoreTitle = document.getElementById('player2-score-title');

    let singlePlayerMode = false;
    let player1Choice = '';
    let player2Choice = '';
    let player1Score = 0;
    let player2Score = 0;

    singlePlayerBtn.addEventListener('click', () => {
        singlePlayerMode = true;
        player2Title.textContent = 'Computer';
        player2ScoreTitle.textContent = 'Computer: ';
        resetScores();
        gameSection.style.display = 'block';
        player2Section.style.display = 'none';
    });

    twoPlayerBtn.addEventListener('click', () => {
        singlePlayerMode = false;
        player2Title.textContent = 'Player 2';
        player2ScoreTitle.textContent = 'Player 2: ';
        resetScores();
        gameSection.style.display = 'block';
        player2Section.style.display = 'inline-block';
    });

    document.querySelectorAll('.choice').forEach(button => {
        button.addEventListener('click', (e) => {
            const choice = e.target.getAttribute('data-choice');
            if (e.target.parentElement.querySelector('h2').textContent === 'Player 1') {
                player1Choice = choice;
                player1ChoiceElem.textContent = `Your choice: ${choice}`;
                if (singlePlayerMode) {
                    player2Choice = getComputerChoice();
                    player2ChoiceElem.textContent = `Computer's choice: ${player2Choice}`;
                    determineWinner();
                }
            } else {
                player2Choice = choice;
                player2ChoiceElem.textContent = `Your choice: ${choice}`;
                determineWinner();
            }
        });
    });

    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    function determineWinner() {
        if (player1Choice === player2Choice) {
            resultElem.textContent = "It's a tie!";
        } else if ((player1Choice === 'rock' && player2Choice === 'scissors') ||
                   (player1Choice === 'paper' && player2Choice === 'rock') ||
                   (player1Choice === 'scissors' && player2Choice === 'paper')) {
            resultElem.textContent = 'Player 1 wins!';
            player1Score++;
            player1ScoreElem.textContent = player1Score;
        } else {
            resultElem.textContent = singlePlayerMode ? 'Computer wins!' : 'Player 2 wins!';
            player2Score++;
            player2ScoreElem.textContent = player2Score;
        }
    }

    function resetScores() {
        player1Score = 0;
        player2Score = 0;
        player1ScoreElem.textContent = player1Score;
        player2ScoreElem.textContent = player2Score;
    }
});
