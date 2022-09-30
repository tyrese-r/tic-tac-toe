/**
 * - Display board
 * - Find a way to get input from user
 * - Update board
 */
// Find the square elements
let gameOver = false;
let initialGameBoard;

// Player 'o' is a human/easy/hard
let playerORole = 'hard'
const initialBoardString = '123456789'
setupGame()
getFreeSpaces(initialBoardString)




function setupGame() {
    const gameBoardElement = document.querySelector('.game-board')
    const gameCellElements = [...gameBoardElement.children]
    for (let i = 0; i < gameCellElements.length; i++) {
        const cell = gameCellElements[i];
        cell.setAttribute('onclick', `playTurn(${i}, ${true})`)
        cell.className += ' symbol-blank'
    }
    //console.log(el)

    localStorage.setItem('board', initialBoardString)
    localStorage.setItem('currentSymbol', 'x')
    drawBoard(initialBoardString, gameBoardElement)
    initialGameBoard = gameBoardElement.cloneNode(true);
}

function playTurn(pos, isHumanInput) {
    if (gameOver) {
        return;
    }
    // Get board and current symbol
    const gameBoard = localStorage.getItem('board');
    const currentSymbol = localStorage.getItem('currentSymbol');

    // Cancel if it is the computer's turn and a human is playing
    if (currentSymbol == 'o' && isHumanInput && playerORole !== 'human') {
        return false
    }
    // Check if user can place there
    if (/o|x/.test(gameBoard[pos])) {
        return;
    }
    // Update board
    const newGameBoard = updateBoard(gameBoard, pos, currentSymbol)
    localStorage.setItem('board', newGameBoard)
    drawBoard(newGameBoard, document.querySelector('.game-board'))
    // Check game result
    const gameResult = checkGameResultRegex(newGameBoard)
    console.log(gameResult)
    if (gameResult.isWin) {
        gameOver = true
    } else {
        // Check draw
        const regex = new RegExp('(x|o){9}')
        let isDraw = regex.test(newGameBoard)
        if (isDraw) {
            console.log(`\n\ndraw\n\n`)
            gameOver = true;
        }
    }

    if (gameOver) {
        onGameOver(gameResult)
        return
    }

    // Swap symbol and continue to next turn
    const newSymbol = currentSymbol === 'x' ? 'o' : 'x'
    localStorage.setItem('currentSymbol', newSymbol)
    updateStatusText(`It ${setBoldText(newSymbol)}'s turn`)

    if (newSymbol == 'o') {
        // console.log(`best move: ${bestMove()+1}`)
        playerO()
        // console.log(pos)
    }



    // Then go onto the next turn
}


function getThinkingTime() {
    const t = 1000 * (Math.random() * 1.5)
    console.log(t / 1000)
    return t
}
function playerO() {
    console.log(`Player o: ${playerORole}`)
    switch (playerORole) {
        case 'easy':
            updateStatusText(`I am ${setBoldText('thinking')}`)
            setTimeout(() => {
                // Choose correct move 60% of the time
                if (Math.random() > 0.6) {
                    // Choose random move

                    playTurn(randomMove(), false)
                } else {
                    // Choose correct move
                    playTurn(bestMove(), false)
                }

            }, getThinkingTime())

            break;
        case 'hard':
            updateStatusText(`I am ${setBoldText('thinking')}`)
            setTimeout(() => {
                playTurn(bestMove(), false)
            }, getThinkingTime() / 2)
            break;

        default:
            // If human or anything else then do nothing
            updateStatusText(`It is ${setBoldText('o')}'s turn`)
            break;

    }
}
// On role change
function roleChange() {
    playerORole = document.querySelector('select').selectedOptions[0].value

    resetGame();
}
function updateBoard(b, move, player) {
    const index = move + 1
    const updated = b.replace(index, player)
    return updated
}

/**
 * 
 * @param {string} b The board string
 * @param {HTMLElement} parentElement The element of the parent of the board
 */
function drawBoard(b, parentElement) {
    const gameCellElements = [...parentElement.children]
    for (let i = 0; i < gameCellElements.length; i++) {
        const cell = gameCellElements[i];
        // Set class to the symbol ('x' or 'o') at postion 
        // otherwise set class to symbol-blank
        const cellText = b[i] >= 0 ? parseInt(b[i]) : b[i]
        cell.innerHTML = cellText
        if (/o|x/.test(cellText)) {
            cell.className = `game-cell symbol-${cellText}`
            cell.innerHTML = cellText.toUpperCase()
        }

    }

}

function onCellSelect() {
    checkGameResultRegex('')
}

