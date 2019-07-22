function randomChoice(array, choices) {
    let c = [];
    let out = [];
    let index = 0;
    while (c.length <= choices) {
        index = Math.floor(Math.random()*array.length);
        if (!(index in c)) {
            c.push(index);
        }
    }
    c.forEach(i => {
        out.push(array[i]);
    });
    return out
}

function pickFromRange(end, choices) {
    let c = [Math.floor(Math.random()*end)];
    // let out = [];
    while (c.length < choices) {
        index = Math.round(Math.random()*end);
        if (!c.includes(index)) {
            c.push(index);
        }
    }
    // console.log(c.length);
    if (c.length != choices) return pickFromRange(end, choices);
    return c
}

function num2name(num) {
    switch (num) {
        case 1:
            return "one";
        case 2:
            return "two";
        case 3:
            return "three";
        case 4:
            return "four";
        case 5:
            return "five";
        case 6:
            return "six";
        case 8:
            return "eight";
        case 9:
            return "nine";
        default:
            return "";
    }
}


let board = {
    rows: 16,
    cols: 16,
    array: [[]],
    mines: 40,
    startTime: Date.now(),
    timer: 0,
    inGame: false,
    tableElement: document.createElement('table'),
    minesMarked: 0,
    newGame: () => {
        document.getElementById("face").innerText = "😐";
        board.array = [[]];
        let bombs = pickFromRange(board.cols*board.rows, board.mines);
        for (let i = 0; i < board.rows; i ++) {
            for (let j = 0; j < board.cols; j++) {
                board.array[i].push(0);
            }
            board.array.push([]);
        }
        board.array.pop();
        for (let i = 0; i < bombs.length; i++) {
            // index = x * width + y;
            let index = bombs[i];
            let y = Math.floor(index / board.rows);
            let x = Math.floor((index - y)%board.cols);
            // console.log(index, x, y);
            board.array[x][y] = 'B';
        }
        // board.fillBoard()
        board.inGame = false;
        board.minesMarked = 0;
        settingsElement.style = "display: none";
        return board.array;
    },

    fillBoard: () => {
        for (let i = 0; i < board.rows; i ++) {
            for (let j = 0; j < board.cols; j++) {
                let neighbors;
                // console.log(i, j);
                if (i == 0 && j == 0) {
                    neighbors = [board.array[ i ][ j ], board.array[ i ][j+1],
                                 board.array[i+1][ j ], board.array[i+1][j+1]];
                }
                else if (i == board.rows-1 && j == board.cols-1) {
                    neighbors = [board.array[i-1][j-1], board.array[ i ][j-1],
                                 board.array[i-1][ j ], board.array[ i ][ j ]];
                }
                else if (i == board.rows-1 && j == 0) {
                    neighbors = [board.array[i-1][ j ], board.array[i-1][j+1],
                                 board.array[ i ][ j ], board.array[ i ][j+1]];
                }
                else if (i == 0 && j == board.cols-1) {
                    neighbors = [board.array[ i ][j-1], board.array[ i ][ j ],
                                 board.array[i+1][j-1], board.array[i+1][ j ]];
                }
                else if (i == 0) {
                    neighbors = [board.array[ i ][j-1], board.array[ i ][ j ], board.array[ i ][j+1],
                                 board.array[i+1][j-1], board.array[i+1][ j ], board.array[i+1][j+1]];
                }
                else if (j == 0) {
                    neighbors = [board.array[i-1][ j ], board.array[i-1][j+1],
                                 board.array[ i ][ j ], board.array[ i ][j+1],
                                 board.array[i+1][ j ], board.array[i+1][j+1]];
                }
                else if (i == board.rows-1) {
                    neighbors = [board.array[i-1][j-1], board.array[i-1][ j ], board.array[i-1][j+1],
                                 board.array[ i ][j-1], board.array[ i ][ j ], board.array[ i ][j+1]];
                }
                else if (j == board.cols-1) {
                    neighbors = [board.array[i-1][j-1], board.array[i-1][ j ],
                                 board.array[ i ][j-1], board.array[ i ][ j ],
                                 board.array[i+1][j-1], board.array[i+1][ j ]];
                }
                else {
                    neighbors = [board.array[i-1][j-1], board.array[i-1][ j ], board.array[i-1][j+1],
                                 board.array[ i ][j-1], board.array[ i ][ j ], board.array[ i ][j+1],
                                 board.array[i+1][j-1], board.array[i+1][ j ], board.array[i+1][j+1]];
                }
                // console.log(neighbors);
                let bombs = 0;
                neighbors.forEach(n => {
                    if (n == "B") {
                        bombs += 1;
                    }
                });
                // console.log(bombs);
                if (board.array[i][j] != 'B') board.array[i][j] = bombs;
            }
        }
        return board.array;

    },
    gameOver: (isWin) => {
        board.inGame = false;
        board.tableElement.removeEventListener("click", manageClick);
        board.tableElement.removeEventListener("contextmenu", (_ev) => {});
        if (isWin) {
            document.getElementById("face").innerText = "😀";
        }
        else {
            document.getElementById("face").innerText = "🙁";
        }
        for (let i=0; i < board.rows; i++) {
            for (let j=0; j < board.cols; j++) {
                if (board.array[i][j] == 'B') {
                    document.getElementById(`${i}-${j}`).innerText = "💣";
                }
            }
        }
    },


};

