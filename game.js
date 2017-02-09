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

const legal = 'legal';
const not_legal_continue = 'not_legal_continue';
const not_legal_end = 'not_legal_end';

const down = 'D';
const left = 'L';
const right = 'R';

var clone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function Game() {
	var fallTime = 1000;
	var fallInterval;
	var playing = false;
	var activeTetramino;
	var score = 0;
	
	var gameGrid = makeGrid(10, 20);
	
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
	
	// Check for completed rows and clear them. Then update score
	var clearRows = function() {
		for (var rowIndex = 0; rowIndex < gameGrid.length; rowIndex++) {
			if (rowIsComplete(rowIndex)) {
				console.log("row # ", rowIndex, " is completed.");
				deleteRow(rowIndex);
			}
		}
	}
	
	// Delete a row from the game grid and shift rows down
	var deleteRow = function(rowIndex) {
		while (rowIndex > 0) {
			gameGrid[rowIndex] = gameGrid[--rowIndex];
		}
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
	this.rotate = function() {
		activeTetramino.type.blocks.map(block => {
			var blockRow = block.row;
			
			block.row = block.col;
			block.col = -blockRow;
			}
		)
		render();
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
				spawnTetramino();
			}
			
			clearRows();
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
		activeTetramino.type.blocks.map(block =>
			gameGrid[block.row + activeTetramino.origin.row][block.col + activeTetramino.origin.col] = activeTetramino.type.color);
	}
	
	var render = function() {
		ReactDOM.render(
			<Board grid={calculateBoard()} />,
			document.getElementById("board")
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

var alertKey = function(event) {
	var x = event.which;
	console.log("The Unicode value is: " + x);
}

const arrowUp = 38;
const arrowDown = 40;
const arrowLeft = 37;
const arrowRight = 39;
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