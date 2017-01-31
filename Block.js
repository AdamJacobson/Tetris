//function Block(color, row, col) {
//	this.color = color;
//	this.row = row;
//	this.col = col;
//}

class Block extends React.Component {
	constructor(props) {
		this.color = this.props.color;
		this.row = this.props.row;
		this.col = this.props.col;
	}

	render() {
		return (
			<td style="background-color: " + {this.props.color}></td>
		)
	}
}