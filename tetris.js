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
	// Assuming no conflicts of the current board and the current tetramino, place the tetramino into the board
	tetramino.type.blocks.map(block => grid[block.row + tetramino.origin.row][block.col + tetramino.origin.col] = tetramino.type.color);
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