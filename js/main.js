"use strict";

var gBoardSize = 4;
const MINE = "💣";
const SHOW = "show";
const HIDE = "hide";
const LIFE = "❤️";

const MINE_IMG = '<img src="img/mine.png">';
const FLAG_IMG = '<img src="img/flag.png">';
var gBoard = buildBoard(4);
var gFirstClick = true;
var gMines = 2;
var gTime;
var gTimerInterval;
var gLevel = {
  size: 4,
  mines: 2,
};
var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secPassed: 0,
  isVictory: false,
  clickedMine: false,
};
var gFlagCount = 0;
//   gBoard = buildBoard();

function onLevelClicked(btn) {
  gBoard = buildBoard();
  renderBoard(gBoard);
  if (btn.innerText === "Easy") {
    gBoardSize = 4;
    gMines = 2;
    gLevel.size = 4;
    gLevel.mines = 2;
  }
  if (btn.innerText === "Medium") {
    gBoardSize = 8;
    gMines = 14;
    gLevel.size = 8;
    gLevel.mines = 14;
  }
  if (btn.innerText === "Hard") {
    gBoardSize = 12;
    gMines = 32;
    gLevel.size = 12;
    gLevel.mines = 32;
  }

  onInit();
}

function onInit() {
  gBoard = buildBoard();
  renderBoard(gBoard);
  onCallAddMine(gMines);
  onSetGameElement();
  closeModal();
  gGame.shownCount = 0;
}

function buildBoard() {
  var board = [];

  for (var i = 0; i < gBoardSize; i++) {
    board.push([]);
    for (var j = 0; j < gBoardSize; j++) {
      var cell = {
        location: { i: i, j: j },
        type: HIDE,
        gameElement: 0,
        minesAround: 0,
        isShown: false,
        isMine: false,
        isFlaged: false,
      };
      board[i][j] = cell;
    }
  }
  return board;
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j];
      var cellClass = "";
      var cellClass2 = getClassName({ i: i, j: j }) + " ";
      if (currCell.type === SHOW) cellClass += "revile";

      strHTML += `<td data-i="${i}" data-j="${j}" class="cell ${cellClass2} 
                 ${cellClass}" 
                  onmousedown="onCellMarked(this,${i},${j},event)"
                  onclick="onCellClicked(this,${i},${j})" >`;

      if (currCell.type === SHOW) {
        if (currCell.isMine === true) {
          strHTML += MINE_IMG;
        } else {
          strHTML += '<img src="img/' + currCell.gameElement + '.png">';
        }
      } else if (currCell.isFlaged === true) strHTML += FLAG_IMG;
      strHTML += "</td>";
    }
    strHTML += "</tr>";

    const elBoard = document.querySelector(".board");
    elBoard.innerHTML = strHTML;
  }
}

// console.log(onFindNegs(0, 0,gBoard));

function onFindNegs(cellI, cellJ, board) {
  var negs = [];
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;

      if (board[i][j].gameElement) negs.push(board[i][j]);
    }
  }
  return negs;
}

// console.log(countNegsMine(onFindNegs(0, 2 , gBoard)));
function onCountNegsMine(negs) {
  var count = 0;
  for (var i = 0; i < negs.length; i++) {
    if (negs[i].isMine) {
      count++;
      negs[i].minesAround = count;
    }
  }
  var elNgsCount = document.querySelector(".negs-count span");
  elNgsCount.innerText = count;
  return count;
}
//Left Click on Cell
function onCellClicked(elCell, i, j) {
  if (gGame.shownCount === 0) timer();
  if (gBoard[i][j].type === SHOW) return;
  if (gBoard[i][j].gameElement === 0) expandShown(i, j);
  if (gBoard[i][j].isFlaged) return;
  else {
    handleEmptyCell(i, j);

    if (gBoard[i][j].isMine === true) {
      gameOver(true);
      onHandleMineClicked(i, j);
    }
    var check = isVictory()
    console.log(check);
    gameOver(check);
    
  }
  renderMinesCount();
  renderBoard(gBoard);
}
//Left Click on Mine
function onHandleMineClicked(i, j) {
  for (var k = 0; k < gBoard.length; k++) {
    for (var l = 0; l < gBoard[0].length; l++) {
      if (gBoard[k][l].isMine === true) gBoard[k][l].type = SHOW;
      renderCell(gBoard[i][j].location, MINE_IMG);
    }
  }
  gGame.clickedMine = true;
}
//Left click on empty Cell
function handleEmptyCell(i, j) {
  gBoard[i][j].type = SHOW;
  gGame.shownCount++;
  console.log(gGame.shownCount);
  onCountNegsMine(onFindNegs(i, j, gBoard));
  gBoard[i][j].minesAround = onCountNegsMine(onFindNegs(i, j, gBoard));
  gBoard[i][j].gameElement = onCountNegsMine(onFindNegs(i, j, gBoard));
}
//right click on cell
function onCellMarked(elCell, cellI, cellJ, event) {
  if (event.button === 2) {
    if (
      gBoard[cellI][cellJ].isFlaged === false &&
      gBoard[cellI][cellJ].type === HIDE
    ) {
      gBoard[cellI][cellJ].isFlaged = true;
    //   gBoard[cellI][cellJ].type = SHOW;
      gGame.markedCount++;
      gLevel.mines--;
      console.log(gGame.markedCount);
      var check = isVictory()
    console.log(check);
      renderMinesCount();
      renderBoard(gBoard);
      return;
    }
    if ((gBoard[cellI][cellJ].isFlaged = true)) {
      gBoard[cellI][cellJ].isFlaged = false;
      gGame.markedCount--;
      console.log(gGame.markedCount);
      renderMinesCount();
      renderBoard(gBoard);
    }
  }

  console.log(gBoard);
}

