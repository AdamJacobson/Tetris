var onLoad = function() {
	console.log("window loaded");
	generateGrid(20, 10);
	startGame();
}

var generateGrid = function(rows, columns) {
	var gridTable = document.getElementById("gridTable");

	for (i = 0; i < rows; i++) {
		var row = document.createElement("tr");
		row.setAttribute("id", "r" + i)

		for (k = 0; k < columns; k++) {
			var col = document.createElement("td");
			col.setAttribute("id", "r" + i + "c" + k);

			row.appendChild(col);
		}

		gridTable.appendChild(row);
	}
}

var Tetris = function() {
	this.layout = (function() {
		this.gridView = (function() {
			this.render = function(block) {
				var cell = $("#r" + block.row + "c" + block.col);
				cell.css("background-color", "red");

				
			}
			return {render: this.render};
		})()
		return {gridView: this.gridView};
	})()
	return this;
}

var startGame = function() {
	var b = new Block("#FF0000", 0, 0);
	var tetris = new Tetris();
	tetris.layout.gridView.render(b);
}


window.onload = onLoad();