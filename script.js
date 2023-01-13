let BACKGROUND_SPEED = 1;
let FOREGROUND_SPEED = 6;


const runnerContainer = document.getElementById('runner-container');

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
  
    reset() { // to be called when a new game starts
      this.current = 0;
      this.display.textContent = this.INITIAL;
    }
}

window.addEventListener('keydown', keyPressed);
let playingTime;
let gameState = 'start';

function keyPressed(event) {
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'ArrowUp' || event.key === 'Up') {
        switch(gameState) {
            case 'start': // questo succede solo alla prima partita
              gameState = 'play'; // cambio stato
              document.getElementById('game-start').style.display = 'none'; // tolgo il testo iniziale
              display(background); // faccio apparire lo sfondo
              display(ground);
              playingTime = setInterval(update, 100); // faccio partire il ciclo di update
              break;
            case 'play':
              dino.jump();
              break;
            case 'over':
              gameState = 'play'; // cambio stato
              document.getElementById('game-over').style.display = 'none'; // tolgo il testo 'game over'
              score.reset(); // resetto il punteggio
              playingTime = setInterval(update, 100); // faccio RIpartire il ciclo di update
              // resettare difficoltà, cioè velocità e frequenza degli ostacoli
          }
    }
};

window.addEventListener('blur', () => {
    clearInterval(playingTime);
});
window.addEventListener('focus', () => {
    playingTime = setInterval(update, 100);
});


function update() {
   move(background);
   move(ground);
   if (!dino.isJumping) { dino.run(); };
   obstacles.spawn();
   obstacles.move();
   score.increment();
   if (detectCollision()) { endGame(); };
}

function display(obj) {
    obj.element.style.left = 0;
    obj.element.style.display = 'block';
}

function move(obj) {
    obj.element.style.left = `${(parseFloat(obj.element.style.left) - obj.speed) % obj.loopingPoint}px`;
}





////////// obstacles

const smallCactus = document.createElement('img');
smallCactus.setAttribute('src', 'images/obstacle-small.png');
smallCactus.classList.add('obstacle', 'small-cactus');
smallCactus.style.left = '650px'; // si potrebbe settare per tutti gli ostacoli al load della pagina

const largeCactus = document.createElement('img');
largeCactus.setAttribute('src', 'images/obstacle-large.png');
largeCactus.classList.add('obstacle', 'large-cactus');
largeCactus.style.left = '650px'; // si potrebbe settare per tutti gli ostacoli al load della pagina

const obstacles = {
    all: [smallCactus, largeCactus],
    onScreen: [],
    initialFrequency: 80,
    frequency: 80, // will be increased to increase difficulty (?)
    speed: 6,

    spawn() {
        if (Math.random() * this.frequency >= this.initialFrequency - 1) {
            const newObstacle = this.all[Math.floor(Math.random() * this.all.length)].cloneNode();
            this.onScreen.push(newObstacle);
            runnerContainer.appendChild(newObstacle);
        }
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
    }
};

function detectCollision() { // will return true or false
    // there will be some awesome code here
    return false;
}

function endGame() {
    gameState = 'over';
    clearInterval(playingTime);
    document.getElementById('game-over').style.display = 'block';
    dino.end();
}