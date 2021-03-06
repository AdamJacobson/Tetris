const color_O = "yellow", color_L = "orange", color_J = "blue", color_T = "purple", color_I = "cyan", color_S = "lime", color_Z = "red";

const tetramino_I = {
	color: color_I,
	blocks: [
		{row: 0, col: -1},
		{row: 0, col: 0},
		{row: 0, col: 1},
		{row: 0, col: 2},
	]
}

const tetramino_L = {
	color: color_L,
	blocks: [
		{row: 0, col: 1},
		{row: 0, col: 0},
		{row: 0, col: -1},
		{row: 1, col: -1},
	]
}

const tetramino_J = {
	color: color_J,
	blocks: [
		{row: 0, col: 0},
		{row: 0, col: -1},
		{row: 0, col: 1},
		{row: 1, col: 1},
	]
}

const tetramino_O = {
	color: color_O,
	cantRotate: true,
	blocks: [
		{row: 0, col: 0},
		{row: 0, col: 1},
		{row: 1, col: 0},
		{row: 1, col: 1},
	]
}

const tetramino_S = {
	color: color_S,
	blocks: [
		{row: 0, col: 0},
		{row: 0, col: 1},
		{row: 1, col: 0},
		{row: 1, col: -1},
	]
}

const tetramino_T = {
	color: color_T,
	blocks: [
		{row: 0, col: 0},
		{row: 0, col: -1},
		{row: 0, col: 1},
		{row: 1, col: 0},
	]
}

const tetramino_Z = {
	color: color_Z,
	blocks: [
		{row: 0, col: 0},
		{row: 0, col: -1},
		{row: 1, col: 0},
		{row: 1, col: 1},
	]
}

const tetraminos = [tetramino_I, tetramino_J, tetramino_L, tetramino_O, tetramino_S, tetramino_T, tetramino_Z];

// Fisher-Yates shuffle
function shuffleTetraminos() {
	var array = clone(tetraminos);
	var m = array.length, t, i;

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}