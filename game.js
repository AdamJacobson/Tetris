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

function Game() {
	var gridWidth = 10;
	var gridHeight = 20;
	var scorePerRow = 100;
	
	var fallTime = 1000;
	var playing = false;
	var score = 0;
	
	var fallInterval;
	var activeTetramino;
	
	var gameGrid = makeGrid(gridWidth, gridHeight);
	
	const down = 'D';
	const left = 'L';
	const right = 'R';

	const legal = 'legal';
	const not_legal_continue = 'not_legal_continue';
	const not_legal_end = 'not_legal_end';

	// Create a random Tetramino at a spawn point and set it to active
	var spawnTetramino = function() {
		activeTetramino = {
			type: getRandomTetramino(),
			origin: {row: 2, col: 5},
		}
	}
	
	var getRandomTetramino = function() {
		return tetraminos[Math.floor(Math.random() * tetraminos.length)];
	}
	
	spawnTetramino();
	
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
				console.log("row # ", rowIndex, " is completed.");
				markRowComplete(rowIndex);
				score += scorePerRow;
				console.log("Score: " + score);
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
	
	var getRandomTetramino = function() {
		return tetraminos[Math.floor(Math.random() * tetraminos.length)];
	}
	
	// Rotate active Tetramino 90 degrees CW
	// TODO - Need to make rotation conditional on legality. Should push away from walls when possible
	this.rotate = function() {
		if (activeTetramino.type.canRotate != false || activeTetramino.type.canRotate == undefined) {
			activeTetramino.type.blocks.map(block => {
				var blockRow = block.row;
				
				block.row = block.col;
				block.col = -blockRow;
				}
			)
			render();
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
		move(down);
	}
	
	this.left = function() {
		move(left);
	}

	this.right = function() {
		move(right);
	}
	
	// Move the active tetramino
	var move = function(direction) {
		if (playing) {
			var futureTetramino = clone(activeTetramino);
			
			if (direction == right) {
				futureTetramino.origin.col++;
			} else if (direction == left) {
				futureTetramino.origin.col--;
			} else if (direction == down) {
				futureTetramino.origin.row++;
			}
			
			// Check legality of move
			var legality = moveLegality(futureTetramino, direction);
			console.log("Moving active Tetramino " + direction + " legality is " + legality);
			
			if (legality == legal) {
				// Apply the move
				activeTetramino.origin = futureTetramino.origin;
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
	
	// Return a new grid which is the current grid plus the active Tetramino
	var calculateBoard = function() {
		var newGrid = clone(gameGrid);
		
		activeTetramino.type.blocks.map(block =>
			newGrid[block.row + activeTetramino.origin.row][block.col + activeTetramino.origin.col] = activeTetramino.type.color);
		
		return newGrid;
	}
	
	// Determine if the given Tetramino is in a legal position
	var moveLegality = function(futureTetramino, direction) {
		var legality = legal;
		var end = false;
		
		futureTetramino.type.blocks.map(block => {
			if (block.row + futureTetramino.origin.row >= gameGrid.length) { // Reached bottom of grid
				legality = not_legal_end;
			} else if (block.col + futureTetramino.origin.col >= gameGrid[0].length || block.col + futureTetramino.origin.col < 0) { // Passed side of grid
				legality = not_legal_continue;
			} else if (gameGrid[block.row + futureTetramino.origin.row][block.col + futureTetramino.origin.col] != null) { // Hit another block
				if (direction == down) { // if moving down, end
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
	
	// Apply the active Tetramino in the current board
	// This will 'fix' the block colors to the board at their current position
	var applyTetraminoToBoard = function() {
		console.warn("Before adding Tetramino: \n" + JSON.stringify(gameGrid));
		
		// Don't need map() here. Should use forEach or for loop
		activeTetramino.type.blocks.map(block => {
			updateGridColor(block.row + activeTetramino.origin.row, block.col + activeTetramino.origin.col, activeTetramino.type.color);
			console.error("While adding Tetramino: \n" + JSON.stringify(gameGrid));
		});
		
		console.warn("After adding Tetramino: \n" + JSON.stringify(gameGrid));
	}
	
	var updateGridColor = function(row, col, color) {
		console.log("Updating gameGrid[" + row + "][" + col + "] = " + color);
		gameGrid[row][col] = color;
	}
	
	var render = function() {
		ReactDOM.render(
			<Board grid={calculateBoard()} />,
			document.getElementById("board")
		)
		
		ReactDOM.render(
			<GameInfo score={score} />,
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