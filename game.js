const readline = require('readline')

const rl = readline.createInterface(process.stdin, process.stdout)

let board = '123456789'
let playerSymbol = 'x'


function promptUser() {
    check
    renderBoard(board)
    console.log(`\n\nIt is ${playerSymbol}'s turn!\n\n`)
    rl.question('What square will you play on now?\n\n', function (input) {
        const isValid = validateInput(input);
        if (isValid) {
            board = updateBoard(board, input, playerSymbol)

            // Is the game over?
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

function renderBoard(b) {
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