function checkGameResultRegex(board) {
    let gameResult = {
        isWin: false, // false if draw
        winner: null // null if draw
    }

    const symbols = ['x', 'o']
    symbols.forEach(symbol => {
        const regexString = '(###......)|(...###...)|(......###)|(#..#..#)|(#...#...#)|(..#.#.#..)'
        const regex = new RegExp(regexString.replaceAll('#', symbol))
        // console.log(regex)
        // console.log(board)

        if (regex.test(board)) {
            gameResult.isWin = true
            gameResult.winner = symbol
            return gameResult
        }
    })

    return gameResult // retrun draw if there is no win

}

function onGameOver(gameResult) {
    // If someone won
    if (gameResult.isWin) {
        updateStatusText(`${setBoldText(gameResult.winner)} is the ${setBoldText('winner')}!`)
        return
    }
    // If it was a draw
    updateStatusText(`It was a ${setBoldText('draw')}!`)
    return


}

function updateStatusText(text) {
    const statusTextElement = document.querySelector('#status-text')
    statusTextElement.innerHTML = text
    return
}

function setBoldText(text) {
    return `<span class="bold">${text}</span>`
}

function resetGame() {
    /**
     * 'paste' elements
     * reset score
     * reset board
     * update text
     */

    // 'paste' element - remove old board and replace with a copy
    const mainEl = document.querySelector('main')
    mainEl.firstElementChild.remove()
    mainEl.appendChild(initialGameBoard.cloneNode(true))

    // Reset score - 
    gameOver = false
    // Reset board string and symbol
    localStorage.setItem('board', initialBoardString)
    localStorage.setItem('currentSymbol', 'x')
    updateStatusText('Tic Tac Toe')
}

/**
 * Gets the free spaces on the game board
 * @returns {number[]} Array of ints of the indexes of the free spaces on the board
 */
function getFreeSpaces(board) {
    const freeSpaces = board.match(/[1-9]/g)
    // Convert to ints
    const freeSpacesIndex = freeSpaces.map(s => parseInt(s) - 1)
    //console.log(freeSpaces)
    //console.log(freeSpacesIndex)

    return freeSpacesIndex
}

function randomMove() {
    const items = getFreeSpaces(localStorage.getItem('board'))
    return items[Math.floor(Math.random() * items.length)]
}
function bestMove() {
    let board = localStorage.getItem('board');
    let bestScore = -Infinity;
    let move;
    const freeSpaces = getFreeSpaces(board);
    for (let i = 0; i < freeSpaces.length; i++) {
        const freeSpace = freeSpaces[i];

        // Try placing a piece there
        const b = board.replace(freeSpace + 1, 'o');
        //console.log('!!')
        //console.log(b)
        const score = minimax(b, 0, false)

        // Then remove from board to make it empty again
        //board[freeSpace] = (board[freeSpace] + 1).toString()

        // If the score is better then set best move
        if (score > bestScore) {
            bestScore = score;
            move = freeSpaces[i];
        }

    }
    return move
}

function minimax(board, depth, isMaxi) {
    // Check if someone won
    const gameResult = checkGameResultRegex(board)
    // console.log(gameResult)
    // console.log(board)
    // console.log(`depth: ${depth}`)
    let gameScore;
    // Check draw
    const regex = new RegExp('(x|o){9}')
    let isDraw = regex.test(board)
    if (gameResult.isWin) {
        if (gameResult.winner == 'x') {
            // If 'x' won
            gameScore = -1;
        } else {
            // If 'o' won
            gameScore = 1;
        }
    } else if (isDraw) {
        gameScore = 0
    }
    if (gameScore === 0 || gameScore === 1 || gameScore == -1) {
        return gameScore;
    }

    // console.log(`g: ${gameScore}`)


    if (isMaxi) {
        const freeSpaces = getFreeSpaces(board);
        let bestScore = -Infinity;
        for (let i = 0; i < freeSpaces.length; i++) {
            const freeSpace = freeSpaces[i];

            // Try placing a piece there
            const b = board.replace(freeSpace + 1, 'o');
            const score = minimax(b, depth + 1, false)

            // Then remove from board to make it empty again
            //board[freeSpace] = (board[freeSpace] + 1).toString()

            bestScore = Math.max(score, bestScore)
            // If the score is better then set best move
            // if (score > bestScore) {
            //     bestScore = score;
            //     move = freeSpaces[i];
            // }
        }
        return bestScore;
    } else {
        // If it is minimizing player
        const freeSpaces = getFreeSpaces(board);
        let bestScore = Infinity;
        for (let i = 0; i < freeSpaces.length; i++) {
            const freeSpace = freeSpaces[i];

            // Try placing a piece there
            const b = board.replace(freeSpace + 1, 'x'); // @todo change this to constant
            const score = minimax(b, depth + 1, true)

            // Then remove from board to make it empty again
            //board[freeSpace] = (board[freeSpace] + 1).toString()

            // Return worst score from algorithm
            bestScore = Math.min(score, bestScore)

        }
        return bestScore;
    }
    return 1
}