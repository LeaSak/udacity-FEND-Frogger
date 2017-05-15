var canvasWidth = 505;
var columnWidth = canvasWidth / 5;
var canvasHeight = 606;
var leftBoundary = 0;
var rightBoundary = 435;
var bottomBoundary = 500;
var inWater = 40;
var grassShadowHeight = 39;
var startX = canvasWidth / 2 - 35; //canvas width - playerwidth /2 = x value
var startY = 470;

//create Drawable superclass
var Drawable = function(x, y, sprite, height, width){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.width = width;
    this.height = height;

}

Drawable.prototype.render = function(){
    drawBox(this.x, this.y, this.width, this.height, "red");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Enemies our player must avoid
var Enemy = function(x,y){
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    Drawable.call(this, x, y);
    this.width = 101;
    this.height = 79;
    this.speed = randomize(30, 50);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bugNT.png';
}

Enemy.prototype = Object.create(Drawable.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Handle collision
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < rightBoundary) {
        this.x = this.x + (this.speed * dt);
    } else {
        this.x = 0;
    }
    this.checkCollision();
};

//check if bugs collide with player
Enemy.prototype.checkCollision = function() {
    if (player.x < this.x + this.width &&
        player.x + player.width > this.x &&
        player.y < this.y + this.height &&
        player.y + player.height > this.y) {
        console.log("Collision!");
        player.reset();
        player.lives -= 1;
        console.log(player.lives);
        //player life
        if (player.lives === 0) {
            alert("Game Over");
            player.lives = 10;
        }
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    Drawable.call(this, x, y);
    this.sprite = 'images/char-boyNT.png';
    this.height = 85;
    this.width = 70;
    this.score = 0;
    this.lives = 10;
}

Player.prototype = Object.create(Drawable.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
    //check for y boundaries of canvas
    //stop player from running off canvas
    if (this.y <= inWater) {
        this.reset();
        this.score += 10;
    }
}

Player.prototype.drawScore = function(){
    drawScore();
    drawLives();
}

Player.prototype.handleInput = function(keyCode) {
    switch (keyCode) {
        case 'left':
            this.x -= 40;
            console.log(this.x);
            break;
        case 'right':
            this.x += 40;
            console.log(this.x);
            break;
        case 'down':
            this.y += 30;
            console.log(this.y);
            break;
        case 'up':
            this.y -= 30;
            console.log(this.y);
            break;
    }

    //check for x boundaries of canvas
    //stop player from running off canvas
    if (this.x <= leftBoundary) {
        this.x = 0;
    }

    if (this.x >= rightBoundary) {
        this.x = 435;
    }

    //check for y boundaries of canvas
    //stop player from running off canvas
    if (this.y >= bottomBoundary) {
        this.y = 500;
    }

    if (this.y <= 40){
        this.y = 40;
    }
}

Player.prototype.reset = function() {
    this.x = startX;
    this.y = startY;
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy(-50, 140);
var enemy2 = new Enemy(0, 210);
var allEnemies = [enemy1, enemy2];
var player = new Player(startX, startY);

/*Generic functions*/
//draw a box around the objects
function drawBox(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawScore() {
    ctx.font = "16px Courier";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + player.score, 10, 20);
}

function drawLives() {
    ctx.font = "16px Courier";
    ctx.fillStyle = "#000";
    ctx.fillText("Lives: " + player.lives, 10, 40);
}

//returns a random integer between min and max, inclusive.
function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
