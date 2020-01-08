var slots = $(".slot");
var currentColor = "yellow";
var player = 0;
var showPlayer1 = $("#player1 .player-button");
var showPlayer2 = $("#player2 .player-button");
var startButton = $("#start-button");
var result = $("#result");
var computer = false;
var level;
var col_result = 0;
var nextMove;
var newCoin = $(".new-coin");

var matrix = [[], [], [], [], [], [], []];

function startGame() {
  startButton.text("Start");
  startButton.addClass("on");
  player = 1;
  currentColor = "yellow";
  startButton.on("click", function() {
    startButton.removeClass("on");
    showPlayer1.addClass("active");
    makeAMove();
  });
  $("#human").on("click", function() {
    computer = false;
    $(".image-container div img").addClass("image-opacity");
    $("#human img").removeClass("image-opacity");
  });
  $("#computer_small").on("click", function() {
    computer = true;
    level = 1;
    $(".image-container div img").addClass("image-opacity");
    $("#computer_small img").removeClass("image-opacity");
  });
  $("#computer_large").on("click", function() {
    computer = true;
    level = 2;
    $(".image-container div img").addClass("image-opacity");
    $("#computer_large img").removeClass("image-opacity");
  });
}
startGame();

function resetGame() {
  $("body").css("background-color", "rgba(50, 50, 50)");

  newCoin.off("mouseover");
  newCoin.off("click");
  startButton.addClass("on");
  startButton.text("Reset");

  startButton.on("click", function() {
    newCoin.off("mouseover");
    newCoin.off("click");

    $(".player-button").removeClass("active");
    matrix = [[], [], [], [], [], [], []];

    slots.removeClass("yellow");
    slots.removeClass("red");
    result.removeClass("active");
    startGame();
  });
}

function changePlayer() {
  if (player == 1) {
    player = 2;
    currentColor = "red";
    showPlayer1.removeClass("active");
    showPlayer2.addClass("active");
    makeAMove();
  } else if (player == 2) {
    player = 1;
    currentColor = "yellow";
    showPlayer2.removeClass("active");

    showPlayer1.addClass("active");
    makeAMove();
  } else {
    return;
  }
}

function makeAMove() {
  newCoin.off();
  if (computer && player == 2) {
    makeComputerMove();
  } else {
    newCoin.on("mouseover", function(e) {
      newCoin.removeClass("yellow");
      newCoin.removeClass("red");
      $(e.target).addClass(currentColor);
      $(e.target).animate(
        {
          top: "+=10px"
        },
        300
      );
      $(e.target).animate(
        {
          top: "-=10px"
        },
        300
      );
    });

    newCoin.on("click", function(e) {
      newCoin.removeClass("yellow");
      newCoin.removeClass("red");

      var colIndex = parseInt(e.target.id - 1);

      if (matrix[colIndex].length < 6) {
        animateCoins(colIndex);
        newCoin.off();
        setTimeout(function() {
          slots
            .eq(7 * (5 - matrix[colIndex].length) + colIndex)
            .addClass(currentColor);
          matrix[colIndex].push(player);

          checkResult();
          if (!result.hasClass("active")) {
            changePlayer();
          }
        }, 900 - matrix[colIndex].length * 128);
      }
    });
  }
}

function checkResult() {
  function checkColumns() {
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (checkValidity(i, j + 3)) {
          if (
            matrix[i][j] == matrix[i][j + 1] &&
            matrix[i][j] == matrix[i][j + 2] &&
            matrix[i][j] == matrix[i][j + 3]
          ) {
            blink("columns", i, j);
            showWinner(i, j);
          }
        }
      }
    }
  }
  function checkRows() {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 5; j++) {
        if (checkValidity(j + 3, i)) {
          if (
            matrix[j][i] == matrix[j + 1][i] &&
            matrix[j][i] == matrix[j + 2][i] &&
            matrix[j][i] == matrix[j + 3][i]
          ) {
            blink("rows", i, j);

            showWinner(i, j);
          }
        }
      }
    }
  }

  function checkDiagonal() {
    for (var i = 0; i < matrix.length - 1; i++) {
      for (var j = 0; j < 6; j++) {
        if (checkValidity(i + 3, j + 3)) {
          if (
            matrix[i][j] == matrix[i + 1][j + 1] &&
            matrix[i][j] == matrix[i + 2][j + 2] &&
            matrix[i][j] == matrix[i + 3][j + 3]
          ) {
            blink("diagonal_1", i, j);
            showWinner(j, i);
          }
        }
        if (checkValidity(i + 3, j - 3)) {
          if (
            matrix[i][j] == matrix[i + 1][j - 1] &&
            matrix[i][j] == matrix[i + 2][j - 2] &&
            matrix[i][j] == matrix[i + 3][j - 3]
          ) {
            blink("diagonal_2", i, j);
            showWinner(j, i);
          }
        }
      }
    }
  }

  checkRows();
  checkColumns();
  checkDiagonal();
}

