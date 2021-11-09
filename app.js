const canvasEl=document.querySelector('canvas');
const canvasContext=canvasEl.getContext('2d');

canvasEl.width=1500;
canvasEl.height=720;
//------------------------------------------------------------------------------------------------------------------------------------//
let RIScore = new Audio();
let AIScore = new Audio();
let hit = new Audio();
let wall = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
AIScore.src = "sounds/AIScore.mp3";
RIScore.src = "sounds/RIScore.mp3";

//RI Player paddle
const playerPaddleRI={
    xP:0,
    yP:canvasEl.height/2-100/2,
    height:100,
    width:10,
    color:"#d2e603",
    score:0
};

//AI Player paddle
const playerPaddleAI={
    xP:canvasEl.width-10,
    yP:canvasEl.height/2-100/2,
    height:100,
    width:10,
    color:"orange",
    score:0
};

//Creating Ball
const ball={
    xP:canvasEl.width/2,
    yP:canvasEl.height/2,
    radius:10,
    speed:10,
    xV:5,
    yV:5,
    color:"white"
};

//Creating net
const net={
    xP:canvasEl.width/2-2/2,
    yP:0,
    width:2,
    height:10,
    color:"white"
};

//Drawing the Canvas
function drawRect(xP,yP,width,height,color){
    canvasContext.fillStyle=color;
    canvasContext.fillRect(xP,yP,width,height);
}

//Drawing a circle
function drawCircle(xP,yP,radius,color){
    canvasContext.fillStyle=color;
    canvasContext.beginPath();
    canvasContext.arc(xP,yP,radius,0,Math.PI*2);
    canvasContext.fill();
}

//Drawing the text
function drawText(content,xP,yP,color){
    canvasContext.fillStyle=color;
    canvasContext.font='25px sans-serif';
    canvasContext.fillText(content,xP,yP);
}

//Drawing the net
function drawNet(){
    for(let i=0;i<canvasEl.height;i+=15){
        drawRect(net.xP,net.yP+i,net.width,net.height,net.color);
    }
}


//Rungame function aka game loop

function runGame(){
    //clearing the canvas "#4683a0"
    drawRect(0,0,canvasEl.width,canvasEl.height,"#000");

    //Draw net function
    drawNet();

    //Draw Score Function
    drawText(playerPaddleRI.score,canvasEl.width/4,canvasEl.height/10,"white");
    drawText(playerPaddleAI.score,3*canvasEl.width/4,canvasEl.height/10,"white");

    //Drawing the paddles for RI and AI
    drawRect(playerPaddleRI.xP,playerPaddleRI.yP,playerPaddleRI.width,playerPaddleRI.height,playerPaddleRI.color);
    drawRect(playerPaddleAI.xP,playerPaddleAI.yP,playerPaddleAI.width,playerPaddleAI.height,playerPaddleAI.color);

    //Drawing the ball
    drawCircle(ball.xP,ball.yP,ball.radius,ball.color)
}

//Player Paddle RI event listener
canvasEl.addEventListener('mousemove',movePaddle);

function movePaddle(e){
    const canvasRect=canvasEl.getBoundingClientRect();
    playerPaddleRI.yP=e.clientY-canvasRect.top-playerPaddleRI.height/2;
}

//Collision detection of paddle handler
function paddleCD(BALL,PADDLE){
    BALL.top=BALL.yP-BALL.radius;
    BALL.bottom=BALL.yP+BALL.radius;
    BALL.left=BALL.xP-BALL.radius;
    BALL.right=BALL.xP+BALL.radius;

    PADDLE.top=PADDLE.yP;
    PADDLE.bottom=PADDLE.yP+PADDLE.height;
    PADDLE.left=PADDLE.xP;
    PADDLE.right=PADDLE.xP+PADDLE.width;

    return BALL.right>PADDLE.left && BALL.bottom>PADDLE.top && BALL.left<PADDLE.right && BALL.top<PADDLE.bottom;
}

//the resetBall function
function resetBall(){
    ball.xP=canvasEl.width/2;
    ball.yP=canvasEl.height/2;
    ball.speed=10;
}

//Brain of the Game
function brain(){
    //Moving the ball 
    ball.xP+=ball.xV;
    ball.yP+=ball.yV;

    //Creating the AI
    let intelligenceLevel=0.3;
    playerPaddleAI.yP+=(ball.yP-(playerPaddleAI.yP+playerPaddleAI.height/2))*intelligenceLevel;

    //Bouncing off the top and bottom wall
    if(ball.yP+ball.radius>canvasEl.height || ball.yP-ball.radius<0){
        ball.yV=-ball.yV;
        wall.play();
    }

    let player=ball.xP+ball.radius<canvasEl.width/2?playerPaddleRI:playerPaddleAI;

    if(paddleCD(ball,player)){
        hit.play();
        //When ball hits the paddle of any player
        let collisionPoint=ball.yP-(player.yP+player.height/2);
        collisionPoint=collisionPoint/(player.height/2);

        //Calculating angle at which balls bounce(radians)
        let bounceAngle=(Math.PI*collisionPoint)/4;

        //Calculating the direction of the ball when it bounces back
        let direction=ball.xP+ball.radius<canvasEl.width/2?1:-1;

        //Updating velocity when ball hits any paddle
        ball.xV=direction*ball.speed*Math.cos(bounceAngle);
        ball.yV=ball.speed*Math.sin(bounceAngle);

        //after each bounce ball speed must increase
        ball.speed+=0.1;
    }

    //Updating thr scores
    if(ball.xP+ball.radius<0){
        //the AI scored
        playerPaddleAI.score++;
        AIScore.play();
        resetBall();
    }else if(ball.xP-ball.radius>canvasEl.width){
        //the RI Scored
        playerPaddleRI.score++;
        RIScore.play();
        resetBall();
    }
}

//Game initialization function
function gameInit(){
    brain();
    runGame();
}

//Looping the game to keep it running
const FPS=60;
setInterval(gameInit,1000/FPS);

