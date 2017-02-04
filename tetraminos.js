const O = "yellow", L = "orange", J = "blue", T = "purple", I = "cyan", S = "lime", Z = "red";
const colors = [O, L, T, J, I, S, Z];

const tetramino_I = {
	color: "cyan",
	blocks: [
		{row: -1, col: 0},
		{row: 0, col: 0},
		{row: 1, col: 0},
		{row: 2, col: 0},
	]
}

const tetramino_L = {
	color: "orange",
	blocks: [
		{row: -1, col: 0},
		{row: 0, col: 0},
		{row: 1, col: 0},
		{row: 1, col: 1},
	]
}

const tetramino_J = {
	color: "blue",
	blocks: [
		{row: -1, col: 0},
		{row: 0, col: 0},
		{row: 1, col: 0},
		{row: 1, col: -1},
	]
}

const tetramino_O = {
	color: "yellow",
	blocks: [
		{row: 0, col: 0},
		{row: 0, col: 1},
		{row: 1, col: 0},
		{row: 1, col: 1},
	]
}

const tetramino_S = {
	color: "lime",
	blocks: [
		{row: 0, col: 0},
		{row: 0, col: -1},
		{row: -1, col: 0},
		{row: -1, col: 1},
	]
}

const tetramino_T = {
	color: "purple",
	blocks: [
		{row: 0, col: 0},
		{row: -1, col: 0},
		{row: -1, col: -1},
		{row: -1, col: 1},
	]
}

const tetramino_Z = {
	color: "red",
	blocks: [
		{row: 0, col: 0},
		{row: -1, col: 0},
		{row: -1, col: -1},
		{row: 0, col: 1},
	]
}

const tetraminos = [tetramino_I, tetramino_J, tetramino_L, tetramino_O, tetramino_S, tetramino_T, tetramino_Z];

var getRandomTetramino = function() {
	return tetraminos[Math.floor(Math.random() * tetraminos.length)];
}