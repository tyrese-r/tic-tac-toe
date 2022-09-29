/**
 * - Display board
 * - Find a way to get input from user
 * - Update board
 */
// Find the square elements
let gameOver = false;
let initialGameBoard;
const initialBoardString = '123456789'
setupGame()




function setupGame() {
    const gameBoardElement = document.querySelector('.game-board')
    const gameCellElements = [...gameBoardElement.children]
    for (let i = 0; i < gameCellElements.length; i++) {
        const cell = gameCellElements[i];
        cell.setAttribute('onclick', `playTurn(${i})`)
        cell.className += ' symbol-blank'
    }
    //console.log(el)

    localStorage.setItem('board', initialBoardString)
    localStorage.setItem('currentSymbol', 'x')
    drawBoard(initialBoardString, gameBoardElement)
    initialGameBoard = gameBoardElement.cloneNode(true);
}

function playTurn(pos) {
    if (gameOver) {
        return;
    }
    // Get board and current symbol
    const gameBoard = localStorage.getItem('board');
    const currentSymbol = localStorage.getItem('currentSymbol');
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

    // Swap symbol
    const newSymbol = currentSymbol === 'x' ? 'o' : 'x'
    localStorage.setItem('currentSymbol', newSymbol)
    updateStatusText(`It is ${setBoldText(newSymbol)}'s turn`)

    console.log(pos)
}

function updateBoard(b, move, player) {
    const index = move + 1
    return b.replace(index, player)
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
    mainEl.firstChild.remove()
    mainEl.appendChild(initialGameBoard.cloneNode(true))

    // Reset score - 
    gameOver = false
    // Reset board string and symbol
    localStorage.setItem('board', initialBoardString)
    localStorage.setItem('currentSymbol', 'x')
    updateStatusText('Go again')
    alert('Hello World!')
}