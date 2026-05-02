const dialg = document.querySelector(".dialog-container");
const resetButton = document.querySelector(".reset-button");
const form = document.querySelector("#form-container");
const updateState = document.querySelector(".update-state");
const cells = document.querySelectorAll(".cell");
const playerOne = document.querySelector("#player1Name");
const playerTwo = document.querySelector("#player2Name");

window.onload = function(){

dialg.showModal()
}

form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    dialg.close();
    const satrtGame = Game(playerOne.value,playerTwo.value)

    updateState.textContent = `❌ ${playerOne.value} 𝑻𝒖𝒓𝒏`;

    cells.forEach(btn => {
        btn.addEventListener("click", (ev) =>{
        let value = ev.target.value;
        let arr = value.split(",");
        let row = Number(arr[0]);
        let index = Number(arr[1]);

        let round = satrtGame(row,index);
        let shape = round.shape;

        if(round.isWin){
            updateState.textContent = `${round.shape} ${round.winner} 𝓘𝓼 𝓣𝓱𝓮 𝓦𝓲𝓷𝓷𝓮𝓻`
        }
        if(round.isDraw){
            updateState.textContent = "𝓘𝓽❜𝓼 𝓐 𝓓𝓻𝓪𝔀"
        }
        if(round.isOnGoing){
            updateState.textContent = `${round.currentShape} ${round.current} 𝑻𝒖𝒓𝒏`
        }
        if(shape){
        btn.textContent = shape;
        }

        // this one runs for each btn click i think, IF > (fix it) SMH
        resetButton.addEventListener("click", ()=>{
            round.resetGame();
            updateState.textContent = `❌ ${playerOne.value} 𝑻𝒖𝒓𝒏`;
            btn.textContent = ""
        })
        
        })
    })
    
});

function Player(name){
    let playerShape = "";
    const setShape = (shape) => playerShape = shape;
    const getShape = () => playerShape;
    const getName = () => name;
    return {getShape, setShape, getName}
}


const GameBoard = (() => {
    const gameboard = {
        Board: [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
            ],
    }  
    
    const resetBoard = ()=> {
        gameboard.Board = 
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
            ]
    }

    const placeMark = (shape, row, index) =>{
        if(gameboard.Board[row][index] !== "")return false;
        gameboard.Board[row][index] = shape;
        return true;
        
    }

    const getBoard = () => gameboard.Board;
    const isFull = () =>  gameboard.Board.flat().every(index => index !== "");

    return {getBoard, placeMark, resetBoard, isFull}
})();



const Game = (player1Name, player2Name) =>{
    const player1 = Player(player1Name);
    const player2 = Player(player2Name);
    
    let canPlay = true;
    let player1Turn = true;
    
    let shape1 = "❌";
    let shape2 = "⭕";
    
    player1.setShape(shape1);
    player2.setShape(shape2);

    const checkWinner = function(shape){
    let board = GameBoard.getBoard();
    // diagonal check
        if(board[0][0] == shape && board[1][1] == shape && board[2][2] == shape ||
        board[0][2] == shape && board[1][1] == shape && board[2][0] == shape
        ){return true }

        for(let i = 0; i < board.length; i++){

            if(board[i].every(cell => cell === shape)){
                return true;
            }
            else if (board[0][i] == shape && board[1][i] == shape && board[2][i] == shape){
                return true
            }
        }
        return false
    }

    const resetGame = () =>{
        GameBoard.resetBoard();
        player1Turn = true;
        canPlay = true;
    }
    
    return function (row, index){
        if(canPlay){

            // to display the next player after each click
            const whosTurn = player1Turn ? player2 :player1;
           

            const currentPlayer = player1Turn ? player1 : player2;
            const playerShape = currentPlayer.getShape();

            if(row < 0 || row > 2 || index < 0 || index > 2)return;
            
            if(GameBoard.placeMark(playerShape, row, index)) {

                if(checkWinner(playerShape)){
                    canPlay = !canPlay
                    return {
                        isWin: true,
                        winner: currentPlayer.getName(),
                        currentShape: whosTurn.getShape(),
                        shape: currentPlayer.getShape(),
                        resetGame
                    }
                } 

                else if (GameBoard.isFull()) {
                    canPlay = !canPlay
                    return {
                        isDraw: true,
                        shape: currentPlayer.getShape(),
                        resetGame
                    }
                } 
                player1Turn = !player1Turn;
                return {
                    isOnGoing: true,
                    current: whosTurn.getName(),
                    currentShape: whosTurn.getShape(),
                    shape: currentPlayer.getShape(),
                    resetGame
                }
                
            }  
        }
        return{resetGame}          
    }    
}
