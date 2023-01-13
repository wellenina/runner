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

const dino = {
    element: document.getElementById('dino'),
    dinoIdle: 'images/dino-idle.png',
    dinoRun1: 'images/dino-run1.png',
    dinoRun2: 'images/dino-run2.png',
    dinoJump: 'images/dino-jump.png',
    isJumping: false
}

window.addEventListener('keydown', jump);

let playingInterval;
// when starting the game:
playing = setInterval(update, 90);

// game over:
// clearInterval(playing);

function update() {
   move(background);
   move(ground);
   if (!dino.isJumping) { run(); };
}

function move(obj) {
    if (!obj.element.style.left) { obj.element.style.left = 0 }; // questo si potrebbe settare all'inizio della partita
    obj.element.style.left = `${(parseFloat(obj.element.style.left) - obj.speed) % obj.loopingPoint}px`;
}

function run() {
    if (dino.element.getAttribute('src') === dino.dinoRun1) {
        dino.element.setAttribute('src', dino.dinoRun2)
    } else {
        dino.element.setAttribute('src', dino.dinoRun1)
    }
}

function jump(event) {
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'ArrowUp' || event.key === 'Up') {
        dino.isJumping = true;
        dino.element.className = 'jumping';
        dino.element.setAttribute('src', dino.dinoJump);
    }
}

dino.element.addEventListener('animationend', () => {
    dino.isJumping = false;
    dino.element.className = 'running';
});