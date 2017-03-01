var makeGrid = function(width, height) {
	var grid = [];
	for (var r = 0; r < height; r++) {
  		grid[r] = [];
  		for(var c = 0; c < width; c++) {
    		grid[r][c] = null;
  		}
	}
	return grid;
}

var clone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
}

var enableLogging = true;
var log = function(message) {
	if (enableLogging) {
		console.log(message);
	}
}

function Game() {
	var gridWidth = 10;
	var gridHeight = 20;
	var scorePerRow = 100;
	
	var fallTime = 1000;
	var playing = false;
	var score = 0;
	
	var fallInterval;
	var activeTetramino;

	var gameOver = false;
	
	var gameGrid = makeGrid(gridWidth, gridHeight);
	
	const MOVE_DOWN = 'move_down';
	const MOVE_LEFT = 'move_left';
	const MOVE_RIGHT = 'move_right';
	const ROTATE = 'rotate';

	const legal = 'legal';
	const not_legal_continue = 'not_legal_continue';
	const not_legal_end = 'not_legal_end';

	// Create a random Tetramino at a spawn point and set it to active
	var spawnTetramino = function() {
		activeTetramino = {
			type: getNextTetramino(),
			origin: {row: 0, col: Math.floor(gridWidth / 2)},
		}

		// check for game over
		activeTetramino.type.blocks.map(block => {
			if (gameGrid[block.row + activeTetramino.origin.row][block.col + activeTetramino.origin.col]) {				
				gameOver();
			}
		});
	}

	var gameOver = function() {
		gameOver = true;
		pause();

		var mask = document.getElementById("mask");
		mask.classList.remove("hide");
	}

	var nextTetraminos = [];
	// Get next tetramino from shuffled array of possibles. Reshuffle when run out
	var getNextTetramino = function() {
		if (nextTetraminos.length == 0) {
			nextTetraminos = shuffleTetraminos();
		}
		
		return nextTetraminos.pop();
	}

	// see the next tetramino without actually taking it
	var previewNextTetramino = function() {
		if (nextTetraminos.length == 0) {
			nextTetraminos = shuffleTetraminos();
		}

		return nextTetraminos[nextTetraminos.length - 1];
	}
	
	spawnTetramino();
	
	// Pause or play the game
	this.playPause = function() {
		if (playing) {
			pause();
		} else {
			play();
		}
	}
	
	// Clear completed rows and update score
	var clearRows = function() {
		for (var rowIndex = gameGrid.length - 1; rowIndex >= 0; rowIndex--) {
			if (rowIsComplete(rowIndex)) {
				log("row # ", rowIndex, " is completed.");
				markRowComplete(rowIndex);
				score += scorePerRow;
				log("Score: " + score);
			}
		}
		clearCompletedRows();
	}
	
	const complete = "complete";
	
	var markRowComplete = function(rowIndex) {
		gameGrid[rowIndex][0] = complete;
	}
	
	var clearCompletedRows = function() {
		var newGrid = makeGrid(gridWidth, gridHeight);
		var currentRow = gameGrid.length - 1;
		
		// For all rows in the original grid
		for (var rowIndex = gameGrid.length - 1; rowIndex >= 0 ; rowIndex--) {
			// If marked as complete
			if (gameGrid[rowIndex][0] !== complete) {
				// clone row to new grid using separate counter
				newGrid[currentRow] = clone(gameGrid[rowIndex]);
				currentRow--;
			}
		}
		
		gameGrid = clone(newGrid);
	}
	
	// Return true if row has no empty spaces
	var rowIsComplete = function(rowIndex) {
		for (var i = 0; i < gameGrid[0].length; i++) {
			if (!gameGrid[rowIndex][i]) {
				return false;
			}
		}
		return true;
	}
	
	var pause = function() {
		clearInterval(fallInterval);
		playing = false;
	}
	
	var play = function() {
		fallInterval = setInterval(function(){
			fall();
			}, fallTime)
		playing = true;
	}
	
	// Rotate active Tetramino 90 degrees CW
	// TODO - Need to make rotation conditional on legality. Should push away from walls when possible
	this.rotate = function() {
		if (playing) {
			if (!activeTetramino.type.cantRotate) {
				move(ROTATE);
			}
		}
	}
	
	// Down is same as fall() but resets the fall timer
	this.down = function() {
		if (playing) {
			fall();
			clearInterval(fallInterval);
			fallInterval = setInterval(function(){
				fall();
			}, fallTime)
		}
	}
	
	var fall = function() {
		move(MOVE_DOWN);
	}
	
	this.left = function() {
		move(MOVE_LEFT);
	}

	this.right = function() {
		move(MOVE_RIGHT);
	}
	
	// Move the active tetramino
	var move = function(action) {
		if (playing && !gameOver) {
			var futureTetramino = clone(activeTetramino);
			
			if (action == MOVE_RIGHT) {
				futureTetramino.origin.col++;
			} else if (action == MOVE_LEFT) {
				futureTetramino.origin.col--;
			} else if (action == MOVE_DOWN) {
				futureTetramino.origin.row++;
			} else if (action == ROTATE) {
				futureTetramino.type.blocks.map(block => {
					var blockRow = block.row;
					
					block.row = block.col;
					block.col = -blockRow;
				});

				log(futureTetramino);
			}
			
			// Check legality of move
			var legality = moveLegality(futureTetramino, action);
			log("Moving active Tetramino " + action + " legality is " + legality);
			
			if (legality == legal) {
				// Apply the move
				activeTetramino.origin = futureTetramino.origin;

				// Apply blocks if rotating
				if (action == ROTATE) {
					log(futureTetramino.blocks);
					activeTetramino.type.blocks = futureTetramino.type.blocks;
				}
			} else if (legality == not_legal_continue) {
				// Do nothing
			} else if (legality == not_legal_end) {
				// Need to add current tetramino to the grid then create a new one
				applyTetraminoToBoard();
				clearRows();
				spawnTetramino();
			}
			
			render();
		}
	}
	
	// Determine if the given Tetramino is in a legal position
	var moveLegality = function(futureTetramino, action) {
		var legality = legal;
		var end = false;
		
		futureTetramino.type.blocks.map(block => {
			if (block.row + futureTetramino.origin.row >= gameGrid.length) { // Reached bottom of grid
				legality = not_legal_end;
			} else if (block.col + futureTetramino.origin.col >= gameGrid[0].length || block.col + futureTetramino.origin.col < 0) { // Passed side of grid
				legality = not_legal_continue;
			} else if (gameGrid[block.row + futureTetramino.origin.row][block.col + futureTetramino.origin.col] != null) { // Hit another block
				if (action == MOVE_DOWN) { // if moving down, end
					legality = not_legal_end;
					end = true; // If even one block is under us when moving down, raise flag
				} else {
					legality = not_legal_continue; // else, continue
				}
			}
		});
		
		if (end) {
			legality = not_legal_end;
		}
		
		return legality;
	}

	// Return a new grid which is the current grid plus the active Tetramino
	var calculateBoard = function() {
		var newGrid = clone(gameGrid);
		
		activeTetramino.type.blocks.map(block =>
			newGrid[block.row + activeTetramino.origin.row][block.col + activeTetramino.origin.col] = activeTetramino.type.color);
		
		return newGrid;
	}
	
	// Apply the active Tetramino in the current board
	// This will 'fix' the block colors to the board at their current position
	var applyTetraminoToBoard = function() {
		// log("Before adding Tetramino: \n" + JSON.stringify(gameGrid));
		
		// Don't need map() here. Should use forEach or for loop
		activeTetramino.type.blocks.map(block => {
			updateGridColor(block.row + activeTetramino.origin.row, block.col + activeTetramino.origin.col, activeTetramino.type.color);
			// log("While adding Tetramino: \n" + JSON.stringify(gameGrid));
		});
		
		// log("After adding Tetramino: \n" + JSON.stringify(gameGrid));
	}
	
	var updateGridColor = function(row, col, color) {
		log("Updating gameGrid[" + row + "][" + col + "] = " + color);
		gameGrid[row][col] = color;
	}
	
	var render = function() {
		ReactDOM.render(
			<Board grid={calculateBoard()} />,
			document.getElementById("board")
		)
		
		ReactDOM.render(
			<GameInfo score={score} nextTetramino={previewNextTetramino()} />,
			document.getElementById("gameInfoContainer")
		)
	}
	
	return {
		playPause: this.playPause,
		left: this.left,
		right: this.right,
		down: this.down,
		rotate: this.rotate
	}
}

var game = new Game();

const arrowDown = 40;
const arrowRight = 39;
const arrowUp = 38;
const arrowLeft = 37;
const spaceBar = 32;

document.onkeydown = function registerKeyboardCommands() {
	switch (event.keyCode) {
		case arrowUp:
			game.rotate();
			break;
		case arrowDown:
			game.down();
			break;
		case arrowLeft:
			game.left();
			break;
		case arrowRight:
			game.right();
			break;
		case spaceBar:
			game.playPause();
			break;
	}
}

window.onload = function() {
	game.playPause();
}