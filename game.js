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

var clone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function Game() {
	var fallTime = 1000;
	var fallInterval;
	var playing = false;
	var activeTetramino;
	
	var gameGrid = makeGrid(10, 20);
	
	// Create a random Tetramino at a spawn point and set it to active
	var spawnTetramino = function() {
		activeTetramino = {
			type: getRandomTetramino(),
			origin: {row: 3, col: 3},
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
		move('D');
	}
	
	this.left = function() {
		move('L');
	}

	this.right = function() {
		move('R');
	}
	
	// Check to see if the move is legal and modify the active tetramino accordingly
	var move = function(direction) {
		if (playing) {
			var futureTetramino = clone(activeTetramino);
			
			if (direction == 'R') {
				futureTetramino.origin.col++;
			} else if (direction == 'L') {
				futureTetramino.origin.col--;
			} else if (direction == 'D') {
				futureTetramino.origin.row++;
			}
			
			var legality = moveLegality(futureTetramino);
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
	var moveLegality = function(tetramino) {
		var legality = legal;
		
		tetramino.type.blocks.map(block => {
			if (block.row + tetramino.origin.row >= gameGrid.length) { // Reached bottom of grid
				legality = not_legal_end;
			} else if (block.col + tetramino.origin.col >= gameGrid[0].length || block.col + tetramino.origin.col < 0) { // Passed side of grid
				legality = not_legal_continue;
			}
		});
		
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
		down: this.down
	}
}

var game = new Game();