function animateCoins(col) {
  var colHeight = matrix[col].length;

  function animation(color) {
    for (var i = 5; i >= colHeight; i--) {
      $(".c" + col + ".r" + i)
        .removeClass("yellow")
        .removeClass("red")

        .addClass(color)
        .delay((6 - i) * 122.7)
        .animate(
          {
            top: "+=120px"
          },
          300
        );
    }
  }
  animation(currentColor);

  $(".falling-coin").css("top", "-70px");
}

function showWinner() {
  var currentColorCap =
    currentColor.substring(0, 1).toUpperCase() + currentColor.substring(1);
  $("#result p").text(currentColorCap + " wins!");
  result.addClass(currentColor);
  result.addClass("active");
  $("body").css("background-color", currentColor);
  setTimeout(function() {
    resetGame();
  }, 500);
}

function blink(blinkClass, i, j) {
  var blinkingColor;
  if (player == 1) {
    blinkingColor = "yellow";
  } else if (player == 2) {
    blinkingColor = "red";
  }
  var k = 0;

  blink2(blinkClass);
  function blink2(blinkClass) {
    if (k >= 4) {
      return;
    }
    k++;

    if (blinkClass == "rows") {
      setTimeout(function() {
        for (var l = 0; l < 4; l++) {
          $(".c" + (j + l) + ".r" + i)
            .parent()
            .removeClass(blinkingColor);
        }
        setTimeout(function() {
          for (var m = 0; m < 4; m++) {
            $(".c" + (j + m) + ".r" + i)
              .parent()
              .addClass(blinkingColor);
          }
          blink2(blinkClass);
        }, 200);
      }, 200);
    } else if (blinkClass == "columns") {
      setTimeout(function() {
        for (var l = 0; l < 4; l++) {
          $(".c" + i + ".r" + (j + l))
            .parent()
            .removeClass(blinkingColor);
        }
        setTimeout(function() {
          for (var m = 0; m < 4; m++) {
            $(".c" + i + ".r" + (j + m))
              .parent()
              .addClass(blinkingColor);
          }
          blink2(blinkClass);
        }, 200);
      }, 200);
    } else if (blinkClass == "diagonal_1") {
      setTimeout(function() {
        for (var l = 0; l < 4; l++) {
          $(".c" + (i + l) + ".r" + (j + l))
            .parent()
            .removeClass(blinkingColor);
        }
        setTimeout(function() {
          for (var m = 0; m < 4; m++) {
            $(".c" + (i + m) + ".r" + (j + m))
              .parent()
              .addClass(blinkingColor);
          }
          blink2(blinkClass);
        }, 200);
      }, 200);
    } else if (blinkClass == "diagonal_2") {
      setTimeout(function() {
        for (var l = 0; l < 4; l++) {
          $(".c" + (i + l) + ".r" + (j - l))
            .parent()
            .removeClass(blinkingColor);
        }
        setTimeout(function() {
          for (var m = 0; m < 4; m++) {
            $(".c" + (i + m) + ".r" + (j - m))
              .parent()
              .addClass(blinkingColor);
          }
          blink2(blinkClass);
        }, 200);
      }, 200);
    }
  }
}

