/* 

My explanation of extensions, what I found difficult and the skills learnt.

My first extension is sound, I found sounds online and implemented a sound for jumping, falling/dying, getting a collectable and lastly when the player makes it past the flagpole. 

My second extention was to implement the enemy which was good fun! 

I found the gravity and horizontal jumping a challenge.
Getting the lives and score to stay on screen when scrolling was also a challenge. I also found that changing the gameChar_x to gameChar_world_x caused problems with my collectables logic. As a result I struggled to create collectables in the next part of the world, I was able to eventually sort that glitch out after several hours. 

I refined my javascript knowledge and learnt the p5.js library. It was very useful implementing objects, functions and conditional statements to create a game! 

Additional notes:
- I added a video so you can watch the game in action
- linting - I used the traditional Visual Studio prettier linting formatting for my code to make it legible.

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var collectable;
var clouds;
var mountains;
var canyon;

var game_score;
var flagpole;
var lives;

var collectibleSound;
var dyingSound;
var won;
var jumpSound;

var enemies;

function setup() {
  createCanvas(1024, 576);
  floorPos_y = (height * 3) / 4;
  lives = 3;
  startGame();
}

function draw() {
  background(100, 155, 255); // fill the sky blue

  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height / 4); // draw some green ground

  push();
  translate(scrollPos, 0);

  // Draw clouds.
  drawClouds();
  // Draw mountains.
  drawMountains();
  // Draw trees.
  drawTrees();
  // Draw canyons.
  for (var i = 0; i < canyon.length; i++) {
    drawCanyon(canyon[i]);

    var d = dist(gameChar_world_x, gameChar_y, canyon[i].x_pos + 140, 432);

    if (gameChar_y < 430 || (d > 0 && d < 60) || (gameChar_y < 660 && gameChar_y > 440)) {
      isPlummeting = true;
      gameChar_y += 1;
    } else {
      isPlummeting = false;
    }
  }

  if (gameChar_y < 460 && gameChar_y > 440) {
      // Used as the dying sound as for some reason it sounds different, the previous dying sound I had was too long. 
    collectibleSound.play();
  }

  // Draw collectable items.
  for (var i = 0; i < collectable.length; i++) {
    if (collectable[i].isFound == false && !collectable[i].isFound) {
      drawCollectable(collectable[i]);
    }
  }

  for (var i = 0; i < collectable.length; i++) {
    var charColdis = dist(
      gameChar_world_x,
      gameChar_y,
      collectable[i].x_pos + 300,
      440
    );

    if (charColdis <= 20 && !collectable[i].isFound) {
      checkCollectable(collectable[i]);
    }
  }
  renderFlagpole();
  pop();
  // Draw game character.
  drawGameChar();
  // Draw score
  fill(255);
  noStroke();
  text("score " + game_score, 20, 20);
  // draw hearts
  for (var i = 0; i < lives; i++) {
    drawHearts(30 + i * 30, 50, 15);
  }
  // lives
  fill(255);
  noStroke();
  text("lives " + lives, 20, 40);
  if (gameChar_y > 650) {
    checkPlayerDie();
  }
  // Game over
  if (lives == 0) {
    fill(255, 0, 0);
    text("Game over. Press space to continue", 300, 300);      
  }
  // Level over
  if (flagpole.isReached == true) {
    text("Level complete. Press space to continue", 300, 300);
  }
  // Logic to make the game character move or the background scroll.
  if (isLeft) {
    if (gameChar_x > width * 0.2) {
      gameChar_x -= 5;
    } else {
      scrollPos += 5;
    }
  }
  if (isRight) {
    if (gameChar_x < width * 0.8) {
      gameChar_x += 5;
    } else {
      scrollPos -= 5; // negative for moving against the background
    }
  }
  // Logic to make the game character rise and fall.
  if (gameChar_y < floorPos_y) {
    gameChar_y += 2;
  } else if (gameChar_y == floorPos_y) {
    isFalling = false;
  }
  //check flagpole
  if (flagpole.isReached == false) {
    checkFlagpole();
  }
  for(var i = 0; i < enemies.length; i++){
      enemies[i].draw();
      var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y)
      if(isContact)
          {
              if(lives > 0)
                  {
                      checkPlayerDie();
                      break;
                  }
          }
  }
  // Update real position of gameChar for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;
}
// ---------------------
// Key control functions
// ---------------------
function keyPressed() {
  //Left key pressed
  if (keyCode == 37) {
    isLeft = true;
  }
  // Right key pressed
  else if (keyCode == 39) {
    isRight = true;
  } else if (
    keyCode == 32 &&
    gameChar_y == floorPos_y &&
    isPlummeting == false
  ) {
    gameChar_y -= 170; 
    jumpSound.play(); 
  }
}

function keyReleased() {
  // if statements to control the animation of the character when
  // keys are released.
  //Left key released
  if (keyCode == 37) {
    isLeft = false;
  } else if (keyCode == 39) {
    isRight = false;
  }
}
// ------------------------------
// Game character render function
// ------------------------------
// Function to draw the game character.
function drawGameChar() {
  // draw game character
  //the game character
  if (isLeft && isFalling) {
    // add your jumping-left code
    // Arms
    stroke(60);
    line(gameChar_x, gameChar_y - 51, gameChar_x + 22, gameChar_y - 55);
    // Feet
    fill(0);
    line(gameChar_x - 12, gameChar_y - 25, gameChar_x + 5, gameChar_y - 5);
    line(gameChar_x - 5, gameChar_y - 25, gameChar_x + 20, gameChar_y - 5);
    // Body
    fill(199, 21, 133);
    ellipse(gameChar_x, gameChar_y - 35, 30, 40);
    // Head
    fill(244, 164, 96);
    ellipse(gameChar_x - 6, gameChar_y - 60, 25);
    //Eyes
    fill(0);
    ellipse(gameChar_x - 14, gameChar_y - 62, 4, 2);
  } else if (isRight && isFalling) {
    // add your jumping-right code
    stroke(0);
    // Feet
    fill(0);
    line(gameChar_x + 4, gameChar_y - 25, gameChar_x - 17, gameChar_y - 5);
    line(gameChar_x + 10, gameChar_y - 25, gameChar_x - 2, gameChar_y - 5);
    // Body
    fill(199, 21, 133);
    ellipse(gameChar_x, gameChar_y - 35, 30, 40);
    // Head
    fill(244, 164, 96);
    ellipse(gameChar_x + 10, gameChar_y - 60, 25);
    // Arms
    stroke(60);
    line(gameChar_x - 9, gameChar_y - 51, gameChar_x - 22, gameChar_y - 55);
    //Eyes
    fill(0);
    ellipse(gameChar_x + 17, gameChar_y - 62, 4, 2);
  } else if (isLeft) {
    // add your walking left code
    // Arm
    stroke(60);
    line(gameChar_x - 10, gameChar_y - 41, gameChar_x + 22, gameChar_y - 25);
    // Body
    fill(199, 21, 133);
    ellipse(gameChar_x, gameChar_y - 25, 30, 40);
    // Head
    fill(244, 164, 96);
    ellipse(gameChar_x, gameChar_y - 50, 25);
    // Arms
    stroke(60);
    line(gameChar_x, gameChar_y - 35, gameChar_x - 22, gameChar_y - 20);
    //Eyes
    fill(0);
    ellipse(gameChar_x - 7, gameChar_y - 52, 4, 2);
    // Feet
    fill(0);
    rect(gameChar_x - 19, gameChar_y - 14, 33, 14);
  } else if (isRight) {
    // add your walking right code
    //Arm
    stroke(60);
    line(gameChar_x - 5, gameChar_y - 41, gameChar_x - 22, gameChar_y - 25);
    // Body
    fill(199, 21, 133);
    ellipse(gameChar_x, gameChar_y - 25, 30, 40);
    // Head
    fill(244, 164, 96);
    ellipse(gameChar_x, gameChar_y - 50, 25);
    // Arm
    stroke(60);
    line(gameChar_x - 2, gameChar_y - 35, gameChar_x + 22, gameChar_y - 25);
    //Eyes
    fill(0);
    ellipse(gameChar_x + 7, gameChar_y - 52, 4, 2);
    // Feet
    rect(gameChar_x - 14, gameChar_y - 14, 33, 14);
  } else if (isFalling || isPlummeting) {
    // add your jumping facing forwards code
    stroke(60);
    // Feet
    fill(0);
    rect(gameChar_x - 11, gameChar_y - 25, 10, 19);
    // Body
    fill(199, 21, 133);
    ellipse(gameChar_x, gameChar_y - 35, 30, 40);
    // Head
    fill(244, 164, 96);
    ellipse(gameChar_x, gameChar_y - 60, 25);
    // Arms
    stroke(60);
    line(gameChar_x - 9, gameChar_y - 51, gameChar_x - 22, gameChar_y - 55);
    line(gameChar_x + 8, gameChar_y - 51, gameChar_x + 22, gameChar_y - 55);
    //Eyes
    fill(0);
    ellipse(gameChar_x - 4, gameChar_y - 62, 4, 2);
    ellipse(gameChar_x + 4, gameChar_y - 62, 4, 2);
    //Feet
    rect(gameChar_x + 1, gameChar_y - 25, 10, 15);
  } else {
    // add your standing front facing code
    stroke(60);
    // Feet
    fill(0);
    rect(gameChar_x - 11, gameChar_y - 15, 10, 19);
    rect(gameChar_x + 1, gameChar_y - 15, 10, 19);
    // Body
    fill(199, 21, 133);
    ellipse(gameChar_x, gameChar_y - 25, 30, 40);
    // Head
    fill(255, 164, 96);
    ellipse(gameChar_x, gameChar_y - 50, 25);
    // Arms
    stroke(60);
    line(gameChar_x - 9, gameChar_y - 41, gameChar_x - 22, gameChar_y - 25);
    line(gameChar_x + 8, gameChar_y - 41, gameChar_x + 22, gameChar_y - 25);
    //Eyes
    fill(0);
    ellipse(gameChar_x - 4, gameChar_y - 52, 4, 2);
    ellipse(gameChar_x + 4, gameChar_y - 52, 4, 2);
  }
}
// ---------------------------
// Background render functions
// ---------------------------
// Function to draw cloud objects.
function drawClouds() {
  for (var i = 0; i < clouds.length; i++) {
    fill(255, 255, 255);
    ellipse(clouds[i].x_pos + 200, clouds[i].y_pos + 150, 100, 80);
    ellipse(clouds[i].x_pos + 250, clouds[i].y_pos + 140, 100, 80);
    ellipse(clouds[i].x_pos + 300, clouds[i].y_pos + 150, 100, 80);
    ellipse(clouds[i].x_pos + 225, clouds[i].y_pos + 170, 100, 80);
    ellipse(clouds[i].x_pos + 275, clouds[i].y_pos + 170, 100, 80);
  }
}
// Function to draw mountains objects.
function drawMountains() {
  // Draw mountains.
  for (var i = 0; i < mountains.length; i++) {
    //Mountain
    //reflection
    fill(0, 105, 0);
    triangle(
      mountains[i].x_pos + 450,
      mountains[i].y_pos + 429,
      mountains[i].x_pos + 800,
      mountains[i].y_pos + 430,
      mountains[i].x_pos + 500,
      950
    );
    // Table mountains[i]
    fill(184, 134, 11);
    rect(mountains[i].x_pos + 500, mountains[i].y_pos + 230, 260, 203);
    rect(mountains[i].x_pos + 650, mountains[i].y_pos + 200, 50, 50);
    // Main triangle
    fill(105, 105, 105);
    triangle(
      mountains[i].x_pos + 500,
      mountains[i].y_pos + 432,
      mountains[i].x_pos + 550,
      mountains[i].y_pos + 100,
      mountains[i].x_pos + 800,
      mountains[i].y_pos + 432
    );
    //small front mountains[i]
    fill(218, 165, 32);
    triangle(
      mountains[i].x_pos + 450,
      mountains[i].y_pos + 432,
      mountains[i].x_pos + 600,
      mountains[i].y_pos + 300,
      mountains[i].x_pos + 650,
      mountains[i].y_pos + 432
    );
    // ice-capHe
    fill(255, 255, 255);
    triangle(
      mountains[i].x_pos + 550,
      mountains[i].y_pos + 100,
      mountains[i].x_pos + 538,
      mountains[i].y_pos + 200,
      mountains[i].x_pos + 628,
      mountains[i].y_pos + 200
    );
  }
}
// Function to draw trees objects.
function drawTrees() {
  for (var i = 0; i < trees_x.length; i++) {
    //Tree
    noStroke();
    fill(120, 100, 40);
    rect(trees_x[i], floorPos_y - 148, 60, 150);
    //branches
    noStroke();
    fill(0, 155, 0);
    triangle(
      trees_x[i] - 50,
      floorPos_y - 50,
      trees_x[i] + 30,
      floorPos_y - 150,
      trees_x[i] + 110,
      floorPos_y - 50
    );
    triangle(
      trees_x[i] - 50,
      floorPos_y - 100,
      trees_x[i] + 30,
      floorPos_y - 200,
      trees_x[i] + 110,
      floorPos_y - 100
    );
  }
}
// Function draw hearts
function drawHearts(x, y, size) {
  fill(255, 0, 0);
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------
// Function to draw canyon objects.
function drawCanyon(t_canyon) {
  fill(10, 155, 255);
  triangle(
    t_canyon.x_pos + 100,
    t_canyon.width + 332,
    t_canyon.x_pos + 200,
    t_canyon.width + 332,
    t_canyon.x_pos + 200,
    t_canyon.width + 900
  );
  fill(175, 255, 255);
  triangle(
    t_canyon.x_pos + 118,
    t_canyon.width + 400,
    t_canyon.x_pos + 200,
    t_canyon.width + 400,
    t_canyon.x_pos + 200,
    t_canyon.width + 900
  );
  fill(139, 69, 19);
  triangle(
    t_canyon.x_pos + 100,
    t_canyon.width + 332,
    t_canyon.x_pos + 70,
    t_canyon.width + 390,
    t_canyon.x_pos + 240,
    t_canyon.width + 650
  );
}
// Function to check character is over a canyon.
function checkCanyon(t_canyon) {}
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
// Function to draw collectable objects.
function drawCollectable(t_collectable) {
  fill(255, 255, 0);
  ellipse(
    t_collectable.x_pos + 295,
    t_collectable.y_pos + 295,
    t_collectable.size,
    t_collectable.size - 20
  );
  fill(0);
  text("$BTC", t_collectable.x_pos + 280, t_collectable.y_pos + 300);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable) {
  t_collectable.isFound = true;
  collectibleSound.play()
  game_score += 1;
}

function renderFlagpole() {
  push();
  strokeWeight(5);
  stroke(180);
  line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
  fill(255, 0, 255);
  noStroke();
  if (flagpole.isReached) {
    rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
  } else {
    rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
  }
  pop();
}

function checkFlagpole() {
  var d = abs(gameChar_world_x - flagpole.x_pos);
  if (d < 15) {
    flagpole.isReached = true;
    won.play();
    setTimeout(() => {
      startGame();
    }, 2000)
  }
}

function checkPlayerDie() {
  if (lives > 0) {
    lives -= 1;
    startGame();
  }
  else if(lives == 0) { 
    startGame();
  } 
}

function Enemy(x,y,range){
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX +=this.inc;
        
        if(this.currentX >= this.x + this.range) {
            this.inc = -1;
        }
        else if(this.currentX < this.x){
            this.inc = 1;
        }
    }
    
    this.draw = function(){
        this.update();
        fill(255,0,0)
        ellipse(this.currentX, this.y,20,20);
        fill(255,255,255)
        ellipse(this.currentX-4, this.y,6,5)
        ellipse(this.currentX+4, this.y,6,5)
    }
    
    this.checkContact = function(gc_x, gc_y){
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        console.log(d)
        if(d < 20){
            return true;
        }
        return false;
    }
}

function createSound(filePath) {
  return new p5.SoundFile(filePath,
    () => { console.log('sound loaded') },
    () => { console.log('sound load failed') }
  )
}

function startGame() {

  collectibleSound = createSound('assets/btc.wav')
  dyingSound = createSound('assets/dying.wav')
  won = createSound('assets/won.wav')
  jumpSound = createSound('assets/jump.wav')

  gameChar_x = width / 2;
  gameChar_y = floorPos_y;
  // Variable to control the background scrolling.
  scrollPos = 0;
  // Variable to store the real position of the gameChar in the game
  // world. Needed for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;
  // Boolean variables to control the movement of the game character.
  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;
  // Initialise arrays of scenery objects.
  trees_x = [0, 500, 800, 1000, 1500, 2700];

  collectable = [
    { x_pos: -50, y_pos: 100, size: 50, isFound: false },
    { x_pos: 100, y_pos: 100, size: 50, isFound: false },
    { x_pos: 800, y_pos: 100, size: 50, isFound: false },
    { x_pos: 530, y_pos: 100, size: 50, isFound: false },
  ];
  clouds = [
    { x_pos: 0, y_pos: 0 },
    { x_pos: 600, y_pos: -10 },
    { x_pos: 300, y_pos: -40 },
    { x_pos: 900, y_pos: -40 },
    { x_pos: 1300, y_pos: -40 },
  ];
  mountains = [
    { x_pos: 300, y_pos: 0 },
    { x_pos: -250, y_pos: 0 },
    { x_pos: 750, y_pos: 0 },
  ];
  canyon = [
    { x_pos: 10, width: 100 },
    { x_pos: 600, width: 100 },
    { x_pos: 800, width: 100 },
  ];
    
  enemies = [];
  enemies.push(new Enemy(250, floorPos_y - 10, 100));

  flagpole = { isReached: false, x_pos: 1500 };
  game_score = 0;
}
