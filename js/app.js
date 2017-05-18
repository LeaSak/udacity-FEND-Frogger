var game = {
    canvasWidth: 505,
    canvasOffset: 50,
    rowHeight: 83,
    leftBoundary: 0,
    rightBoundary: 435,
    bottomBoundary: 500,
    inWater: 40,
    endGame: function() {
        alert("Game Over! Click OK to restart the game.");
        player.reset();
        allEnemies.forEach(function(enemy) {
            enemy.reset();
        });
    },
    win: function() {
        alert("Hooray! You've won the game. Click OK to restart the game.");
        player.reset();
        allEnemies.forEach(function(enemy) {
            enemy.reset();
        });
    },
    displayGameResults: function() {
        var livesBox = document.getElementById('lives');
        var scoreBox = document.getElementById('score');
        var levelBox = document.getElementById('level');

        livesBox.innerHTML = '';
        livesBox.innerHTML = '<p>Lives: ' + player.lives + '</p>';
        scoreBox.innerHTML = '';
        scoreBox.innerHTML = '<p>Score: ' + player.score + '</p>';
        levelBox.innerHTML = '';
        levelBox.innerHTML = '<p>Level: ' + player.level + '</p>';
    }
}


//create Drawable superclass
var Drawable = function(x, y, sprite, height, width) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.width = width; //remove when drawBox function is removed
    this.height = height; //remove when drawBox function is removed

}

Drawable.prototype.render = function() {
    drawBox(this.x, this.y, this.width, this.height, "red");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
}

// Enemies our player must avoid
//
var enemyX = [-50, -150, -250, -350, -450];
var row2 = getRowValues(2); //y co-ordinates per row
var row3 = getRowValues(3); //y co-ordinates per row
var row4 = getRowValues(4); //y co-ordinates per row
var row5 = getRowValues(5); //y co-ordinates per row

var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    Drawable.call(this, x, y);
    this.startX = [-50, -150, -250, -350, -450];
    this.speed = speed;
    this.width = 47;
    this.height = 34;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bugNT.png';
}

Enemy.prototype = Object.create(Drawable.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > game.rightBoundary) {
        this.x = -50;
    } else {
        this.x = this.x + (this.speed * dt);
    }
    this.checkCollision();
};

Enemy.prototype.checkCollision = function() {
    //Collision with player
    if (player.x < this.x + this.width &&
        player.x + player.width > this.x &&
        player.y < this.y + this.height &&
        player.y + player.height > this.y) {
        console.log("Collision!");
        player.lives -= 1;
        player.x = playerStartX;
        player.y = playerStartY;

        //player life
        if (player.lives === 0) {
            game.endGame();
        }
    }

}

Enemy.prototype.goFaster = function() {
    if (player.level === 2) {
        this.speed += 20;
    }
    if (player.level === 3) {
        this.speed += 30;
    }
    if (player.level === 4) {
        this.speed += 40;
    }

}

Enemy.prototype.reset = function() {
    //this.x = initial x argument;
    enemy1.x = this.startX[0];
    enemy2.x = this.startX[1];
    enemy3.x = this.startX[2];
    console.log(enemy1.x, enemy2.x, enemy3.x);
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//set player starting position as global variable
//values are needed as arguments in instantiation of player object
var playerStartX = game.canvasWidth / 2 - 35; //canvas width - playerwidth /2 = x value
var playerStartY = 470;

var Player = function(x, y) {
    Drawable.call(this, x, y);
    this.sprite = 'images/char-boyNT.png';
    this.height = 81;
    this.width = 70;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
}

Player.prototype = Object.create(Drawable.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
    this.getScore();
    this.checkBoundaries();
}

Player.prototype.handleInput = function(keyCode) {
    switch (keyCode) {
        case 'left':
            this.x -= 30;
            //console.log(this.x);
            break;
        case 'right':
            this.x += 30;
            //console.log(this.x);
            break;
        case 'down':
            this.y += 30;
            //console.log(this.y);
            break;
        case 'up':
            this.y -= 30;
            //console.log(this.y);
            break;
    }
}

Player.prototype.checkBoundaries = function() {
    // Collision with boundaries
    //check for x boundaries of canvas
    //stop player from running off canvas
    if (this.x <= game.leftBoundary) {
        this.x = 0;
    }

    if (this.x >= game.rightBoundary) {
        this.x = 435;
    }

    //check for y boundaries of canvas
    //stop player from running off canvas
    if (this.y >= game.bottomBoundary) {
        this.y = 500;
    }
    //if player reaches the water,
    // push player back to playerStartX, playerStartY position
    if (this.y <= game.inWater) {
        this.x = playerStartX;
        this.y = playerStartY;
    }
}

Player.prototype.getScore = function() {
    //if player reaches the water,
    //add 10 points
    if (this.y <= game.inWater) {
        this.score += 10;


        if (this.score % 30 === 0) {
            this.level += 1;
            //update enemy speed
            allEnemies.forEach(function(enemy) {
                enemy.goFaster();
            });
        }

        if (player.level === 5) {
            game.win();
        }

    }
}

Player.prototype.reset = function() {
    this.x = playerStartX;
    this.y = playerStartY;
    this.score = 0;
    this.level = 1;
    this.lives = 3;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemy1 = new Enemy(enemyX[0], randomize(row2[0], row2[1]), 40);
var enemy2 = new Enemy(enemyX[1], randomize(row2[0], row2[1]), 40);
var enemy3 = new Enemy(enemyX[2], randomize(row3[0], row3[1]), 60);
var allEnemies = [enemy1, enemy2, enemy3];
var player = new Player(playerStartX, playerStartY);




/*Generic functions*/
//draw a box around the objects
//From Karol in Udacity Forum
function drawBox(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}

//returns a random integer between min and max, inclusive.
function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//use this function to calculate y values per row for enemy movement
function getRowValues(row) {
    var values = [];
    var objectHeight = 34;
    var min = game.canvasOffset + (row - 1) * game.rowHeight;
    var max = game.canvasOffset + row * game.rowHeight - objectHeight;
    values.push(min, max);
    return values;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
//change from keyup to keydown so that when user holds key down its smoother.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