function timer() {
  var startTime = Date.now();
  var elTimer = document.querySelector(".timer");

  gTimerInterval = setInterval(function () {
    var elapsedTime = Date.now() - startTime;
    elTimer.innerHTML = (elapsedTime / 1000).toFixed(3);
  }, 37);
}

function renderMinesCount() {
  var strHTML = "";
  strHTML =
    '<div class="mines-count"><span>Total Mines Left: ' +
    gLevel.mines +
    "</span></div>";
  var elBoard = document.querySelector(".mines-container");
  elBoard.innerHTML = strHTML;
}
//Activates addMine
function onCallAddMine(count) {
  for (var i = 0; i < count; i++) {
    addMine();
  }
}
//Add mine into a random empty location
function addMine() {
  const emptyPos = getEmptyPos();
  if (!emptyPos) return;
  if (
    gBoard[emptyPos.i][emptyPos.j].gameElement !== MINE &&
    !gBoard[emptyPos.i][emptyPos.j].isMine
  ) {
    gBoard[emptyPos.i][emptyPos.j].gameElement = MINE;
    gBoard[emptyPos.i][emptyPos.j].isMine = true;
    renderCell(emptyPos, MINE_IMG);
    renderBoard(gBoard);
  }
}
//gets the empty pos to add mine
function getEmptyPos() {
  const emptyPoss = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!gBoard[i][j].gameElement) {
        emptyPoss.push({ i, j });
        // console.log(emptyPoss);
      }
    }
  }
  var randIdx = getRandomInt(0, emptyPoss.length);
  return emptyPoss[randIdx];
}
//opens win/lose modal
function openModal(msg) {
  const elModal = document.querySelector(".modal");
  const elSpan = elModal.querySelector(".msg");
  elSpan.innerText = msg;
  elModal.style.display = "block";
}
//closes modal
function closeModal() {
  const elModal = document.querySelector(".modal");
  elModal.style.display = "none";
}
//render the cell according to its current state
function renderCell(location, value) {
  const cellSelector = "." + getClassName(location); // cell-i-j
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}
//sets the cells class in a string
function getClassName(location) {
  const cellClass = "cell-" + location.i + "-" + location.j;
  return cellClass;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//epands the cells around clicked cell using recursion
function expandShown(i, j) {
  var negs = onFindNegs2(i, j);
  for (var k = 0; k < negs.length; k++) {
    if (negs[k].isMine === false && negs[k].type === HIDE) {
      if (negs[k].gameElement !== 0) {
        negs[k].type = SHOW;
        gGame.shownCount++;
        console.log(gGame.shownCount);
      } else {
        negs[k].type = SHOW;
        expandShown(negs[k].location.i, negs[k].location.j);
      }
    }
  }
  console.log(gGame.shownCount);
}
//finds empty negs for expandShown
function onFindNegs2(cellI, cellJ) {
  var negsCount = [];
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      negsCount.push(gBoard[i][j]);
    }
  }
  return negsCount;
}
//sets the cells game element according to how many mines around it
function onSetGameElement() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (!gBoard[i][j].isMine)
        gBoard[i][j].gameElement = onCountNegsMine(onFindNegs(i, j, gBoard));
    }
  }
}

function isVictory() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      if (cell.type === HIDE && cell.isMine === false) return false;
      if (cell.isMine === true && cell.isFlaged === false) return false;
    }
  }

  openModal("You Win");
  clearInterval(gTimerInterval);
  return true
}

function gameOver(checkVictory) {
  if (checkVictory) {
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
        if (gBoard[i][j].isMine === true) {
          gBoard[i][j].type = SHOW;
        }
      }
    }
    openModal("Game Over");
    clearInterval(gTimerInterval);
  }
}