function makeComputerMove() {
  var arrayMoveOptions = [];
  var newArrayMoveOptions = [];

  if (level == 1) {
    var columnComputer = Math.floor(Math.random() * 7);

    setTimeout(function() {
      matrix[columnComputer].push(player);
      $(".c" + columnComputer + ".r" + (matrix[columnComputer].length - 1))
        .parent()
        .addClass(currentColor);
      var blinkingColor = currentColor;

      //redundancy:
      setTimeout(function() {
        $(".c" + columnComputer + ".r" + (matrix[columnComputer].length - 1))
          .parent()
          .removeClass(blinkingColor);

        setTimeout(function() {
          $(".c" + columnComputer + ".r" + (matrix[columnComputer].length - 1))
            .parent()
            .addClass(blinkingColor);
        }, 200);
      }, 200);

      checkResult();
      if (!result.hasClass("active")) {
        changePlayer();
      }
    }, 1500);
  } else if (level == 2) {
    calculateMove();

    function calculateMove() {
      for (var i = 0; i < matrix.length; i++) {
        col_result = 0;
        matrix[i].push(player);

        function calcIndex(player, factor) {
          var j = matrix[i].length - 1;

          //col down
          if (j < 6 && checkValidity(i, j - 1) && matrix[i][j - 1] == player) {
            col_result += 1 * factor;
            if (checkValidity(i, j - 2) && matrix[i][j - 2] == player) {
              col_result += 3 * factor;
              if (checkValidity(i, j - 3) && matrix[i][j - 3] == player) {
                col_result += 20 * factor;
              }
            }
          }

          //row right
          if (
            checkValidity(i + 1, matrix[i].length - 1) &&
            matrix[i + 1][matrix[i].length - 1] == player
          ) {
            col_result += 1 * factor;
            if (
              checkValidity(i + 2, matrix[i].length - 1) &&
              matrix[i + 2][matrix[i].length - 1] == player
            ) {
              col_result += 3 * factor;
              if (
                checkValidity(i + 3, matrix[i].length - 1) &&
                matrix[i + 3][matrix[i].length - 1] == player
              ) {
                col_result += 20 * factor;
              }
            }
          }

          //row left
          if (
            checkValidity(i - 1, matrix[i].length - 1) &&
            matrix[i - 1][matrix[i].length - 1] == player
          ) {
            col_result += 1 * factor;
            if (
              checkValidity(i - 2, matrix[i].length - 1) &&
              matrix[i - 2][matrix[i].length - 1] == player
            ) {
              col_result += 3 * factor;
              if (
                checkValidity(i - 3, matrix[i].length - 1) &&
                matrix[i - 3][matrix[i].length - 1] == player
              ) {
                col_result += 20 * factor;
              }
            }
          }
          if (
            checkValidity(i + 1, matrix[i].length) &&
            matrix[i + 1][matrix[i].length] == player
          ) {
            col_result += 1 * factor;
            if (
              checkValidity(i + 2, matrix[i].length + 1) &&
              matrix[i + 2][matrix[i].length - 1] == player
            ) {
              col_result += 3 * factor;
              if (
                checkValidity(i + 3, matrix[i].length + 2) &&
                matrix[i + 3][matrix[i].length + 2] == player
              ) {
                col_result += 20 * factor;
              }
            }
          }

          //dia right down
          if (
            checkValidity(i + 1, matrix[i].length - 2) &&
            matrix[i + 1][matrix[i].length - 2] == player
          ) {
            col_result += 1 * factor;
            if (
              checkValidity(i + 2, matrix[i].length - 3) &&
              matrix[i + 2][matrix[i].length - 3] == player
            ) {
              col_result += 3 * factor;
              if (
                checkValidity(i + 3, matrix[i].length - 4) &&
                matrix[i + 3][matrix[i].length - 4] == player
              ) {
                col_result += 20 * factor;
              }
            }
          }

          //dia left down
          if (
            checkValidity(i - 1, matrix[i].length - 2) &&
            matrix[i - 1][matrix[i].length - 2] == player
          ) {
            col_result += 1 * factor;
            if (
              checkValidity(i - 2 && matrix[i].length - 3) &&
              matrix[i - 2][matrix[i].length - 3] == player
            ) {
              col_result += 3 * factor;
              if (
                checkValidity(i - 3, matrix[i].length - 4) &&
                matrix[i - 3][matrix[i].length - 4] == player
              ) {
                col_result += 20 * factor;
              }
            }
          }

          //dia left up
          if (
            checkValidity(i - 1, matrix[i].length) &&
            matrix[i - 1][matrix[i].length] == player
          ) {
            col_result += 1 * factor;
            if (
              checkValidity(i - 2, matrix[i].length + 1) &&
              matrix[i - 2][matrix[i].length + 1] == player
            ) {
              col_result += 3 * factor;
              if (
                checkValidity(i - 3, matrix[i].length + 2) &&
                matrix[i - 3][matrix[i].length + 2] == player
              ) {
                col_result += 20 * factor;
              }
            }
          }
          arrayMoveOptions.push(col_result);
        }
        calcIndex("2", 1.2);
        calcIndex("1", 1);
        matrix[i].pop(player);
      }

      for (var n = 0; n < 14; n += 2) {
        newArrayMoveOptions.push(arrayMoveOptions[n] + arrayMoveOptions[n + 1]);
      }

      for (var o = 0; o < arrayMoveOptions.length; o++) {
        if (
          newArrayMoveOptions[o] == Math.max(...newArrayMoveOptions) &&
          newArrayMoveOptions[o] > 0
        ) {
          nextMove = newArrayMoveOptions.indexOf(newArrayMoveOptions[o]);
          break;
        } else {
          nextMove = Math.floor(Math.random() * 7);
        }
      }
      return nextMove;
    }

    setTimeout(function() {
      matrix[nextMove].push(player);
      var blinkingColor = currentColor;
      $(".c" + nextMove + ".r" + (matrix[nextMove].length - 1))
        .parent()
        .addClass(blinkingColor);

      setTimeout(function() {
        $(".c" + nextMove + ".r" + (matrix[nextMove].length - 1))
          .parent()
          .removeClass(blinkingColor);

        setTimeout(function() {
          $(".c" + nextMove + ".r" + (matrix[nextMove].length - 1))
            .parent()
            .addClass(blinkingColor);
        }, 200);
      }, 200);

      checkResult();
      if (!result.hasClass("active")) {
        changePlayer();
      }
    }, 1500);
  }
}

function checkValidity(arg1, arg2) {
  if (matrix[arg1]) {
    if (matrix[arg1][arg2]) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
