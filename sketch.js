const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;
var rope3;

var bg_img;
var food;
var rabbit;

var btn,btn2,btn3;
var bunny;
var blink,eat,sad;
var mute_btn;

var fr;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;
var canW;
var canH;
var isphone;

var up;
var upimg;
var stand;
var newfruit;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
  upimg=loadImage('up.png');

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false;
}

function setup() 
{

  canW=windowWidth;
  canH=windowHeight;
  createCanvas(windowWidth, windowHeight);
  
  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //btn 1
  btn = createImg('cut_btn.png');
  btn.position(330,450);
  btn.size(50,50);
  btn.mouseClicked(drop2);

  //btn 2
  btn2 = createImg('cut_btn.png');
  btn2.position(35,485);
  btn2.size(50,50);
  btn2.mouseClicked(drop);
  
  rope = new Rope(4,{x:50,y:500});
  rope2 = new Rope(4,{x:370,y:450});

  ground = new Ground(200, canH, 600, 20);
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(450,90,100,100);
  bunny.scale = 0.2;
  bunny.velocityX=-4;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  var options = {
    density: 0.0001
  }
  fruit = Bodies.circle(216.19308092633662, 553.0453841708749,20, options);
  Matter.Composite.add(rope.body,fruit);
  Matter.Composite.add(rope2.body, fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);

  mutebtn=createImg('mute.png');
  mutebtn.position(canW-100, canH-100);
  mutebtn.size(50, 50);
  mutebtn.mouseClicked(stopmusic);

  startbtn=createImg('start.png');
  startbtn.position(canW-100, canH-160);
  startbtn.size(50, 50);
  startbtn.mouseClicked(startmusic);

  up=createSprite(425, 600, 40, 40);
  up.addImage(upimg);

  newfruit=createSprite(425, 600, 40, 40);
  newfruit.addImage(food);
  newfruit.visible=false;

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(51);
  image(bg_img, 0, 0, displayWidth+80, displayHeight);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  rope2.show();

  //console.log(fruit.position.x, fruit.position.y);

  Engine.update(engine);
  ground.show();

  drawSprites();

  if (bunny.x<44) {
    bunny.velocityX=4;
  }
  if (bunny.x>canW-444) {
    bunny.velocityX=-4;
  }

  if (collide(fruit, up)==true) {
    up.destroy();
    Matter.World.remove(world, fruit);
    fruit=null;
    newfruit.visible=true;
    newfruit.velocityY=-4;
    drop2();
  }

  if (bunny.isTouching(newfruit)) {
    bunny.velocityX=0;
    bunny.changeAnimation('eating');
    eating_sound.play();

    restart=createImg('reload.png');
    restart.position(200, 200);
    restart.size(50, 50);
    restart.mouseClicked(reload);

    newfruit.destroy();
  }

  if(newfruit!=null && newfruit.position.y<=-33)
  {
    newfruit.velocityY=0;
    newfruit.y=-32;
    bunny.velocityX=0;
    bunny.changeAnimation('crying');
    bk_song.stop();

    if (!sad_sound.isPlaying()) {
      sad_sound.play();
    }

    sad_sound.play();

    restart=createImg('reload.png');
    restart.position(200, 200);
    restart.size(50, 50);
    restart.mouseClicked(reload);
   }
   
}

function drop()
{
  cut_sound.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  btn2.remove();
}

function drop2(){
  if (fruit_con_2!=null) {
    cut_sound.play();
    rope2.break();
    fruit_con_2.detach();
    fruit_con_2=null;
    btn.remove();
  }
}

function collide(object1, object2) {
  if (object1!=null) {
    var d=dist(object1.position.x, object1.position.y, object2.position.x, object2.position.y);
    if (d<=40) {
      drop2();
      return true;
    }
    else {
      return false;
    }
  }
}


function mute()
{
  if(bk_song.isPlaying())
     {
      bk_song.stop();
     }
     else{
      bk_song.play();
     }
}


function stopmusic() {
  if (bk_song.isPlaying())
  bk_song.pause();
}

function startmusic() {
  if (!bk_song.isPlaying())
  bk_song.play();
}

function reload() {
  location.reload();
}

