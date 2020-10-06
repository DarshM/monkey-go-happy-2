var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkey_running, monkey_collided;
var ground, invisibleGround, groundImage;
var bananaGroup, bananaImage;
var obstaclesGroup, obstacle1, obstacle2;
var jumpSound,dieSound,checkpointSound;
var score;
var gameOver,gimg;

function preload(){
  monkey_running  = loadAnimation("monkey1.png","monkey2.png");
  monkey_collided = loadAnimation("monkey_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  bananaImage = loadImage("banana.png");
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkpointSound=loadSound("checkPoint.mp3");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  gimg=loadImage("gameOver.png");
}

function setup() {
  createCanvas(600, 200);
  
 monkey= createSprite(50,180,20,50);
 monkey.addAnimation("running", monkey_running);
 monkey.addAnimation("collided", monkey_collided);
 monkey.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
     
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100);
  gameOver.addImage("gameOver",gimg);
  gameOver.scale = 0.5;

  gameOver.visible = false;

  bananaGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(7 + 3*score/100);
    //scoring
    if(bananaGroup.isTouching(monkey)){
      score=score+1;
bananaGroup.destroyEach();      
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    console.log(monkey.y);
    
     //jump when the space key is pressed
    if(keyDown("space") && monkey.y >= 150){
      monkey.velocityY = -12 ;
      jumpSound.play();
    
    }
  
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.6;
    
    //spawn the banana
    spawnBanana();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(monkey)){
      gameState = END;
      gameOver.visible = true;
      dieSound.play();
    }
  }
  
  else if(gameState === END) {
    
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    monkey.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);
    
    monkey.changeAnimation("collided",monkey_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
    
    
  }
  
  monkey.collide(invisibleGround);
  drawSprites();
}


function spawnBanana() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var banana = createSprite(600,120,40,10);
    banana.y = Math.round(random(80,120));
    banana.addImage(bananaImage);
    banana.scale = 0.5;
    banana.velocityX = -7;
    
     //assign lifetime to the variable
    banana.lifetime = 200;
    
    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    bananaGroup.add(banana);
  }
  

}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}