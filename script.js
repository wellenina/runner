const runnerContainer = document.getElementById('runner-container');

const background = {
    element: document.getElementById('background'),
    speed: 1,
    loopingPoint: 600
}

const ground = {
    element: document.getElementById('ground'),
    speed: 6,
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


let playingInterval;
// when starting the game:
playing = setInterval(update, 100);

// game over:
// clearInterval(playing);

function update() {
   move(background);
   move(ground);
   if (!dino.isJumping) { run(); };
   obstacles.spawn();
   obstacles.move();
    score.increment();
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

window.addEventListener('keydown', jump);

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