const arrowDown = 40;
const arrowRight = 39;
const arrowUp = 38;
const arrowLeft = 37;
const spaceBar = 32;

document.addEventListener('keydown', function(event) {
	event = event || window.event;

	switch (event.which) {
		case arrowUp:
			game.rotate();
			break;
		case arrowDown:
			game.down();
			break;
		case arrowLeft:
			game.left();
			break;
		case arrowRight:
			game.right();
			break;
		case spaceBar:
			game.playPause();
			break;
	}
});