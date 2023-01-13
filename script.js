const runnerContainer = document.getElementById('runner-container');

const background = {
    element: document.getElementById('background'),
    speed: 1,
    loopingPoint: 600
}

const ground = {
    element: document.getElementById('ground'),
    speed: 4,
    loopingPoint: 600
}

let playingInterval;
// when starting the game:
playing = setInterval(update, 90);

// game over:
// clearInterval(playing);

function update() {
   move(background);
   move(ground);
}

function move(obj) {
    if (!obj.element.style.left) { obj.element.style.left = 0 }; // questo si potrebbe settare all'inizio della partita
    obj.element.style.left = `${(parseFloat(obj.element.style.left) - obj.speed) % obj.loopingPoint}px`;
}