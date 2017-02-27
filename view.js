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

class Preview extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var previewGrid = 
			[[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null]];

		var next = this.props.nextTetramino;
		var rowOffset = 2;
		var colOffset = 2;

		next.blocks.map(block => {
			previewGrid[block.row + rowOffset][block.col + colOffset] = next.color;
		});

		return(
			<table id="preview">
				<tbody>
					{previewGrid.map( (row, rindex) => 
						<tr>
							{row.map( (col, cindex) => 
								<Square color={col} />
							)}
						</tr>
					)}
				</tbody>
			</table>
			)
	}
}

class GameInfo extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return(
			<div class="gameInfoContainer">
				<Preview nextTetramino={this.props.nextTetramino} />
				Next
				<div className="gameStats">
					Score: {this.props.score}
				</div>
			</div>
		)
	}
}