const O = "yellow", L = "orange", J = "blue", T = "purple", I = "cyan", S = "lime", Z = "red";
const colors = [O, L, T, J, I, S, Z];

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
	for (var i = 0; i < height; i++){
  		grid[i] = [];
  		for(var k = 0; k < width; k++) {
    		grid[i][k] = colors[Math.floor(Math.random() * colors.length)];
  		}
	}
	return grid;
}

var doStuff = function() {
	var grid = makeGrid(10, 20);

	ReactDOM.render(
		<Board grid={grid} />,
		document.getElementById("board")
	)
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
		gameInterval = setInterval(function(){doStuff();}, 1000)
		started = true;
	};
	
	return {
		stopStart: this.stopStart
	};
}

var game = new Game();