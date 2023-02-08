/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = [];   // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
    // TODO: set "board" to empty HEIGHT x WIDTH matrix array
    for (let y = 0; y - HEIGHT; y++) {
        board.push(Array.from({ length: WIDTH }));
    }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
    const board = document.getElementById("board")
    // TODO: add comment for this code
    // This code creates the top row and each of it's cells, gives it an id="column-top", and adds the click listener(to be defined later) for each column where we will click to drop pieces, then appends it to the board
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    // the loop that creates the cells and appends them
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }

    board.append(top);

    // TODO: add comment for this code
    // A for loop that creates a row/"tr" for every iteration. Each "tr" is given an id that increment from 0-HEIGHT(HEIGHT = 6), starting with 0-0 first row, then 1-0 for second row, and so on. Then appends them to the board. 
    //The variable y designates how many *rows in total*(both y and x depend on earlier designated HEIGHT/WIDTH).
    // Variable x holds how many *cells per row.* 
    //Next, the "td" are created, with id's set to their position in the table: we can examine the console html to see this displayed. When the rows and their cells are created we append them to the board, making main part of board.
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            row.append(cell);
        }
        board.append(row);
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
    // TODO: write the real version of this, rather than always returning 0
    // return 0;
    // This code designates a "column" and how deep it is for piece placement, checking to see if it is already filled at any point
    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (!board[y][x]) {
            return y;
        }
    }
    return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
    // TODO: make a div and insert into correct table cell
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${currPlayer}`);//designates which player dropped the piece
    piece.style.top = -50 * (y + 2);// sets piece top -50 px from where it is placed in the table 

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
    // I originally had a problem with the click listener. At first, I thought it was not working at all, not listening for the click. After testing, I realized I had not appended the game piece upon the event of clicking. So, it wasn't the click listener, it was the div that that click creates. I created the click, but didn't finish ordering it "what to do."
}

/** endGame: announce game end */

function endGame(msg) {
    // TODO: pop up alert message
    alert(msg) // specific msg is designated later
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
    // get x from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    board[y][x] = currPlayer
    placeInTable(y, x);
    //sets player position to wherever is clicked and places in table

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    // checks to see if every cell has been filled before a winner has been declared. This would = a tie
    if (board.every(row => row.every(cell => cell))) {
        return endGame('Tie!');
    }

    // switch players
    // TODO: switch currPlayer 1 <-> 2
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

    // TODO: read and understand this code. Add comments to help you.
    // This code iterates through the Connect Four board. 
    // The outer loop is iterating through each row of the board (HEIGHT) while the inner loop is iterating through each column (WIDTH) of the board.
    // The two loops together = looping cell by cell
    // The four constants (horiz, vert, diagDR, and diagDL) represent all possible ways to win - horizontally, vertically, diagonally from the bottom left to the top right, and diagonally from the bottom right to the top left.
    // The four constants account for each potential location/relationship of connecting matching pieces.

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

            // Use the _win() function to check if any of the four constants in fact contain four connected matching pieces.
            // If so, then the game is won and the function returns true.
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard();
makeHtmlBoard();
