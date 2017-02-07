// Stateless functional component
const Square = ({color}) => {
	return (
		<td className="gridSquare" style={{backgroundColor: color}}></td>
	)
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

// This method should perform all logic related to the existing board
// and the current tetramino which is is being controlled
var calculateBoard = function(grid, tetramino) {
	var legality = moveLegality(grid, tetramino)
	
	if (legality == 'legal') {
		console.log("Move is legal");
		tetramino.type.blocks.map(block => grid[block.row + tetramino.origin.row][block.col + tetramino.origin.col] = tetramino.type.color);
	} else if (legality == 'not_legal_continue') {
		console.log("Move is not legal but continue to allow control");
	} else if (legality == 'not_legal_end') {
		console.log("Move is not legal and control must end");
	}
}

// Return true or false if the tetramino can be applied to the grid
// Need to consider under what condition we should take away control of the tetramino vs just preventing the move
// If hitting a wall, not legal but continue. If hitting bottom, not legal and end.
// legal, end, continue
var moveLegality = function(grid, tetramino) {
	var legality = 'legal';
	
	tetramino.type.blocks.map(block => {
		if (block.row + tetramino.origin.row >= grid.length) {
			legality = 'not_legal_end'; // Reached bottom of grid
		} else if (block.col + tetramino.origin.col >= grid[0].length) {
			legality = 'not_legal_continue'; // Hit side of grid
		}
	});
	
	return legality;
}

var getRandomTetramino = function() {
	return tetraminos[Math.floor(Math.random() * tetraminos.length)];
}

var fall = function(tetramino) {
	tetramino.origin.row++;
}

var tetra = {
	type: getRandomTetramino(),
	origin: {row: 3, col: 3},
}

var renderGrid = function() {
	var grid = makeGrid(10, 20);
	
	calculateBoard(grid, tetra);

	ReactDOM.render(
		<Board grid={grid} />,
		document.getElementById("board")
	)
	
	fall(tetra);
}

function Game() {
	var gameInterval;
	var started = false;
	
	this.stopStart = function() {
		if (started) {
			stop();
		} else {
			start();
		}
	};
	
	var stop = function() {
		clearInterval(gameInterval);
		started = false;
	};
	
	var start = function() {
		gameInterval = setInterval(function(){renderGrid();}, 1000)
		started = true;
	};
	
	return {
		stopStart: this.stopStart
	};
}

var game = new Game();