function updateCell(cell, index) {
    if (cell == null) return;
    if (cell.innerHTML.length > 0 && cell.innerHTML != "🚩") return;
    let c = board.array[index[0]][index[1]];
    cell.classList.add("pressed")
    switch (c) {
        case "B":
            cell.innerHTML = "💣";
            // Game over
            console.log("Game over");
            board.gameOver(false)
            break;
        case 0:
            // search for boarders
            let i = Number(index[0]);
            let j = Number(index[1]);
            cell.innerHTML = " " //board.array[i][j];
            for (let ii=-1; ii < 2; ii++) {
                let num = board.array[i+ii];
                if (num == undefined) continue;
                for (let jj=-1; jj < 2; jj++) {
                    let num = board.array[i+ii][j+jj];
                    switch (num) {
                        case "B":
                            break;
                        case 0:
                            // open other blank cells
                            let c = document.getElementById(`${i+ii}-${j+jj}`);
                            updateCell(c, [i+ii, j+jj]);
                            break
                        case undefined:
                            break
                        default:
                            document.getElementById(`${i+ii}-${j+jj}`).innerHTML = board.array[i+ii][j+jj];
                            document.getElementById(`${i+ii}-${j+jj}`).classList.add("pressed");
                            break;
                    }
                }
            }
            break;
        default:
            // just a number
            cell.innerHTML = board.array[index[0]][index[1]];
            break;
    }
}

// click on cell callback
function manageClick(ev) {
    ev.preventDefault();
    let cell = ev.target;
    let index = cell.id.split("-");
    // console.log(ev);

    if (!board.inGame) {
        // Start timer
        board.inGame = true;
        board.startTime = Date.now();
    }
    switch (ev.button) {
        case 0:
            // console.log("clicked", index, board.array[index[0]][index[1]])
            updateCell(cell, index);
            break;
        default:
            if (!cell.className.split(" ").includes("pressed")) {
                if (cell.innerHTML == "🚩") {
                    cell.innerHTML = "";
                    board.minesMarked -= 1;
                }
                else {
                    cell.innerHTML = "🚩";
                    board.minesMarked += 1;
                }
            }
            console.log("default");
            break;
    }
    let pressed = 0;
    for (let i=0; i < board.rows; i++) {
        for (let j=0; j < board.cols; j++) {
            let cell = document.getElementById(`${i}-${j}`);
            if (cell.className.split(" ").includes("pressed")) pressed++;
        }
    }

    minesIndicator.innerText = "💣" + (board.mines - board.minesMarked);
    if (pressed == (board.rows*board.cols) - board.mines) {
        board.gameOver(true);
        console.log("Game won");
    }
}


// display the board as a table on the main board
function drawBoard(boardElement) {
    // let boardElement = document.getElementById('board');
    if (boardElement.hasChildNodes()) {
        console.log(boardElement.firstChild, "removed");
        boardElement.firstChild.remove();
    }
    board.tableElement = document.createElement("table");
    board.tableElement.className = 'board'
    for (let i=0; i < board.rows; i++) {
        let row = document.createElement('tr');
        row.className = 'row';
        for (let j=0; j < board.cols; j++) {
            let mine = board.array[i][j];
            let cell = document.createElement('td');
            // cell.innerHTML = mine;
            cell.id = i.toString() + "-" + j.toString();
            cell.className = 'cell '+ num2name(mine);
            row.appendChild(cell);
        }
        board.tableElement.appendChild(row);
    }
    boardElement.appendChild(board.tableElement);

    board.tableElement.addEventListener("contextmenu", manageClick);

    board.tableElement.addEventListener("click", manageClick);

    // Set window size
    window.resizeTo(board.rows * 40 + 30, board.cols * 40 + 230);
    return board.tableElement;
}




let counter = document.getElementById('time');
// let startTime = Date.now();
let newGame = document.getElementById('newGame');
let newGame2 = document.getElementById('newGame2');
let confButton = document.getElementById("confButton");
let boardElement = document.getElementById("board");
let settingsElement = document.getElementById("settings");
let minesIndicator = document.getElementById("score");

console.log(board);
board.newGame();
board.fillBoard();
let tableElement = drawBoard(boardElement);

document.getElementById("face").addEventListener("click", () => {
    board.newGame();
    board.fillBoard();
    tableElement = drawBoard(boardElement);
    console.log("newGame")
});

newGame.addEventListener("click", (ev) => {
    board.newGame();
    board.fillBoard();
    tableElement = drawBoard(boardElement);
    console.log("newGame")
});

confButton.addEventListener("click", (ev) => {
    settingsElement.style = "display: block";
    console.log("confButton")
});

newGame2.addEventListener("click", (ev) => {
    board.rows = parseInt(document.getElementById("width").value, 10);
    board.cols = parseInt(document.getElementById("height").value, 10);
    board.mines = parseInt(document.getElementById("mines").value, 10);
    settingsElement.style = "display: none"
    board.newGame();
    board.fillBoard();
    tableElement.innerHTML = "";
    tableElement = drawBoard(boardElement);
    console.log("newGame");
});

// Update Counter
setInterval(() => {
    let min = 0;
    let sec = 0;
    if (board.inGame) {
        board.timer = Date.now() - board.startTime;
    }
    min = Math.floor(board.timer / 60000);
    sec = (board.timer % 60000) / 1000;
    counter.innerText = `${min}:${sec.toFixed(3)}`;
}, 100);
