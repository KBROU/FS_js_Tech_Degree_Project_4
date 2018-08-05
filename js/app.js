//Project 4: Tic-Tac-Toe
//Kody Broussard
//7/9/2018
//Module Pattern used with vanilla JS
//Used the following websites to aid in creating the Player VS Computer portion of the code: https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37 & https://www.neverstopbuilding.com/blog/2013/12/13/tic-tac-toe-understanding-the-minimax-algorithm13/

const  ticTacToeModule = (function() {
    //Global Variables of ticTacToeModule
    const boardGame = document.getElementById('board');
    const startGame = document.getElementById('start');
    const finishGame = document.getElementById('finish');
    const startButton = document.querySelector('.start');
    const message = document.querySelector('.message');
    const newGameButton = document.querySelector('.newButton');
    const pvpButton = document.querySelector('.pvp');
    const pvcButton = document.querySelector('.pvc');
    
    class Board {
        constructor() {
            this.boxes = document.querySelector('.boxes');
            this.allBoxes = document.querySelectorAll('.box');
            this.allBoxesArray = [...document.querySelectorAll('.box')];
            this.compBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8,];
            this.boardMoves = [];
            this.emptyCells = [];
            this.boardLayout();
        }
        boardLayout() {
            this.allBoxes.forEach((box2,j) => {
                if (0 <= j && j < 3) {
                    box2.setAttribute('data-row', 0);
                    box2.setAttribute('data-col', j);
                    box2.setAttribute('cell-num', j)
                } else if (3 <= j && j < 6) {
                    box2.setAttribute('data-row', 1);
                    box2.setAttribute('data-col', j-3); 
                    box2.setAttribute('cell-num', j)
                } else if (6 <= j && j < 9){
                    box2.setAttribute('data-row', 2);
                    box2.setAttribute('data-col', j-6);
                    box2.setAttribute('cell-num', j)
                }
            });            
        }
    }
    const newBoard = new Board();
    const fullBoard = newBoard.allBoxesArray.map(full => full.getAttribute('data-row') + full.getAttribute('data-col'));
    

    class Player {
        constructor(playerNumber, numWord) {
            this.playerNumber = playerNumber;
            this.activePlayer = document.getElementById(`player${playerNumber}`);
            this.playerMoves = [];
            this.name = document.getElementById(`player-${numWord}-name`);
        }
    }
    const playerOne = new Player(1, 'one');
    const playerTwo = new Player(2, 'two');
    const computer = new Player(2, 'two')

    //Startup Screen Page Load using IIFE
    var startScreen = (function() {
        boardGame.style.display = 'none';
        finishGame.style.display = 'none';
        startGame.style.display = 'block';
        startButton.style.display = 'none';
        playerOne.name.style.display = 'none';
        playerTwo.name.style.display = 'none';
        finishGame.classList.add('active');
        playerOneActive();
    }());

    
    //Game Play
    function playerOneActive() {
        playerOne.activePlayer.classList.add('active');
        playerTwo.activePlayer.classList.remove('active');
        computer.activePlayer.classList.remove('active');
    }   
    
    function playerTwoActive() {
        playerOne.activePlayer.classList.remove('active');
        playerTwo.activePlayer.classList.add('active');
    }
       
    
    function boxDisplay(mouseoverTarget) {
        if (mouseoverTarget.classList.contains('alreadySelected') === false){
            
            if (playerOne.activePlayer.classList.contains('active')) {
            mouseoverTarget.style.backgroundImage = 'url("img/o.svg")';
            }   
        
            if (playerTwo.activePlayer.classList.contains('active')) {
            mouseoverTarget.style.backgroundImage = 'url("img/x.svg")';
            }
            
        }
    }
    
    function boxDisplayNone(mouseoutTarget) {
        if (mouseoutTarget.classList.contains('alreadySelected') === false){
            mouseoutTarget.style.backgroundImage = 'none';
        }
    }
    
    function emptySpaces(board) {
      return board.filter(emptySpace => emptySpace != "O" && emptySpace != "X")
    }

    function pvcWinner (board, player) {
        if (
         (board[0] == player.getAttribute('nameVal') && 
          board[1] == player.getAttribute('nameVal') && 
          board[2] == player.getAttribute('nameVal')) ||
         (board[3] == player.getAttribute('nameVal') && 
          board[4] == player.getAttribute('nameVal') && 
          board[5] == player.getAttribute('nameVal')) ||
         (board[6] == player.getAttribute('nameVal') && 
          board[7] == player.getAttribute('nameVal') && 
          board[8] == player.getAttribute('nameVal')) ||
         (board[0] == player.getAttribute('nameVal') &&
          board[3] == player.getAttribute('nameVal') && 
          board[6] == player.getAttribute('nameVal')) ||
         (board[1] == player.getAttribute('nameVal') && 
          board[4] == player.getAttribute('nameVal') && 
          board[7] == player.getAttribute('nameVal')) ||
         (board[2] == player.getAttribute('nameVal') && 
          board[5] == player.getAttribute('nameVal') && 
          board[8] == player.getAttribute('nameVal')) ||
         (board[0] == player.getAttribute('nameVal') && 
          board[4] == player.getAttribute('nameVal') && 
          board[8] == player.getAttribute('nameVal')) ||
         (board[2] == player.getAttribute('nameVal') && 
          board[4] == player.getAttribute('nameVal') && 
          board[6] == player.getAttribute('nameVal'))
         ) {
            return true;
         } else {
            return false;
         }
    }

    function compMinimax (nBoard, player) {
        var openSpots = emptySpaces(nBoard);
        if(pvcWinner(nBoard, playerOne.activePlayer)) {
            return {score:-10}
        } else if (pvcWinner(nBoard, computer.activePlayer)) {
            return {score:10}
        } else if (openSpots.length === 0) {
            return {score:0}
        }
        var allMoves = [];
        openSpots.forEach((openSpot, ind) => {
            var move ={};
            move.index = nBoard[openSpot];
            nBoard[openSpot] = player.getAttribute('nameVal');
            if (player === computer.activePlayer) {
                var result = compMinimax(nBoard, playerOne.activePlayer);
                move.score = result.score;
            } else {
                var result = compMinimax(nBoard, computer.activePlayer)
                move.score = result.score;
            }
           
         nBoard[openSpot] = move.index;
         allMoves.push(move);
        });
        var bestMove;
        if(player === computer.activePlayer) {
            var bestScore = -10000;
            allMoves.forEach((allMove, ind) => {
                if(allMove.score > bestScore) {
                    bestScore = allMove.score;
                    bestMove = ind;
                }
            });
        } else {
            var bestScore = 10000;
            allMoves.forEach((allMove, ind) => {
                if(allMove.score < bestScore) {
                    bestScore = allMove.score;
                    bestMove = ind;
                }
            });
        }
        return allMoves[bestMove];
    }
    
    

    function inputPlayerMove(clickTarget) {
        if (clickTarget.classList.contains('alreadySelected') === false && computer.activePlayer.classList.contains('comp') === false){
            
            if (playerOne.activePlayer.classList.contains('active')) {
                clickTarget.classList.add('box-filled-1');
                playerOne.activePlayer.classList.add('box-filled-1');
                clickTarget.style.backgroundImage = 'url("img/o.svg")';
                clickTarget.classList.add('alreadySelected');
                clickTarget.style.cursor = 'default';
                playerOne.playerMoves.push(clickTarget);
                checkForWinner(playerOne.playerMoves);
                return playerTwoActive();
            } 

            if (playerTwo.activePlayer.classList.contains('active')) {
                clickTarget.classList.add('box-filled-2');
                clickTarget.style.backgroundImage = 'url("img/x.svg")';
                clickTarget.classList.add('alreadySelected');
                clickTarget.style.cursor = 'default';
                playerTwo.playerMoves.push(clickTarget);
                checkForWinner(playerTwo.playerMoves);
                return playerOneActive();
            }
        } else if (clickTarget.classList.contains('alreadySelected') === false && computer.activePlayer.classList.contains('comp')) {
                
                clickTarget.classList.add('box-filled-1');
                playerOne.activePlayer.setAttribute('nameVal', 'O');
                computer.activePlayer.setAttribute('nameVal', 'X');
                clickTarget.style.backgroundImage = 'url("img/o.svg")';
                clickTarget.classList.add('alreadySelected');
                clickTarget.style.cursor = 'default';
                playerOne.playerMoves.push(clickTarget);
                newBoard.compBoard[clickTarget.getAttribute('cell-num')] = "O";
                checkForWinner(playerOne.playerMoves);
                return computerMove();
            }
    }

    function computerMove() {
        compMinimax(newBoard.compBoard, computer.activePlayer);
        var compMove = compMinimax(newBoard.compBoard, computer.activePlayer).index
        if (compMove != undefined) {
            newBoard.allBoxesArray[compMove].classList.add('box-filled-2');
            newBoard.allBoxesArray[compMove].style.backgroundImage = 'url("img/x.svg")';
            newBoard.allBoxesArray[compMove].classList.add('alreadySelected');
            newBoard.compBoard[compMove] = "X";
            computer.playerMoves.push(newBoard.allBoxesArray[compMove]);
            checkForWinner(computer.playerMoves);
        }
        return playerOneActive();
    }

   //idea use filter to and charAt to filter out columns and rows     
    function checkForWinner(playerTurn) {
        if (playerOne.playerMoves.length > 2 || playerTwo.playerMoves.length > 2 || computer.playerMoves.length > 2) {
            
            const moveCoords = playerTurn.map(moveCoord => moveCoord.getAttribute('data-row') + moveCoord.getAttribute('data-col'));
            const sortCoords = moveCoords.sort();
            console.log(sortCoords);
            var testCoord1 = [];
            var testCoord2 = [];
            var testCoord3 = [];
            var testCoord4 = [];
            const rightDiagWin = ["02", "11", "20"];
            sortCoords.forEach((count,index) => {
                testCoord1 = sortCoords.filter(sortCoord => sortCoord.charAt(0) === index.toString());
                testCoord2 = sortCoords.filter(sortCoord => sortCoord.charAt(1) === index.toString());
                testCoord3 = sortCoords.filter(sortCoord => sortCoord.charAt(0) === sortCoord.charAt(1));
                testCoord4 = sortCoords
                    .filter((sortCoord, indexLoc) => sortCoord !== '00' && sortCoord !== '01' && sortCoord !== '10')  
                    .filter((sortCoord, indexLoc) => sortCoord === rightDiagWin[indexLoc] );

                if (testCoord1.length === 3 || testCoord2.length === 3 || testCoord3.length === 3 || testCoord4.length === 3) {
                    finishGame.classList.remove('active');
                    endGame(playerTurn);
                } else if (sortCoords.length === 5  &&          finishGame.classList.contains('active')) {
                    tie();
                }
                
            });        
        }
    }

    //Game End Screen
    function endGame(winner) {
        boardGame.style.display = 'none';
        startGame.style.display = 'none';
        finishGame.style.display = 'block';
        if( winner === playerOne.playerMoves) {
            finishGame.classList.add('screen-win-one');
            message.textContent = playerOne.name.value + ' Wins';
        }
        
        if( winner === playerTwo.playerMoves || winner === computer.playerMoves) {
            finishGame.classList.add('screen-win-two');
            message.textContent = playerTwo.name.value + ' Wins';
        }
    }

    function tie() {
        boardGame.style.display = 'none';
        startGame.style.display = 'none';
        finishGame.style.display = 'block';
        finishGame.classList.add('screen-win-tie');
        message.textContent = 'Tie Game';        
    }
    //Event Handlers
    //New Game Button. Resets all the game classes and arrays
    newGameButton.addEventListener('click', (e) => {
        boardGame.style.display = 'block';
        startGame.style.display = 'none';
        finishGame.style.display = 'none';
        playerOne.playerMoves.length = 0;
        playerTwo.playerMoves.length = 0;
        computer.playerMoves.length = 0;
        finishGame.classList.remove('screen-win-one', 'screen-win-two');
        finishGame.classList.add('active');
        message.textContent = '';
        playerOneActive();
        newBoard.compBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8,];
        newBoard.allBoxes.forEach((box2,j) => {
            box2.style.backgroundImage = 'none';
            box2.classList.remove('box-filled-1', 'box-filled-2');
            box2.classList.remove('alreadySelected');
            box2.style.cursor = 'pointer';
        });            
    });
    //Event Listener for star button to begin the game
    startButton.addEventListener('click', (e) => {
        boardGame.style.display = 'block';
        startGame.style.display = 'none';
        finishGame.style.display = 'none';
        const liOne = document.createElement('li');
        liOne.textContent = playerOne.name.value;
        playerOne.activePlayer.appendChild(liOne);
        const liTwo = document.createElement('li');
        liTwo.textContent = playerTwo.name.value;
        playerTwo.activePlayer.appendChild(liTwo);
    });
    
    //Event listener for pvp button
    pvpButton.addEventListener('click', (e) => {
        playerOne.name.style.display = 'inline-block';
        playerTwo.name.style.display = 'inline-block';
        pvpButton.style.display = 'none';
        pvcButton.style.display = 'none';
        startButton.style.display = 'inline-block';
    });

    pvcButton.addEventListener('click', (e) => {
        playerOne.name.style.display = 'inline-block';
        playerTwo.name.style.display = 'none';
        pvpButton.style.display = 'none';
        pvcButton.style.display = 'none';
        startButton.style.display = 'inline-block';
        const liTwo = document.createElement('li');
        liTwo.textContent = 'Computer';
        playerTwo.activePlayer.appendChild(liTwo);
        computer.activePlayer.classList.add('comp');
    });
        
        
    newBoard.boxes.addEventListener('mouseover', (e) => {
       var mouseoverTarget;
       mouseoverTarget = e.target;
       boxDisplay(mouseoverTarget);                           
    });
    
    newBoard.boxes.addEventListener('mouseout', (e) => {
       var mouseoutTarget = e.target;
        boxDisplayNone(mouseoutTarget);
    });
    
    newBoard.boxes.addEventListener('click', (e) => {
        var clickTarget; 
        clickTarget = e.target;
        inputPlayerMove(clickTarget);
    });

}());



