/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let gameOver = false; //state of game
const board = []; // array of rows, each row is array of cells  (board[y][x])
const htmlBoard = document.querySelector("#board"); // select board in DOM

//"new game" button functionality
const newGame = document.querySelector("#new-game");
newGame.addEventListener("click", () => {
	board.length = 0;
	makeBoard();
	htmlBoard.innerHTML = "";
	makeHtmlBoard();
	gameOver = false;
});

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
	for (y = 0; y < HEIGHT; y++){
		board.push([]);
		for (x = 0; x < WIDTH; x++){
			board[y].push(null);
		}	
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
	// Create top row for placing a piece
	const top = document.createElement("tr");
	top.setAttribute("id", "column-top");
	top.addEventListener("click", handleClick);

	for (x = 0; x < WIDTH; x++) {
		const headCell = document.createElement("td");
		headCell.setAttribute("id", x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// Create board grid for pieces to go
	for (y = 0; y < HEIGHT; y++) {
		const row = document.createElement("tr");
		for (x = 0; x < WIDTH; x++) {
			const cell = document.createElement("td");
			cell.setAttribute("id", `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
	for (y = HEIGHT-1; y >= 0; y--){
		if (board[y][x] === null) return y;
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
	const piece = document.createElement("div");
	const piecePlace = document.getElementById(`${y}-${x}`);
	piece.classList.add(`p${currPlayer}`, "piece");
	piecePlace.append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
	setTimeout(() => {
		alert(msg)
	}, 500);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
	// prevents game from continuing if over
	if (gameOver === true) return;

	// get x from ID of clicked cell
	const x = evt.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		gameOver = true;
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	if (board.every(row => row.every(spot => spot))) {
		return endGame('Game is a Tie');
	}

	// switch players
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		return cells.every(
			([y, x]) =>
				y >= 0 &&
				y < HEIGHT &&
				x >= 0 &&
				x < WIDTH &&
				board[y][x] === currPlayer
		);
	}

	// Create 4 arrays of cordinates based on each x,y in the board to check for a possible win
	for (y = 0; y < HEIGHT; y++) {
		for (x = 0; x < WIDTH; x++) {
			const horiz  = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
			const vert   = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
			const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
			const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
