const { exit } = require('process')
const readline = require('readline')

const rl = readline.createInterface(process.stdin, process.stdout)

const RESET = "\x1b[0m"
const BLUE = "\x1b[34m"
const YELLOW = "\x1b[33m"
const GREEN = "\x1b[32m"

let board = '123456789'
let playerSymbol = 'x'
let gameOver = false
let isDraw = false


function promptUser() {
    renderBoard(board)
    console.log(`\n\nIt is ${playerSymbol}'s turn!\n\n`)
    rl.question('What square will you play on now?\n\n', function (input) {
        const isValid = validateInput(input)
        if (isValid) {
            board = updateBoard(board, input, playerSymbol)

            const gameResult = checkGameResultRegex()
            // console.log(gameResult)
            if (gameResult.isWin) {
                renderBoard(board)
                console.log(`\n\nGame over! ${gameResult.winner} won!\n\n`)
                exit()
            } else {
                //Check draw
                const regex = new RegExp('(x|o){9}')
                isDraw = regex.test(board)
                if (isDraw) {
                    renderBoard(board)
                    console.log(`\n\nGame over! It was a draw\n\n`)
                    exit()
                }
            }

            // Swap player symbols
            if (playerSymbol == 'x') {
                playerSymbol = 'o'
            } else {
                playerSymbol = 'x'
            }

        } else {
            console.log(`\n\nYou cannot place your ${playerSymbol} there\n\n`)
        }
        promptUser(playerSymbol)
    })
}

function updateBoard(b, move, player) {
    return b.replace(move, player)
}

function renderBoard() {
    const largeSymbols = {
        x: [
            '  **   **    ',
            '   ** **     ',
            '    ***      ',
            '   ** **     ',
            '  **   **    ',
        ],
        o: [
            '    *****    ',
            '  ***   ***  ',
            '  **     **  ',
            '  ***   ***  ',
            '    *****    ',
        ],
        blank: Array(5).fill('             ')
    }

    console.log('\n\n')

    // This is the board row
    for (let i = 0; i < 3; i++) {

        const currentBoardRow = board.slice(i * 3, (i * 3) + 3)
        // Each row has 5 lines
        for (let j = 0; j < 5; j++) {
            const row = j
            let line = ''
            // Column
            for (let k = 0; k < 3; k++) {
                const currentBoardSymbol = currentBoardRow[k]
                if (parseInt(currentBoardSymbol) in [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
                    // It is blank
                    line += RESET + (largeSymbols['blank'][row]) + RESET
                }
                if (currentBoardSymbol == 'x') {
                    // It is x
                    line += BLUE + (largeSymbols[currentBoardSymbol][row]) + RESET
                }
                if (currentBoardSymbol == 'o') {
                    // It is o
                    line += YELLOW + (largeSymbols['o'][row]) + RESET
                }

                // If k is 0 or 1 then draw vertical border after
                if (k == 0 || k == 1) {
                    line += GREEN + '|' + RESET
                } else {
                    line += ' '
                }



            }
            // Draw current line
            console.log(line)

        }
        // Draw horizontal borders
        if (i == 0 || i == 1) {
            const horizontalBorder = Array(3).fill('-------------').join('')
            console.log(GREEN + horizontalBorder + RESET)
        }



    }

    // Old way
    const b = board
    console.log(`${b[0]}|${b[1]}|${b[2]}`)
    console.log(`${b[3]}|${b[4]}|${b[5]}`)
    console.log(`${b[6]}|${b[7]}|${b[8]}`)
}


promptUser()


/**
 * This function validates user input and decides if it can be accepted
 * @param {string} input User input
 * @returns {boolean} Whether it can be accepted or not
 */
function validateInput(input) {
    // What is allowed?
    // - Must be one character
    // - Must be integer
    // - Integer between 1 and 9
    // - The space must be empty on the board

    // reject if length is greater than 1
    if (input.length > 1) { return false }

    // convert to int
    const inp = parseInt(input)

    // Accept if space equals to the input
    if (board[inp - 1] === inp.toString()) { return true }
    return false
}

function checkGameResultLoop() {
    // Possible winning positions
    const winConditions = [
        /* Horizonal */
        '123',
        '456',
        '789',
        /* Vertical */
        '147',
        '258',
        '369',
        /* Diagonal */
        '159',
        '357'
    ]
    let gameResult = {
        isWin: false, // false if draw
        winner: null // null if draw
    }

    winConditions.forEach(condition => {
        // Check to see which symbol is in the first position
        // then add to counter everytime the symbol matches the one on the board
        const symbol = board[condition[0] - 1]
        let counter = 0

        for (let i = 0; i < condition.length; i++) {
            const position = condition[i] - 1
            if (board[position] == symbol) {
                counter += 1
            }
        }

        // If three symbols matches then set win
        if (counter == 3) {
            gameResult.isWin = true
            gameResult.winner = symbol
            return gameResult
        }
    })

    // Return draw
    return gameResult
}

function checkGameResultRegex() {
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
/**
 * horizontal
 * xxx
 * 
 * vertical
 * x..x..x
 * 
 * diagonal
 * x...x...x
 * ..x.x.x..
 */