const WIDTH = 10;
const BOMB_COUNT = 20;

const gridElement = document.querySelector('.grid');
const gameOverElement = document.querySelector('#gameover');

const squareElements = [];
let isGameOver = false;
let flagAmount = 0;

function createBoard() {
  const bombs = Array(BOMB_COUNT).fill('bomb');
  const emptyFields = Array(WIDTH*WIDTH - BOMB_COUNT).fill('empty');
  const minesweeperFields = bombs.concat(emptyFields)
    .sort(() => Math.random() - 0.5);

  for (let i = 0; i < WIDTH * WIDTH; i++) {
    const squareElement = document.createElement('div');
    squareElement.dataset.fieldType = minesweeperFields[i];
    squareElement.classList.add(minesweeperFields[i]);
    gridElement.appendChild(squareElement);
    squareElements.push(squareElement);

    squareElement.addEventListener('click', function() {
      onSquareElementClick(squareElement);
    });

    squareElement.addEventListener('contextmenu', function(evt) {
      evt.preventDefault();
      addFlag(squareElement);
    })
  }

  //add numbers
  for (let i = 0; i < squareElements.length; i++) {
    let total = 0;
    const isLeftEdge = (i % WIDTH === 0);
    const isRightEdge = (i % WIDTH === WIDTH - 1);

    if (squareElements[i].dataset.fieldType === 'empty') {
      // top square
      if (i > (WIDTH - 1) && squareElements[i - WIDTH].dataset.fieldType === 'bomb') { total++; }
      // top right square
      if (i > (WIDTH - 1) && !isRightEdge && squareElements[i - WIDTH + 1].dataset.fieldType === 'bomb') { total++; }
      // right square
      if (!isRightEdge && squareElements[i + 1].dataset.fieldType === 'bomb') { total++; }
      // bottom right square
      if (i < WIDTH * (WIDTH - 1) && !isRightEdge && squareElements[i + WIDTH + 1].dataset.fieldType === 'bomb') { total++; }
      // bottom square
      if (i < WIDTH * (WIDTH - 1) && squareElements[i + WIDTH].dataset.fieldType === 'bomb') { total++; }
      // bottom left square
      if (i < WIDTH * (WIDTH - 1) && !isLeftEdge && squareElements[i + WIDTH - 1].dataset.fieldType === 'bomb') { total++; }
      // left square
      if (!isLeftEdge && squareElements[i - 1].dataset.fieldType === 'bomb') { total++; }
      // top left square
      if (i > (WIDTH - 1) && !isLeftEdge && squareElements[i - WIDTH - 1].dataset.fieldType === 'bomb') { total++; }

      squareElements[i].dataset.total = total;
    }
  }
}

function onSquareElementClick(squareElement) {
  if (isGameOver || squareElement.dataset.isChecked || squareElement.dataset.isFlagged) {
    return;
  }

  if (squareElement.dataset.fieldType === 'bomb') {
    gameOver('fail');
    return;
  }

  openSquare(squareElement);
}

function gameOver(result) {
  isGameOver = true;
  gameOverElement.classList.add('over');
  gameOverElement.classList.add('animate__fadeInDownBig');

  if (result === 'win') {
    gameOverElement.classList.add('win');
    gameOverElement.innerText = '🎉 YOU WON!!! 🎉';
  } else if (result === 'fail') {
    squareElements.forEach(squareElement => {
      if (squareElement.dataset.fieldType === 'bomb') {
        squareElement.innerHTML = '💣';
      }
    });
    gameOverElement.classList.add('fail');
    gameOverElement.innerText = '💀 YOU LOST 👻';
  }
}

function openSquare(squareElement) {
  if (squareElement.dataset.isChecked) {
    return;
  }

  squareElement.dataset.isChecked = 'isChecked';
  squareElement.classList.add('checked');

  const total = squareElement.dataset.total;
  if (total != 0) {
    squareElement.innerText = total;
    return;
  }

  const id = squareElements.indexOf(squareElement);
  const isLeftEdge = (id % WIDTH === 0);
  const isRightEdge = (id % WIDTH === WIDTH - 1);

  setTimeout(() => {
    // top square
    if (id > (WIDTH - 1)) { openSquare(squareElements[id - WIDTH]); }
    // top right square
    if (id > (WIDTH - 1) && !isRightEdge) { openSquare(squareElements[id - WIDTH + 1]); }
    // right square
    if (!isRightEdge) { openSquare(squareElements[id + 1]); }
    // bottom right square
    if (id < WIDTH * (WIDTH - 1) && !isRightEdge) { openSquare(squareElements[id + WIDTH + 1]); }
    // bottom square
    if (id < WIDTH * (WIDTH - 1)) { openSquare(squareElements[id + WIDTH]); }
    // bottom left square
    if (id < WIDTH * (WIDTH - 1) && !isLeftEdge) { openSquare(squareElements[id + WIDTH - 1]); }
    // left square
    if (!isLeftEdge) { openSquare(squareElements[id - 1]); }
    // top left square
    if (id > (WIDTH - 1) && !isLeftEdge) { openSquare(squareElements[id - WIDTH - 1]); }
  }, 10);
}

function addFlag(squareElement) {
  if (isGameOver) {
    return;
  }

  if (!squareElement.dataset.isChecked && (flagAmount < BOMB_COUNT)) {
    if (!squareElement.dataset.isFlagged) {
      squareElement.dataset.isFlagged = 'isFlagged';
      squareElement.innerHTML = '🚩';
      flagAmount++;
      checkForWin();
    } else {
      squareElement.dataset.isFlagged = '';
      squareElement.innerHTML = '';
      flagAmount--;
    }
  }
}

function checkForWin() {
  let matches = 0;

  for (let i = 0; i < squareElements.length; i++) {
    if (squareElements[i].dataset.isFlagged && squareElements[i].dataset.fieldType === 'bomb') {
      matches++;
      if (matches === BOMB_COUNT) {
        gameOver('win');
      }
    }
  }
}

createBoard();
