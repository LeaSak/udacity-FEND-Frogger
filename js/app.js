/* Create a namespace called app*/
var app = app || {};

(function() {
    "use strict";
    /* The game object stores all game related
     * attributes and methods
     */
    var game = {
        play: false,
        CANVAS_WIDTH: 500,
        CANVAS_HEIGHT: 600,
        CANVAS_OFFSET: 50,
        ROW_HEIGHT: 84,
        BOUNDARY_LEFT: 0,
        BOUNDARY_RIGHT: 435,
        BOUNDARY_BOTTOM: 500,
        IN_WATER: 40,
        TOTAL_LEVELS: 4,
        MAX_SCORE: 120,
        MAX_LIVES: 3,
        /* Go up a level every 30 points till max-level
         * Increase game difficulty by adding enemies
         * Decrease speed of all enemies with each level
         */
        advanceGame: function() {
            if (player.score % 30 === 0 &&
                player.level < game.TOTAL_LEVELS &&
                player.lives >= 1) {
                player.level += 1;
                switch (player.level) {
                    case 2:
                        allEnemies.forEach(function(enemy) {
                            enemy.speed -= 20;
                        });
                        allEnemies.push(enemy4, enemy12);
                        break;
                    case 3:
                        allEnemies.forEach(function(enemy) {
                            enemy.speed -= 20;
                        });
                        allEnemies.push(enemy3, enemy7, enemy10);
                        break;
                    case 4:
                        allEnemies.forEach(function(enemy) {
                            enemy.speed -= 20;
                        });
                        allEnemies.push(enemy2, enemy5, enemy8);
                        break;
                }
            }
        },
        /* Reset game
         * Restore enemy numbers and speed
         * Put player back to start position
         * Restore number of hearts
         */
        gameReset: function() {
            allEnemies.splice(4);
            player.reset();
            allEnemies.forEach(function(enemy) {
                enemy.reset();
            });
            allHearts.push(heart1, heart2, heart3);
        },
        /* This function updates the player's score
         * Tracks lives and level
         */
        displayGameResults: function() {
            var livesBox = document.getElementById('lives');
            var scoreBox = document.getElementById('score');
            var levelBox = document.getElementById('level');

            livesBox.innerHTML = '';
            livesBox.innerHTML = '<p>Lives: ' + player.lives + ' / ' + game.MAX_LIVES + '</p>';
            scoreBox.innerHTML = '';
            scoreBox.innerHTML = '<p>Score: ' + player.score + '</p>';
            levelBox.innerHTML = '';
            levelBox.innerHTML = '<p>Level: ' + player.level + ' / ' + game.TOTAL_LEVELS + '</p>';
        },
        /* This function shows the welcome message
         * Allows player to start game
         */
        welcomeScreen: function(keyCode) {
            if (game.play !== true &&
                player.lose !== true &&
                player.win !== true) {
                document.getElementById('welcome').style.display = 'flex';
            }

            if (keyCode === 'enter') {
                game.play = true; // start game
                document.getElementById('welcome').style.display = 'none';
            }
        },
        /* This function shows the game over message
         * Allows player to restart game
         */
        gameOverScreen: function(keyCode) {
            var messageBox = document.getElementById('message');
            if (player.lose) {
                game.play = false; //stop game
                messageBox.style.display = 'block';
                messageBox.innerHTML = '';
                messageBox.innerHTML = '<p>Goodbye for now. <br> Press the spacebar to play again.</p>';
            }

            if (keyCode === 'space') {
                game.play = true; // start game
                document.getElementById('message').style.display = 'none';
                game.gameReset();
            }
        },
        /* This function shows the won game message
         * Allows player to restart game
         */
        wonGameMessage: function(keyCode) {
            var messageBox = document.getElementById('message');
            if (player.win) {
                game.play = false; //stop game
                messageBox.style.display = 'block';
                messageBox.innerHTML = '';
                messageBox.innerHTML = '<p>You won! <br> Press the spacebar to play again.</p>';
            }

            if (keyCode === 'space') {
                game.play = true; //stop game
                document.getElementById('message').style.display = 'none';
                game.gameReset();
            }
        }
    };


    /**
     * @description Represents a drawable game object
     * @constructor
     * @param {number} x - x position of object
     * @param {number} y - y position of object
     * @param {string} sprite - image url of object
     * @param {number} height - object height
     * @param {number} width - object width
     */
    var Drawable = function(x, y, sprite, height, width) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = width;
        this.height = height;

    };

    // This renders the object to the canvas
    Drawable.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);

    };

    /* Enemy global variables
     * Used as arguments in object instances
     */
    var ENEMY_X = [-205, -155, -105, -55, -5, 505, 555, 605, 655, 705];
    var ENEMY_Y = [139, 183, 223, 267, 307, 351];
    var enemySpriteArray = ['images/enemy-bugNTL.png', 'images/enemy-bugNTR.png'];

    /**
     * @description Enemy subclass
     * @constructor
     * @param {number} x - x position of object
     * @param {number} y - y position of object
     * @param {number} speed - speed of object
     * @param {string} sprite - object image url
     */
    var Enemy = function(x, y, speed, sprite) {
        Drawable.call(this, x, y, sprite);
        this.startX = x;
        this.startY = y;
        this.speed = speed;
        this.initialSpeed = speed;
        this.sprite = sprite;
        this.width = 45;
        this.height = 33;
    };

    Enemy.prototype = Object.create(Drawable.prototype);
    Enemy.prototype.constructor = Enemy;

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    Enemy.prototype.update = function(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        //move bugs from left
        if (this.sprite === enemySpriteArray[0]) {
            this.x > game.BOUNDARY_RIGHT ? this.x = 0 : this.x += this.speed * dt;
        }

        // Move bugs from right
        if (this.sprite === enemySpriteArray[1]) {
            this.x < game.BOUNDARY_LEFT ? this.x = game.CANVAS_WIDTH : this.x -= this.speed * dt;
        }

        // Makes bugs jitter vertically
        this.y = this.startY + randomize(-0.6, 0.6);
        this.checkCollision();
    };

    /* Collision between enemy and player
     * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
     */
    Enemy.prototype.checkCollision = function() {
        if (player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            player.lives -= 1;
            allHearts.pop();
            player.goHome();
            player.lostGame();

        }

    };

    /* Put enemy back to initial x and y values
     * Restore initial enemy speed
     */
    Enemy.prototype.reset = function() {
        this.x = this.startX;
        this.y = this.startY;
        this.speed = this.initialSpeed;

    };

    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.


    /* Set player starting positions as global variable
     * values are needed as arguments in instantiation
     * of player object
     */
    var PLAYER_STARTX = game.CANVAS_WIDTH / 2 - 35; //canvas width - playerwidth /2 = x value
    var PLAYER_STARTY = 470;

    /**
     * @description Player subclass
     * @constructor
     * @param {number} x - x position of object
     * @param {number} y - y position of object
     */
    var Player = function(x, y) {
        Drawable.call(this, x, y);
        this.sprite = 'images/char-boyNT.png';
        this.height = 81;
        this.width = 70;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.lose = false;
        this.win = false;
    };

    Player.prototype = Object.create(Drawable.prototype);
    Player.prototype.constructor = Player;

    /* Calls checkBoundaries method
     * Invokes getScore method to keep track
     * of score
     */
    Player.prototype.update = function(dt) {
        this.getScore();
        this.checkBoundaries();
    };

    // Sets step distance of player
    Player.prototype.handleInput = function(keyCode) {
        switch (keyCode) {
            case 'left':
                this.x -= 50;
                break;
            case 'right':
                this.x += 50;
                break;
            case 'down':
                this.y += 42;
                break;
            case 'up':
                this.y -= 42;
                break;
        }
    };

    // Sets boundaries for player
    Player.prototype.checkBoundaries = function() {
        // Collision with boundaries
        //check for x boundaries of canvas
        //stop player from running off canvas
        if (this.x <= game.BOUNDARY_LEFT) {
            this.x = 0;
        }

        if (this.x >= game.BOUNDARY_RIGHT) {
            this.x = 435;
        }

        //check for y boundaries of canvas
        //stop player from running off canvas
        if (this.y >= game.BOUNDARY_BOTTOM) {
            this.y = 500;
        }
        //if player reaches the water,
        //push player back to PLAYER_STARTX, PLAYER_STARTY position
        if (this.y <= game.IN_WATER) {
            this.goHome();
        }
    };

    /* Tracks points
     * Decides to go up a level or not
     * Calls won method
     */
    Player.prototype.getScore = function() {
        //if player reaches the water,
        //add 10 points
        if (this.y <= game.IN_WATER &&
            this.level <= game.TOTAL_LEVELS) {
            this.score += 10;
            game.advanceGame();
        }
        this.won();
    };

    // Sets conditions for winning game
    Player.prototype.won = function() {
        if (this.level === game.TOTAL_LEVELS &&
            this.score === game.MAX_SCORE &&
            this.lives >= 1) {
            this.win = true;
        }
    };

    // Sets conditions for losing game
    Player.prototype.lostGame = function() {
        if (this.lives < 1) {
            game.play = false;
            this.lose = true;
        }
    };

    /* Sets player back to starting position
     * Cleans score board
     * Resets booleans
     */
    Player.prototype.reset = function() {
        this.goHome();
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.lose = false;
        this.win = false;
    };

    // Sets player back to starting position
    Player.prototype.goHome = function() {
        this.x = PLAYER_STARTX;
        this.y = PLAYER_STARTY;
    };


    /**
     * @description Heart subclass representing player lives
     * @constructor
     * @param {number} x - x position of object
     * @param {number} y - y position of object
     */
    var Heart = function(x, y) {
        Drawable.call(this, x, y);
        this.sprite = 'images/HeartNT.png';
        this.width = 38;
        this.height = 34;
    };

    Heart.prototype = Object.create(Drawable.prototype);
    Heart.prototype.constructor = Heart;

    // Instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player

    //level 4 speed range: 40 - 60
    //level 3 speed range: 60 - 80
    //level 2 speed range: 80 - 100
    //level 1 speed range: 100 - 120
    ////row 1: slow, LTR
    var enemy1 = new Enemy(ENEMY_X[4], ENEMY_Y[0], 100, enemySpriteArray[0]);
    var enemy2 = new Enemy(ENEMY_X[2], ENEMY_Y[0], 40, enemySpriteArray[0]);
    var enemy3 = new Enemy(ENEMY_X[1], ENEMY_Y[0], 60, enemySpriteArray[0]);
    ////row 2: medium, RTL
    var enemy4 = new Enemy(ENEMY_X[6], ENEMY_Y[1], 90, enemySpriteArray[1]);
    var enemy5 = new Enemy(ENEMY_X[8], ENEMY_Y[1], 50, enemySpriteArray[1]);
    ////row 3: fast, RTL
    var enemy6 = new Enemy(ENEMY_X[5], ENEMY_Y[2], 120, enemySpriteArray[1]);
    var enemy7 = new Enemy(ENEMY_X[6], ENEMY_Y[2], 80, enemySpriteArray[1]);
    var enemy8 = new Enemy(ENEMY_X[9], ENEMY_Y[2], 60, enemySpriteArray[1]);
    ////row 4: medium, LTR
    var enemy9 = new Enemy(ENEMY_X[4], ENEMY_Y[3], 110, enemySpriteArray[0]);
    ////row 5: slow, RTL
    var enemy10 = new Enemy(ENEMY_X[5], ENEMY_Y[4], 60, enemySpriteArray[1]);
    var enemy11 = new Enemy(ENEMY_X[7], ENEMY_Y[4], 100, enemySpriteArray[1]);
    // ////row 6: medium, LTR
    var enemy12 = new Enemy(ENEMY_X[1], ENEMY_Y[5], 90, enemySpriteArray[0]);

    var heart1 = new Heart(10, 550);
    var heart2 = new Heart(58, 550);
    var heart3 = new Heart(108, 550);
    var allHearts = [heart1, heart2, heart3];
    var player = new Player(PLAYER_STARTX, PLAYER_STARTY);

    //Level 1
    var allEnemies = [enemy1, enemy6, enemy9, enemy11];

    /*Generic functions*/

    /* Returns a random number between min and max.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     */
    function randomize(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /* This listens for key presses and sends the keys to your
     * Player.handleInput() method. You don't need to modify this.
     * Change from keyup to keydown.
     */
    document.addEventListener('keydown', function(e) {
        var allowedKeys = {
            32: 'space',
            13: 'enter',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        player.handleInput(allowedKeys[e.keyCode]);
        game.welcomeScreen(allowedKeys[e.keyCode]);
        game.gameOverScreen(allowedKeys[e.keyCode]);
        game.wonGameMessage(allowedKeys[e.keyCode]);
    });

    /* Assign game, player, allEnemies and allHearts to the global variable (the window
     * to use it more easily from within engine.js files.
     */
    app.game = game;
    app.player = player;
    app.allEnemies = allEnemies;
    app.allHearts = allHearts;
})();
