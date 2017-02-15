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

class GameInfo extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return(
			<div class="gameInfoContainer">
				<div className="nextBlock">
				</div>
				Next
				<div className="gameStats">
					Score: {this.props.score}
				</div>
			</div>
		)
	}
}