const JUMP_STARTING_POINT = 12; // px from the bottom
const DINO_HEIGHT = 43;
let JUMP_INITIAL_VELOCITY = 14; // px per frame
let JUMP_GRAVITY = 1.2;
let JUMP_FALL_GRAVITY = 1.2;

const background = document.getElementById('background');
const ground = document.getElementById('ground');
const horizontalLines = document.getElementById("lines-container");

const jumpHeightText = document.getElementById('jump-height-text');
const jumpDurationText = document.getElementById('jump-duration-text');

const initialVelocitySlider = document.getElementById("initial-velocity");
const gravitySlider = document.getElementById("jump-gravity");
const fallGravitySlider = document.getElementById("fall-gravity");
const showLinesCheckbox = document.getElementById("show-grid");

initialVelocitySlider.oninput = function() {
    JUMP_INITIAL_VELOCITY = parseInt(this.value);
    dino.velocity = JUMP_INITIAL_VELOCITY;
}
gravitySlider.oninput = function() {
    JUMP_GRAVITY = parseInt(this.value) / 10;
    dino.gravity = JUMP_GRAVITY;
}
fallGravitySlider.oninput = function() {
    JUMP_FALL_GRAVITY = parseInt(this.value) / 10;
}
showLinesCheckbox.oninput = function() {
    if (horizontalLines.style.display == 'block') {
        horizontalLines.style.display = 'none';
    } else {
        horizontalLines.style.display = 'block';
    }
}


const dino = {
    element: document.getElementById('dino'),
    imgIdle: 'images/dino-idle.png',
    imgJump: 'images/dino-jump.png',

    isJumping: false,
    isGoingUp: false,
    jumpTimer: 0,

    velocity: JUMP_INITIAL_VELOCITY,
    gravity: JUMP_GRAVITY,

    startJump() {
        this.isJumping = true;
        this.isGoingUp = true;
        this.jumpTimer = 0;

        jumpHeightText.innerHTML = '';
        jumpDurationText.innerHTML = '';
    },

    jump() {
        this.element.style.bottom = `${parseInt(this.element.style.bottom) + this.velocity}px`;
        this.velocity = this.velocity - this.gravity;

        // when Dino gets to the peak
        if (this.isGoingUp && this.velocity <= 0) {
            this.isGoingUp = false;
            this.gravity = JUMP_FALL_GRAVITY;
            let jumpHeight = ((parseInt(this.element.style.bottom) - JUMP_STARTING_POINT) / DINO_HEIGHT + 1).toFixed(2);
            jumpHeightText.innerHTML = jumpHeight + " Dinos";
        }

        // when Dino gets to the bottom, the jump ends
        if (parseInt(this.element.style.bottom) <= JUMP_STARTING_POINT) {
            this.reset();
            let duration = this.jumpTimer / 1000;
            jumpDurationText.innerHTML = duration + " seconds";
        }
    },

    reset() {
        this.element.style.bottom = `${JUMP_STARTING_POINT}px`;
        this.isJumping = false;
        this.velocity = JUMP_INITIAL_VELOCITY;
        this.gravity = JUMP_GRAVITY;
    }
};

const sounds = {
    jump: new Audio('sounds/jump.wav'),

    play(sound) {
        this[sound].play();
    }
};


let gameState = 'start';
let interval;

function startInterval() {
    interval = setInterval(update, 30);
}
function stopInterval() {
    clearInterval(interval);
}

window.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'ArrowUp' || event.key === 'Up') {
        control(event);
    }
});
document.getElementById('runner-container').addEventListener("touchstart", control);
document.getElementById('runner-container').addEventListener("mousedown", control);

function control(event) {
        event.preventDefault();
        switch(gameState) {
            case 'start':
                startGame();
                break;
            case 'play':
                if (!dino.isJumping) {
                    sounds.play('jump');
                    dino.startJump();
                };
          }
};

window.addEventListener('blur', () => {
    if (gameState === 'play') { stopInterval(); };
});
window.addEventListener('focus', () => {
    if (gameState === 'play') { startInterval(); };
});

function startGame() {
    gameState = 'play';
    document.getElementById('game-start').style.display = 'none';
    display(background);
    display(ground);

    dino.element.setAttribute('src', dino.imgJump);
    dino.reset();

    startInterval();
}

function display(element) {
    element.style.display = 'block';
}

function update() {
    dino.jumpTimer += 30;

    if (dino.isJumping) {
        dino.jump();
    }
}