"use strict";

var gBoardSize = 4;
const MINE = "💣";
const SHOW = "show";
const HIDE = "hide";

const MINE_IMG = '<img src="img/mine.png">';
const FLAG_IMG = '<img src="img/flag.png">';
var gBoard = buildBoard(4);
var gFirstClick = true;
var gMines = 30;

var gLevel = {
  size: 4,
  mines: 2,
};
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secPassed: 0,
  isVictory: false,
};
var gFlagCount = gLevel.mines;
//   gBoard = buildBoard();

function onLevelClicked(btn) {
  gBoard = buildBoard();
  renderBoard(gBoard);
  if (btn.innerText === "Easy") {
    gBoardSize = 4;
    gMines = 2;
  }
  if (btn.innerText === "Medium") {
    gBoardSize = 8;
    gMines = 14;
  }
  if (btn.innerText === "Hard") {
    gBoardSize = 12;
    gMines = 32;
  }
  onInit();
}

function onInit() {
  gBoard = buildBoard();
  renderBoard(gBoard);
  onCallAddMine(gMines);
}

function buildBoard() {
  var board = [];

  for (var i = 0; i < gBoardSize; i++) {
    board.push([]);
    for (var j = 0; j < gBoardSize; j++) {
      var cell = {
        location: { i: i, j: j },
        type: HIDE,
        gameElement: null,
        minesAround: 0,
        isShown: false,
        isMine: false,
        isFlaged: false,
      };
      board[i][j] = cell;
    }
  }
  //   board[1][2].isMine = true;
  //   board[1][2].gameElement = MINE;
  //   board[3][1].isMine = true;
  //   board[3][1].gameElement = MINE;

//   console.table(board);
  return board;
}

// onCallAddMine(14)

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

function onCellClicked(elCell, i, j) {
  // if (gFirstClick) setFirstClick(i, j);
  if (gBoard[i][j].type === SHOW) return;
  if (gBoard[i][j].gameElement === 0) expandShown(gBoard, i, j);
  if (gBoard[i][j].flag) return;
  else {
    handleEmptyCell(i,j)
    if (gBoard[i][j].isMine === true) {
        gFlagCount--
      // gIcon = SAD;
    //   gameOver(true);
    }
    // gameOver(isVictory());		//check if game is over
  }
  renderMinesCount()
  renderBoard(gBoard);
}

function handleEmptyCell(i,j) {
    gBoard[i][j].type = SHOW;
    gGame.shownCount++;
    console.log(gGame.shownCount);
    onCountNegsMine(onFindNegs(i, j, gBoard));
    gBoard[i][j].minesAround = onCountNegsMine(onFindNegs(i, j, gBoard));
    console.log(gBoard[i][j].minesAround);
    gBoard[i][j].gameElement = onCountNegsMine(onFindNegs(i, j, gBoard));
}

function onCellMarked(elCell, cellI, cellJ, event) {
  if (event.button === 2) {
    if (
      gBoard[cellI][cellJ].isFlaged === false &&
      gBoard[cellI][cellJ].type === HIDE
    ) {
      gBoard[cellI][cellJ].isFlaged = true;
      gFlagCount--;
      gGame.markedCount++;
      renderMinesCount();
      renderBoard(gBoard);
      return;
    }
    if ((gBoard[cellI][cellJ].flag = true)) {
      gBoard[cellI][cellJ].flag = false;
      gFlagCount++;
      renderMinesCount();
      renderBoard(gBoard);
    }
  }
}



function renderMinesCount() {
  var strHTML = "";
  strHTML =
    '<div class="mines-count"><span>Total Mines Left: ' +
    gFlagCount +
    "</span></div>";
  var elBoard = document.querySelector(".mines-container");
  elBoard.innerHTML = strHTML;
}

function onCallAddMine(count) {
  for (var i = 0; i < count; i++) {
    addMine();
  }
}

function addMine() {
  const emptyPos = getEmptyPos();
  if (!emptyPos) return;
  if (
    gBoard[emptyPos.i][emptyPos.j].gameElement !== MINE &&
    !gBoard[emptyPos.i][emptyPos.j].isMine
  )
    gBoard[emptyPos.i][emptyPos.j].gameElement = MINE;
  gBoard[emptyPos.i][emptyPos.j].isMine = true;
  renderCell(emptyPos, MINE_IMG);
  renderBoard(gBoard);
}

function getEmptyPos() {
  const emptyPoss = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!gBoard[i][j].gameElement) {
        emptyPoss.push({ i, j });
        console.log(emptyPoss);
      }
    }
  }
  var randIdx = getRandomInt(0, emptyPoss.length);
  return emptyPoss[randIdx];
}

function renderCell(location, value) {
  const cellSelector = "." + getClassName(location); // cell-i-j
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

function getClassName(location) {
  const cellClass = "cell-" + location.i + "-" + location.j;
  return cellClass;
}





function onFindEmptNegs(cellI, cellJ, board) {
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

//   }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
