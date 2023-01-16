let FRAME_DURATION = 100; // milliseconds

let BACKGROUND_SPEED = 1; // pixels per update
let FOREGROUND_SPEED = 6; // ground & obstacles

let OBSTACLES_INITIAL_GAP = 15;
let OBSTACLES_MIN_GAP = 10;
let OBSTACLES_MAX_GAP = 80;

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


    run() {
        if (this.element.getAttribute('src') === this.imgRun1) {
            this.element.setAttribute('src', this.imgRun2)
        } else {
            this.element.setAttribute('src', this.imgRun1)
        }
    },
    
    jump() {
        this.isJumping = true;
        this.element.className = 'jumping';
        this.element.setAttribute('src', this.imgJump);
    },

    end() {
        this.element.setAttribute('src', this.imgDead);
    }
};

dino.element.addEventListener('animationend', () => {
    dino.isJumping = false;
    dino.element.className = 'running';
});

const score = {
    INITIAL: '00000',
    current: 0,
    display: document.getElementById('score'),
  
    increment() {
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

    reset() {
        this.onScreen.forEach(obstacle => {
            runnerContainer.removeChild(obstacle);
        });
        this.onScreen = [];
        this.gap = OBSTACLES_INITIAL_GAP;
        this.timer = 0;
    }
};

const runnerContainer = document.getElementById('runner-container');
let gameState = 'start';
let playInterval;
window.addEventListener('keydown', keyPressed);

function keyPressed(event) {
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'ArrowUp' || event.key === 'Up') {
        switch(gameState) {
            case 'start': // questo succede solo alla prima partita
                startGame();
                break;
            case 'play':
                dino.jump();
                break;
            case 'over':
                reStartGame();
          }
    }
};

// window.addEventListener('blur', () => {
//     if (gameState === 'play') { clearInterval(playInterval); };
// });
// window.addEventListener('focus', () => {
//     if (gameState === 'play') { playInterval = setInterval(update, FRAME_DURATION); };
// });

function startGame() {
    gameState = 'play'; // cambio stato
    document.getElementById('game-start').style.display = 'none'; // tolgo il testo iniziale
    display(background); // faccio apparire lo sfondo
    display(ground);
    obstacles.getReady();
    playInterval = setInterval(update, FRAME_DURATION); // faccio partire il ciclo di update
}

function display(obj) {
    obj.element.style.left = 0;
    obj.element.style.display = 'block';
}

function move(obj) {
    obj.element.style.left = `${(parseFloat(obj.element.style.left) - obj.speed) % obj.loopingPoint}px`;
}

function detectCollision() { // will return true or false
    // there will be some awesome code here
    return false;
}

function update() {
   move(background);
   move(ground);
   if (!dino.isJumping) { dino.run(); };
   if (obstacles.isItSpawningTime()) { obstacles.spawn(); };
   obstacles.move();
   score.increment();
   if (detectCollision()) { endGame(); };
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
    gameState = 'over';
    clearInterval(playInterval);
    document.getElementById('game-over').style.display = 'block';
    dino.end();
}

function reStartGame() {
    gameState = 'play'; // cambio stato
    document.getElementById('game-over').style.display = 'none'; // tolgo il testo 'game over'
    score.reset(); // resetto il punteggio
    obstacles.reset();
    resetDifficulty(); // resettare difficoltà, cioè velocità e frequenza degli ostacoli
    playInterval = setInterval(update, FRAME_DURATION); // faccio RIpartire il ciclo di update
    
}