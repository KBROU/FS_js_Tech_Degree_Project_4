//Project 4: Tic-Tac-Toe
//Kody Broussard
//7/9/2018
//Module Pattern used with vanilla JS

//const  ticTacToeModule = (function() {
    //Global Variables of ticTacToeModule
    const boardGame = document.getElementById('board');
    const startGame = document.getElementById('start');
    const finishGame = document.getElementById('finish');
    const startButton = document.querySelector('.button');
    const message = document.querySelector('.message');
    const newGameButton = document.querySelector('.newButton');
    
    class Board {
        constructor() {
            this.boxes = document.querySelector('.boxes');
            this.allBoxes = document.querySelectorAll('.box');
            this.allBoxes2 = document.querySelector('.box');
            this.boardLayout();
        }
        boardLayout() {
            this.allBoxes.forEach((box2,j) => {
                if (0 <= j && j < 3) {
                    box2.setAttribute('data-row', 0);
                    box2.setAttribute('data-col', j);
                } else if (3 <= j && j < 6) {
                    box2.setAttribute('data-row', 1);
                    box2.setAttribute('data-col', j-3);           
                } else if (6 <= j && j < 9){
                    box2.setAttribute('data-row', 2);
                    box2.setAttribute('data-col', j-6);
                }
            });            
        }
    }
    const newBoard = new Board();
    
    class Player {
        constructor(playerNumber) {
            this.playerNumber = playerNumber;
            this.activePlayer = document.getElementById(`player${playerNumber}`);
            this.playerMoves = [];
        }
    }
    const playerOne = new Player(1);
    const playerTwo = new Player(2);

    //Startup Screen Page Load using IIFE
    var startScreen = (function() {
        boardGame.style.display = 'none';
        finishGame.style.display = 'none';
        startGame.style.display = 'block';
        finishGame.classList.add('active');
        playerOneActive();
    }());

    //Start Button - Start Screen disappears and Board Appears
    
    //Need to add ClassSyntax for the player
    //Need to store box coordinates into an arry to test winner
    
    //Game Play
    function playerOneActive() {
        playerOne.activePlayer.classList.add('active');
        playerTwo.activePlayer.classList.remove('active');
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
    
    function inputPlayerMove(clickTarget) {
        if (clickTarget.classList.contains('alreadySelected') === false){
            
            if (playerOne.activePlayer.classList.contains('active')) {
                clickTarget.classList.add('box-filled-1');
                clickTarget.style.backgroundImage = 'url("img/o.svg")';
                clickTarget.classList.add('alreadySelected');
                clickTarget.style.cursor = 'default';
                playerOne.playerMoves.push(clickTarget);
                checkForWinner()
                return playerTwoActive();
            } 

            if (playerTwo.activePlayer.classList.contains('active')) {
                clickTarget.classList.add('box-filled-2');
                clickTarget.style.backgroundImage = 'url("img/x.svg")';
                clickTarget.classList.add('alreadySelected');
                clickTarget.style.cursor = 'default';
                playerTwo.playerMoves.push(clickTarget);
                checkForWinner()
                return playerOneActive()    
            }
        }
    }

   //idea use filter to and charAt to filter out columns and rows     
    function checkForWinner() {
        if (playerOne.playerMoves.length > 2 || playerTwo.playerMoves.length > 2) {
            var playerTurn;
            if ( playerOne.activePlayer.classList.contains('active')) {
                playerTurn = playerOne.playerMoves; 
            } else {
                playerTurn = playerTwo.playerMoves; 
            }
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
                    endGame();
                } else if (sortCoords.length === 5  &&          finishGame.classList.contains('active')) {
                    tie();
                }
                
            });        
        }
    }

    //Game End Screen
    function endGame() {
        boardGame.style.display = 'none';
        startGame.style.display = 'none';
        finishGame.style.display = 'block';
        //finishGame.classList.remove('active');
        if( playerOne.activePlayer.classList.contains('active')) {
            finishGame.classList.add('screen-win-one');
            message.textContent = 'Player One Wins';
        }
        
        if( playerTwo.activePlayer.classList.contains('active')) {
            finishGame.classList.add('screen-win-two');
            message.textContent = 'Player Two Wins';
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
        boardGame.style.display = 'none';
        startGame.style.display = 'block';
        finishGame.style.display = 'none';
        playerOne.playerMoves.length = 0;
        playerTwo.playerMoves.length = 0;
        finishGame.classList.remove('screen-win-one', 'screen-win-two');
        finishGame.classList.add('active');
        message.textContent = '';
        playerOneActive();
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

//}());



//////////////////////////Archive for later use
//forEach Loop
//horizontalWin.forEach((b, index) => {
//                if (playerOneMoves[0, 1, 2].coords = horizontalWin[0, 1, 2].coords) {
//                    console.log('win');
//                }    
//            }); 


//works for 1 horizontal win at a time
//sortCoords.forEach((sortCoord, index) =>  {
//                testCoord = sortCoord === (horizontalWin1[index]);
//                //console.log(sortCoord);
//                console.log(testCoord);
//                return testCoord;
//            });
//            if (testCoord === true) {
//                console.log('win');
//            }        

//Works for single horizontal win
//            const testCoord3 = sortCoords.filter(sortCoord => sortCoord.charAt(0) === '2');