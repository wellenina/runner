let BACKGROUND_SPEED = 1; // pixels per frame
let FOREGROUND_SPEED = 7; // ground & obstacles

let JUMP_STARTING_POINT = 12; // px from the bottom
let JUMP_GRAVITY = 2;
let JUMP_HEIGHT = 20; // px per frame

let OBSTACLES_INITIAL_GAP = 45;
let OBSTACLES_MIN_GAP = 30;
let OBSTACLES_MAX_GAP = 240;

const background = {
    element: document.getElementById('background'),
    speed: BACKGROUND_SPEED,
    loopingPoint: 600
}

const ground = {
    element: document.getElementById('ground'),
    speed: FOREGROUND_SPEED,
    loopingPoint: 600
}

const dino = {
    element: document.getElementById('dino'),
    imgIdle: 'images/dino-idle.png',
    imgRun1: 'images/dino-run1.png',
    imgRun2: 'images/dino-run2.png',
    imgJump: 'images/dino-jump.png',
    imgDead: 'images/dino-dead.png',
    isJumping: false,
    jumpHeight: JUMP_HEIGHT,

    run() {
        if (frameCounter % 3 !== 0) { return; }; 
        if (this.element.getAttribute('src') === this.imgRun1) {
            this.element.setAttribute('src', this.imgRun2)
        } else {
            this.element.setAttribute('src', this.imgRun1)
        }
    },

    jump() {
        this.element.style.bottom = `${parseFloat(this.element.style.bottom) + this.jumpHeight}px`;
        this.jumpHeight = this.jumpHeight - JUMP_GRAVITY;
        if (parseInt(this.element.style.bottom) <= JUMP_STARTING_POINT) {
            this.element.style.bottom = `${JUMP_STARTING_POINT}px`;
            this.jumpHeight = JUMP_HEIGHT;
            this.isJumping = false;
        }
    },

    end() {
        this.element.setAttribute('src', this.imgDead);
    },

    reset() {
        this.element.style.bottom = `${JUMP_STARTING_POINT}px`;
        this.isJumping = false;
        this.jumpHeight = JUMP_HEIGHT;
    }
};

const score = {
    INITIAL: '00000',
    current: 0,
    display: document.getElementById('score'),
  
    increment() {
        if (frameCounter % 3 !== 0) { return; };
        ++this.current;
        this.display.textContent = this.INITIAL.substring(0, this.INITIAL.length - this.current.toString().length) + this.current;
    },
  
    reset() {
        this.current = 0;
        this.display.textContent = this.INITIAL;
    }
}

const smallCactus = document.createElement('img');
smallCactus.setAttribute('src', 'images/obstacle-small.png');

const largeCactus = document.createElement('img');
largeCactus.setAttribute('src', 'images/obstacle-large.png');

const obstacles = {
    all: [smallCactus, largeCactus],
    onScreen: [],
    speed: FOREGROUND_SPEED,
    gap: OBSTACLES_INITIAL_GAP,
    minGap: OBSTACLES_MIN_GAP,
    maxGap: OBSTACLES_MAX_GAP,
    timer: 0,

    getReady() {
        this.all.forEach(obstacle => {
            obstacle.style.left = '650px';
            obstacle.classList.add('obstacle');
        });
    },

    isItSpawningTime() {
        this.timer++;
        if (this.timer === this.gap) {
            this.timer = 0;
            this.gap = Math.floor(Math.random() * (this.maxGap - this.minGap) + this.minGap);
            return true;
        } else {
            return false;
        }
    },

    spawn() {
        const newObstacle = this.all[Math.floor(Math.random() * this.all.length)].cloneNode();
        this.onScreen.push(newObstacle);
        runnerContainer.appendChild(newObstacle);
    },
    
    move() {
        if (!this.onScreen.length) { return; };
 
        // if there are obstacles on the screen, move each one to the left
        this.onScreen.forEach(obstacle => {
            obstacle.style.left = `${parseFloat(obstacle.style.left) - this.speed}px`;
        });

        if (parseFloat(this.onScreen[0].style.left) < -50) { // if the first obstacle is past the left border of the container
            runnerContainer.removeChild(this.onScreen[0]);
            this.onScreen.shift();
        }          
    },

    detectCollision() {
        if (!this.onScreen.length) { return false; };

        if (this.onScreen[0].offsetLeft <= dino.element.offsetLeft + dino.element.offsetWidth - 2
            && this.onScreen[0].offsetLeft + this.onScreen[0].offsetWidth >= dino.element.offsetLeft) {
            if (this.onScreen[0].offsetTop <= dino.element.offsetTop + dino.element.offsetHeight) {
                // it only detects collisions between the top of the obstacle and the bottom of the character
                // since, in this version, there's no way for the obstacle to be on top of the character
                return true;}
            };

        return false;
    },

    reset() {
        this.onScreen.forEach(obstacle => {
            runnerContainer.removeChild(obstacle);
        });
        this.onScreen = [];
        this.gap = OBSTACLES_INITIAL_GAP;
        this.timer = 0;
    }
};

const sounds = {
    jump: new Audio('sounds/jump.wav'),
    end: new Audio('sounds/hurt.wav'),

    play(sound) {
        this[sound].play();
    }
};

const runnerContainer = document.getElementById('runner-container');
let gameState = 'start';
let frameCounter = 0;
let interval;

function startInterval() {
    interval = setInterval(update, 30);
}
function stopInterval() {
    clearInterval(interval);
}

window.addEventListener('keydown', control);

function control(event) {
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'ArrowUp' || event.key === 'Up') {
        switch(gameState) {
            case 'start':
                startGame();
                break;
            case 'play':
                if (!dino.isJumping) {
                    sounds.play('jump');
                    dino.isJumping = true;
                    dino.element.setAttribute('src', dino.imgJump);
                };
                break;
            case 'over':
                reStartGame();
          }
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
    dino.element.style.bottom = `${JUMP_STARTING_POINT}px`;
    obstacles.getReady();
    startInterval();
}

function display(obj) {
    obj.element.style.left = 0;
    obj.element.style.display = 'block';
}

function move(obj) {
    obj.element.style.left = `${(parseFloat(obj.element.style.left) - obj.speed) % obj.loopingPoint}px`;
}

function update() {
    frameCounter++;
    move(background);
    move(ground);
    dino.isJumping ? dino.jump() : dino.run();
    if (obstacles.isItSpawningTime()) { obstacles.spawn(); };
    obstacles.move();
    score.increment();
    if (obstacles.detectCollision()) { endGame(); };
}

function increaseDifficulty() {
    // some code
}

function resetDifficulty() {
    background.speed = BACKGROUND_SPEED;
    ground.speed = FOREGROUND_SPEED;
    obstacles.speed = FOREGROUND_SPEED;
    obstacles.maxGap = OBSTACLES_MAX_GAP;
} 

function endGame() {
    window.removeEventListener('keydown', control);
    sounds.play('end');
    gameState = 'over';
    stopInterval();
    document.getElementById('game-over').style.display = 'block';
    dino.end();
    setTimeout(function() {window.addEventListener('keydown', control);}, 1000);
}

function reStartGame() {
    gameState = 'play';
    document.getElementById('game-over').style.display = 'none';
    dino.reset();
    score.reset();
    obstacles.reset();
    resetDifficulty();
    startInterval();
}