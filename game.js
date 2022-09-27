const readline = require('readline')

const rl = readline.createInterface(process.stdin, process.stdout)

let board = '123456789'
let playerSymbol = 'x'


function promptUser() {
    renderBoard(board)
    rl.question('What square will you play on now?', function (input) {
        console.log(input)
        board = updateBoard(board, input, playerSymbol)

        // Is the game over?
        if(playerSymbol == 'x') {
            playerSymbol = 'o'
        }else {
            playerSymbol = 'x'
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


// function validateInput (input) {
//     // What is not allowed
//     // - Not a integer
//     // - Not 
//     if (typeof input == 'number' && parseInt(input) >= 0) 
// }