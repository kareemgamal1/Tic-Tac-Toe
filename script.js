const Player = (name, choice) => {
  const getChoice = () => choice;
  const getName = () => name;

  return {
    getChoice,
    getName,
  };
};

const GameBoard = (() => {
  let firstName, secondName, firstChoice, secondChoice, playerOne, playerTwo;

  const _validateForm = () => {
    let firstInput = document.querySelector(".first-player").checkValidity();
    let secondInput = document.querySelector(".second-player").checkValidity();
    if (!firstInput || !secondInput) {
      return false;
    }
    return true;
  };

  const _inputNames = () => {
    if (_validateForm()) {
      firstName = document.querySelector(".first-player").value;
      secondName = document.querySelector(".second-player").value;
      document.querySelector(".input-container").style.display = "none";
    }
  };

  const _generateChoices = () => {
    let choices = ["x", "o"];
    firstChoice = choices[Math.floor(Math.random() * 2)];
    firstChoice == "x" ? (secondChoice = "o") : (secondChoice = "x");
  };

  const createPlayers = () => {
    _inputNames();
    _generateChoices();
    playerOne = Player(firstName, firstChoice);
    playerTwo = Player(secondName, secondChoice);
  };

  const getPlayerOne = () => {
    return playerOne;
  };

  const getPlayerTwo = () => {
    return playerTwo;
  };

  return {
    createPlayers,
    getPlayerOne,
    getPlayerTwo,
  };
})();

const displayController = ((p1, p2) => {
  let gameBoard = ["", "", "", "", "", "", "", "", ""];
  let round = 1;
  let start = document.querySelector(".start");
  let prompt = document.querySelector(".prompt");
  let playerOne;
  let playerTwo;

  start.addEventListener("click", () => {
    GameBoard.createPlayers();
    playerOne = GameBoard.getPlayerOne();
    playerTwo = GameBoard.getPlayerTwo();
    captureClicks();
  });

  const _markCell = (currentImg, choice) => {
    //when prompt is empty it means that the game hasn't ended
    if (prompt.childNodes.length == 0) {
      let ID = currentImg.id;
      gameBoard[ID - 1] = choice;
      currentImg.src = `assets/${choice}.png`;
    }
    checkDraw();
    checkResult();
  };

  const checkResult = () => {
    let winner = checkWinner();
    if (winner != undefined) {
      prompt.textContent = `${winner.getName()} has won (${winner.getChoice()})`;
    }
  };
  const captureClicks = () => {
    let allCells = document.querySelectorAll(".game-cell");
    allCells.forEach((item) => {
      item.addEventListener("click", () => {
        let currentImg = item.querySelector(".sign");
        _playerTurn(currentImg);
      });
    });
  };

  const _playerTurn = (currentImg) => {
    if (currentImg.getAttribute("src") == "assets/initial.png") {
      if (round % 2 != 0) {
        _markCell(currentImg, playerOne.getChoice());
      } else {
        _markCell(currentImg, playerTwo.getChoice());
      }
      round++;
    }
  };

  const reset = (() => {
    let rst = document.querySelector(".rst");
    rst.addEventListener("click", () => {
      round = 1;
      gameBoard = gameBoard.fill("");
      let allCells = document.querySelectorAll(".game-cell");
      allCells.forEach((item) => {
        let currentImg = item.querySelector(".sign");
        currentImg.src = "assets/initial.png";
      });
      let prompt = document.querySelector(".prompt");
      prompt.textContent = "";
    });
  })();

  const checkWinner = () => {
    let possibleCombinations = [
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
      //for each combination check if the current sum of it's characters resembles a win
      let currentCombination = "";
      combination.forEach((tableIndex) => {
        currentCombination += gameBoard[tableIndex];
      });
      if (currentCombination === "ooo" || currentCombination === "xxx") {
        return getWinner(gameBoard[[combination[0]]]);
      }
    }
  };

  const getWinner = (cell) => {
    if (cell == playerOne.getChoice()) {
      return playerOne;
    } else if ((cell = playerTwo.getChoice())) {
      return playerTwo;
    }
  };

  const checkDraw = () => {
    if (round == 9) prompt.textContent = "Draw!";
  };
})(GameBoard.getPlayerOne(), GameBoard.getPlayerTwo());
