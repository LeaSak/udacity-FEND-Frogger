var game = {
    canvasWidth: 505,
    canvasOffset: 50,
    //rowHeight: 83,
    rowHeight: 83,
    leftBoundary: 0,
    rightBoundary: 435,
    bottomBoundary: 500,
    inWater: 40,
    totalLevels: 4,
    maxScore: 120,
    advanceGame: function() {
        if (player.score % 30 === 0 &&
            player.level < game.totalLevels) {
            player.level += 1;
            switch (player.level) {
                case 2:
                    allEnemies.forEach(function(enemy) {
                        enemy.speed -= 20;
                    })
                    allEnemies.push(enemy3, enemy8);
                    break;
                case 3:
                    allEnemies.forEach(function(enemy) {
                        enemy.speed -= 20;
                    })
                    allEnemies.push(enemy2, enemy4);
                    break;
                case 4:
                    allEnemies.forEach(function(enemy) {
                        enemy.speed -= 20;
                    })
                    allEnemies.push(enemy5, enemy7, enemy10);
                    break;
            }
        }
    },
    gameReset: function() {
        allEnemies.splice(3);
        player.reset();
        allEnemies.forEach(function(enemy) {
            enemy.reset();
        });
    },
    endGame: function() {
        alert("Game Over! Click OK to restart the game.");
        game.gameReset();
    },
    displayGameResults: function() {
        var livesBox = document.getElementById('lives');
        var scoreBox = document.getElementById('score');
        var levelBox = document.getElementById('level');

        livesBox.innerHTML = '';
        livesBox.innerHTML = '<p>Lives: ' + player.lives + ' / ' + '3' + '</p>';
        scoreBox.innerHTML = '';
        scoreBox.innerHTML = '<p>Score: ' + player.score + '</p>';
        levelBox.innerHTML = '';
        levelBox.innerHTML = '<p>Level: ' + player.level + '/ ' + '4' + '</p>';
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
var enemyX = [-50, -150, -250, -350, -450, 555, 655, 755, 855, 955];
var enemyY = [138, 177, 221, 260, 304, 343, 387, 426];
var spriteArray = ['images/enemy-bugNTL.png', 'images/enemy-bugNTR.png'];

// var row2 = getRowValues(2); //y co-ordinates per row
// var row3 = getRowValues(3); //y co-ordinates per row
// var row4 = getRowValues(4); //y co-ordinates per row
// var row5 = getRowValues(5); //y co-ordinates per row

var Enemy = function(x, y, speed, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    Drawable.call(this, x, y, sprite);
    this.startX = x;
    this.startY = y;
    this.speed = speed;
    this.initialSpeed = speed;
    this.width = 47;
    this.height = 34;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // this.sprite = 'images/enemy-bugNTL.png';
}

Enemy.prototype = Object.create(Drawable.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //Bugs from right
    if (this.sprite === spriteArray[1]) {
        if (this.x < game.leftBoundary) {
            this.x = game.canvasWidth;
        } else {
            this.x = this.x - this.speed * dt;
        }
    }

    //Bugs from left
    if (this.sprite === spriteArray[0]) {
        if (this.x > game.rightBoundary) {
            this.x = 0;
        } else {
            this.x += this.speed * dt;
        }
    }

    //makes bugs jitter vertically
    this.y = this.startY + randomize(-0.5, 0.5);
    this.checkCollision();
};

Enemy.prototype.checkCollision = function() {
    //Collision with player
    if (player.x < this.x + this.width &&
        player.x + player.width > this.x &&
        player.y < this.y + this.height &&
        player.y + player.height > this.y) {
        player.death = true;
        console.log("Collision!");
        player.lives -= 1;
        player.goHome();

        //player life
        if (player.lives === 0) {
            player.gameOver = true;
            game.endGame();
        }
    }

    //check for collision with other enemies
    //only needed if speed varies between enemies with same y value.
    for (var i = 0; i < allEnemies.length; i++) {
        var other = allEnemies[i];
        var that = this;
        if (other != this &&
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        ) {
            //finds slower friend
            // store collision speed of faster enemy
            var tmpSpeed = this.speed;
            // swap speeds
            this.speed = other.speed;
            other.speed = tmpSpeed;
            //push slower enemy forward, faster enemy back
            if (this.sprite === spriteArray[1]) {
                this.x = this.x + 15;
                other.x = other.x - 15;
            } else {
                this.x = this.x - 15;
                other.x = other.x + 15;
            }
        }
    }

}

Enemy.prototype.reset = function() {
    //this.x = initial x argument;
    this.x = this.startX;
    //restore speed
    this.speed = this.initialSpeed;
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
    this.gameOver = false;
    this.gameWon = false;
    this.success = false;
    this.death = false;
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
        this.goHome();
    }
}

Player.prototype.getScore = function() {
    //if player reaches the water,
    //add 10 points
    if (this.y <= game.inWater &&
        this.level <= game.totalLevels) {
        this.success = true;
        this.score += 10;
        game.advanceGame();
    }
    this.won();
}

Player.prototype.won = function() {
    if (this.level === game.totalLevels &&
        this.score === game.maxScore) {
        this.gameWon = true;
        alert("Hooray! You've won the game. Click OK to restart the game.");
        game.gameReset();
    }
}

Player.prototype.reset = function() {
    this.goHome();
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.gameOver = false;
    this.gameWon = false;
    this.success = false;
    this.death = false;
}

Player.prototype.goHome = function(){
    this.x = playerStartX;
    this.y = playerStartY;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//level 4 speed range: 40 - 60
//level 3 speed range: 60 - 80
//level 2 speed range: 80 - 100
//level 1 speed range: 100 - 120

////row 1: slow
var enemy1 = new Enemy(enemyX[0], enemyY[0], 100, spriteArray[0]);
var enemy2 = new Enemy(enemyX[2], enemyY[0], 60, spriteArray[0]);
////row 2: medium
var enemy3 = new Enemy(enemyX[5], enemyY[1], 90, spriteArray[1]);
////row 3: fast
var enemy4 = new Enemy(enemyX[6], enemyY[2], 80, spriteArray[1]);
var enemy5 = new Enemy(enemyX[8], enemyY[2], 60, spriteArray[1]);
////row 4: medium
var enemy6 = new Enemy(enemyX[1], enemyY[3], 110, spriteArray[0]);
var enemy7 = new Enemy(enemyX[3], enemyY[3], 50, spriteArray[0]);
////row 5: slow
var enemy8 = new Enemy(enemyX[7], enemyY[4], 80, spriteArray[1]);
////row 6: medium
var enemy9 = new Enemy(enemyX[2], enemyY[5], 110, spriteArray[0]);
var enemy10 = new Enemy(enemyX[4], enemyY[5], 50, spriteArray[0]);

//level 1
var allEnemies = [enemy1, enemy6, enemy9];
//level 2
// var allEnemies = [enemy1, enemy6, enemy9, enemy3, enemy8];
// //level 3
// var allEnemies = [enemy1, enemy6, enemy9, enemy3, enemy8, enemy2, enemy4];
// //level 4
// var allEnemies = [enemy1, enemy6, enemy9, enemy3, enemy8, enemy2, enemy4, enemy5, enemy7, enemy10];

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

// function randomArray(myArray){
//     return myArray[Math.floor(Math.random() * myArray.length)];
// }

//use this function to calculate y values per row for enemy movement
// function getRowValues(row) {
//     var values = [];
//     var objectHeight = 34;
//     var min = game.canvasOffset + (row - 1) * game.rowHeight;
//     var max = game.canvasOffset + row * game.rowHeight - objectHeight;
//     values.push(min, max);
//     return values;
// }

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
