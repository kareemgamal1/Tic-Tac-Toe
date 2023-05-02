// Player Factory Function
const Player = (name, choice) => {
  const getChoice = () => choice;
  const getName = () => name;

  return {
    getChoice,
    getName,
  };
};

// GameBoard Module
const GameBoard = (() => {
  let firstName, secondName, firstChoice, secondChoice, playerOne, playerTwo;
  let gameBoard = ["", "", "", "", "", "", "", "", ""];

  // Private function to validate the form
  const _validateForm = () => {
    const firstInput = document.querySelector(".first-player").checkValidity();
    const secondInput = document.querySelector(".second-player").checkValidity();
    return firstInput && secondInput;
  };

  // Private function to input names
  const _inputNames = () => {
    if (_validateForm()) {
      firstName = document.querySelector(".first-player").value;
      secondName = document.querySelector(".second-player").value;
      document.querySelector(".input-container").style.display = "none";
    }
  };

  // Private function to generate choices
  const _generateChoices = () => {
    const choices = ["x", "o"];
    firstChoice = choices[Math.floor(Math.random() * 2)];
    firstChoice === "x" ? (secondChoice = "o") : (secondChoice = "x");
  };

  // Public function to create players
  const createPlayers = () => {
    _inputNames();
    _generateChoices();
    playerOne = Player(firstName, firstChoice);
    playerTwo = Player(secondName, secondChoice);
  };

  // Public function to get player one
  const getPlayerOne = () => {
    return playerOne;
  };

  // Public function to get player two
  const getPlayerTwo = () => {
    return playerTwo;
  };

  return {
    createPlayers,
    getPlayerOne,
    getPlayerTwo,
    gameBoard,
  };
})();

// Display Controller Module
const displayController = ((p1, p2) => {
  let round = 1;
  let prompt = document.querySelector(".prompt");

  // Event listener to start the game
  const start = document.querySelector(".start");
  start.addEventListener("click", () => {
    GameBoard.createPlayers();
    const playerOne = GameBoard.getPlayerOne();
    const playerTwo = GameBoard.getPlayerTwo();
    captureClicks(playerOne, playerTwo);
  });

  // Private function to mark a cell
  const _markCell = (currentImg, choice) => {
    // When prompt is empty, the game hasn't ended
    if (prompt.childNodes.length === 0) {
      const ID = currentImg.id;
      GameBoard.gameBoard[ID - 1] = choice;
      currentImg.src = `assets/${choice}.png`;
    }
    checkDraw();
    checkResult();
  };

  // Private function to check the game result
  const checkResult = () => {
    const winner = checkWinner();
    if (winner !== undefined) {
      prompt.textContent = `${winner.getName()} has won (${winner.getChoice()})`;
    }
  };

  // Private function to capture cell clicks
  const captureClicks = (playerOne, playerTwo) => {
    const allCells = document.querySelectorAll(".game-cell");
    allCells.forEach((item) => {
      item.addEventListener("click", () => {
        const currentImg = item.querySelector(".sign");
        _playerTurn(currentImg, playerOne, playerTwo);
      });
    });
  };

  // Private function to handle player turns
  const _playerTurn = (currentImg, playerOne, playerTwo) => {
    if (currentImg.getAttribute("src") === "assets/initial.png") {
      if (round % 2 !== 0) {
        _markCell(currentImg, playerOne.getChoice());
      } else {
        _markCell(currentImg, playerTwo.getChoice());
      }
      round++;
    }
  };

  // Private function to reset the game
  const reset = (() => {
    const rst = document.querySelector(".rst");
    rst.addEventListener("click", () => {
      round = 1;
      GameBoard.gameBoard = GameBoard.gameBoard.fill("");
      const allCells = document.querySelectorAll(".game-cell");
      allCells.forEach((item) => {
        const currentImg = item.querySelector(".sign");
        currentImg.src = "assets/initial.png";
      });
      prompt.textContent = "";
    });
  })();

  // Private function to check the winner
  const checkWinner = () => {
    const possibleCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const combination of possibleCombinations) {
      // For each combination, check if the current sum of its characters resembles a win
      let currentCombination = "";
      combination.forEach((tableIndex) => {
        currentCombination += GameBoard.gameBoard[tableIndex];
      });
      if (currentCombination === "ooo" || currentCombination === "xxx") {
        return getWinner(GameBoard.gameBoard[[combination[0]]]);
      }
    }
  };

  // Private function to get the winner
  const getWinner = (cell) => {
    if (cell === p1.getChoice()) {
      return p1;
    } else if (cell === p2.getChoice()) {
      return p2;
    }
  };

  // Private function to check for a draw
  const checkDraw = () => {
    if (round === 9) prompt.textContent = "Draw!";
  };
})(GameBoard.getPlayerOne(), GameBoard.getPlayerTwo());