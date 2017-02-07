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