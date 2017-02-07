// Stateless functional component
const Square = ({color}) => {
	return <td className="gridSquare" style={{backgroundColor: color}}></td>
}

class Board extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<tbody>
				{this.props.grid.map( (row, rindex) => 
					<tr>
						{row.map( (col, cindex) => 
							<Square color={col} />
						)}
					</tr>
				)}
			</tbody>
		)
	}
}

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

// Return a new grid which will be rendered
// Do not modify the existing grid
var calculateBoard = function(grid, tetramino) {
	var newGrid = clone(grid);
	var legality = moveLegality(grid, tetramino)
	
	// console.log("Move legality: ", legality);
	if (legality == legal) {
		tetramino.type.blocks.map(block => newGrid[block.row + tetramino.origin.row][block.col + tetramino.origin.col] = tetramino.type.color);
	} else if (legality == not_legal_continue) {
		
	} else if (legality == not_legal_end) {
		
	}
	
	return newGrid;
}

// Return true or false if the tetramino can be applied to the grid
// Need to consider under what condition we should take away control of the tetramino vs just preventing the move
// If hitting a wall, not legal but continue. If hitting bottom, not legal and end.
// legal, end, continue
var moveLegality = function(grid, tetramino) {
	var legality = legal;
	
	tetramino.type.blocks.map(block => {
		if (block.row + tetramino.origin.row >= grid.length) { // Reached bottom of grid
			legality = not_legal_end;
		} else if (block.col + tetramino.origin.col >= grid[0].length || block.col + tetramino.origin.col < 0) { // Passed side of grid
			legality = not_legal_continue;
		}
	});
	
	return legality;
}

var getRandomTetramino = function() {
	return tetraminos[Math.floor(Math.random() * tetraminos.length)];
}

function Game() {
	var fallInterval;
	var started = false;
	var activeTetramino = {
		type: getRandomTetramino(),
		origin: {row: 3, col: 3},
	}
	var gameGrid = makeGrid(10, 20);
	
	this.stopStart = function() {
		if (started) {
			stop();
		} else {
			start();
		}
	};
	
	var stop = function() {
		clearInterval(fallInterval);
		started = false;
	};
	
	var start = function() {
		fallInterval = setInterval(function(){
			fall();
			}, 1000)
		started = true;
	};
	
	var fall = function() {
		move('D');
		render();
	};
	
	// Down is same as fall() but resets the fall timer
	this.down = function() {
		fall();
		clearInterval(fallInterval);
		fallInterval = setInterval(function(){
			fall();
		}, 1000)
	}
	
	this.left = function() {
		move('L');
		render();
	}

	this.right = function() {
		move('R');
		render();
	}
	
	// Check to see if the move is legal and modify the active tetramino accordingly
	var move = function(direction) {
		var futureTetramino = clone(activeTetramino);
		
		if (direction == 'R') {
			futureTetramino.origin.col++;
		} else if (direction == 'L') {
			futureTetramino.origin.col--;
		} else if (direction == 'D') {
			futureTetramino.origin.row++;
		}
		
		var legality = moveLegality(gameGrid, futureTetramino);
		console.log("Moving active Tetramino " + direction + " legality is " + legality);
		
		if (legality == legal) {
			activeTetramino.origin = futureTetramino.origin;
		} else if (legality == not_legal_continue) {
			// Do nothing
		} else if (legality == not_legal_end) {
			// Need to add tetramino to the grid then create a new one
			activeTetramino = {
				type: getRandomTetramino(),
				origin: {row: 3, col: 3},
			}
		}
	}
	
	var render = function() {
		var newGrid = calculateBoard(gameGrid, activeTetramino);
		
		ReactDOM.render(
			<Board grid={newGrid} />,
			document.getElementById("board")
		)
	}
	
	return {
		stopStart: this.stopStart,
		left: this.left,
		right: this.right,
		down: this.down
	};
}

var game = new Game();