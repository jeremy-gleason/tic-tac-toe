const gameBoard = function() {
    const boardDisplay = document.querySelector(".board");
    const tiles = ["","","","","","","","",""];
    const render = function() {
        let tileDisplay;
        for (let i = 0; i < tiles.length; i++) {
            tileDisplay = document.querySelector(`[data-index="${i}"]`);
            tileDisplay.textContent = tiles[i];
        }
    };
    const clear = function() {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i] = "";
        }
        render();
    };
    const threeInARow = function(mark) {
        if ((tiles[0] === mark && tiles[1] === mark && tiles[2] === mark) ||
        (tiles[3] === mark && tiles[4] === mark && tiles[5] === mark) ||
        (tiles[6] === mark && tiles[7] === mark && tiles[8] === mark) ||
        (tiles[0] === mark && tiles[3] === mark && tiles[6] === mark) ||
        (tiles[1] === mark && tiles[4] === mark && tiles[7] === mark) ||
        (tiles[2] === mark && tiles[5] === mark && tiles[8] === mark) ||
        (tiles[0] === mark && tiles[4] === mark && tiles[8] === mark) ||
        (tiles[2] === mark && tiles[4] === mark && tiles[6] === mark)) {
            return true;
        } else {
            return false;
        }
    };
    const filled = () => tiles[0] !== "" && tiles[1] !== "" && tiles[2] !== "" &&
    tiles[3] !== "" && tiles[4] !== "" && tiles[5] !== "" && tiles[6] !== "" &&
    tiles[7] !== "" && tiles[8] !== "";
    return { boardDisplay, tiles, render, clear, threeInARow, filled };
}();

function playerFactory(mark) {
    const playerMark = mark;
    const getMark = function() {
        return playerMark;
    };
    const markTile = function(board, tile) {
        if (board[tile] === "") {
            board[tile] = playerMark;
            return true;
        }
        return false;
    };
    return { markTile, getMark };
}

const player1 = playerFactory('X');
const player2 = playerFactory('O');

gameBoard.render();

const gameController = (function() {
    let turn = 1;
    const announcements = document.querySelector(".announcements");
    const playButton = document.querySelector(".play-again");
    const getTurn = function() {
        return turn;
    };
    const changeTurn = function() {
        turn = turn == 1 ? 2 : 1;
    };
    const announce = function(message) {
        announcements.textContent = message;
    };
    const playTurn = function(e) {
        let completed = false;
            if (turn === 1) {
                completed = player1.markTile(gameBoard.tiles, e.target.dataset.index);
            } else {
                completed = player2.markTile(gameBoard.tiles, e.target.dataset.index);
            }
            if (completed) {
                gameBoard.render();
                changeTurn();
                announce(`Player ${turn}'s turn`);
            }
    };
    const checkWinner = function() {
        if (gameBoard.threeInARow(player1.getMark())) {
            return 1;
        } else if (gameBoard.threeInARow(player2.getMark())) {
            return 2;
        } else {
            return 0;
        }
    };
    const gameOver = function(winner) {
        gameBoard.boardDisplay.removeEventListener('click', clickListener);
    };
    const play = function() {
        playButton.removeEventListener('click', play);
        playButton.classList.add("hidden");
        gameBoard.clear();
        turn = 1;
        announce(`Player ${turn}'s turn`);
        gameBoard.boardDisplay.addEventListener('click', function clickListener(e) {
            playTurn(e);
            let winner = checkWinner();
            if (winner > 0) {
                gameBoard.boardDisplay.removeEventListener('click', clickListener);
                announce(`Player ${winner} wins!`);
                playButton.classList.remove("hidden");
                playButton.addEventListener('click', play);
            } else if (gameBoard.filled()) {
                announce(`It's a tie!`);
                playButton.classList.remove("hidden");
                playButton.addEventListener('click', play);
            }
        });
    };
    return { play };
})();

gameController.play();