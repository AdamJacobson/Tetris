// Stateless functional component
const Square = ({color}) => {
	return (
		<td className="gridSquare" style={{backgroundColor: color}}></td>
	)
}

class Row extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const colors = Array(this.props.columns).fill("white");
		const listItems = colors.map((color) =>
  			<Square color={color}></Square>
		);
									 
		return (
			<tr>{listItems}</tr>
		)
	}
}

class Board extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const colors = Array(this.props.rows).fill(null);
		const listItems = colors.map((color) =>
  			<Row columns={this.props.columns}></Row>
		);
		
		return (
			<tbody>{listItems}</tbody>
		)
	}
}

ReactDOM.render(
	<Board rows={20} columns={10}/>,
	document.getElementById("board")
)