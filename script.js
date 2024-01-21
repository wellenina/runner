const JUMP_STARTING_POINT = 12; // px from the bottom
let JUMP_GRAVITY = 1.2;
let JUMP_INITIAL_HEIGHT = 14; // px per frame
let JUMP_MAX_HEIGHT = 94;  // px from the bottom
let SHORT_JUMP_MAX_HEIGHT = 78;  // px from the bottom

const background = {
    element: document.getElementById('background'),
}
const ground = {
    element: document.getElementById('ground'),
}

const dino = {
    element: document.getElementById('dino'),
    imgIdle: 'images/dino-idle.png',
    imgJump: 'images/dino-jump.png',
    isJumping: false,
    jumpHeight: JUMP_INITIAL_HEIGHT,
    longJumpHeight: JUMP_MAX_HEIGHT, // costante
    shortJumpHeight: SHORT_JUMP_MAX_HEIGHT, // costante
    jumpGravity: JUMP_GRAVITY,

    jump() {
        this.element.style.bottom = `${parseFloat(this.element.style.bottom) + this.jumpHeight}px`;

        // when Dino gets to this point, check if the key is still pressed
        if (this.jumpHeight > 0 && parseInt(this.element.style.bottom) >= this.shortJumpHeight && !isKeyPressed) {
            this.jumpHeight = 0;
            this.jumpGravity = this.jumpGravity * 1.1;
        };

        // when Dino gets to the higher point, start going down
        if (parseInt(this.element.style.bottom) >= this.longJumpHeight) {
            this.jumpHeight = 0;
            this.jumpGravity = this.jumpGravity * 0.9;
        };
        this.jumpHeight = this.jumpHeight - this.jumpGravity;

        // when Dino gets to the bottom, the jump ends
        if (parseInt(this.element.style.bottom) <= JUMP_STARTING_POINT) {
            this.reset();
        }
    },

    reset() {
        this.element.style.bottom = `${JUMP_STARTING_POINT}px`;
        this.isJumping = false;
        this.jumpHeight = JUMP_INITIAL_HEIGHT;
        this.jumpGravity = JUMP_GRAVITY;
    }
};

const sounds = {
    jump: new Audio('sounds/jump.wav'),

    play(sound) {
        this[sound].play();
    }
};


let gameState = 'start';
let frameCounter = 0;
let interval;

function startInterval() {
    interval = setInterval(update, 30);
}
function stopInterval() {
    clearInterval(interval);
}

let isKeyPressed = false;
window.addEventListener('keydown', control);

function control(event) {
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'ArrowUp' || event.key === 'Up') {
        event.preventDefault();
        switch(gameState) {
            case 'start':
                startGame();
                break;
            case 'play':
                isKeyPressed = true;
                if (!dino.isJumping) {
                    sounds.play('jump');
                    dino.isJumping = true;
                };
          }
    }
};

window.addEventListener('keyup', function() {
    if (isKeyPressed) { isKeyPressed = false; };
});

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

function display(obj) {
    obj.element.style.left = 0;
    obj.element.style.display = 'block';
}

function update() {
    frameCounter++;
    if (dino.isJumping) {
        dino.jump();
    }
}