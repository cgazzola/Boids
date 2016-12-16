/**
 * Created by devmachine on 12/15/16.
 */

var boid = new Image();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var boids = [];


function loadImages() {
    boid.src = "imgs/butterfly_sprites.png";
}

Boid = function (image, x, y, deltaX, deltaY) {
    var boid = {
        image : image,
        x : x,
        y : y,
        deltaX : deltaX,
        deltaY : deltaY,
        current_frame : 0,
        MAX_FRAMES : 13,
        FRAME_WIDTH : 39,
        FRAME_HEIGHT : 36,
        x_offset : 0,
        y_offset : 37
    }

    boids.push(boid);
}

function drawBoid(time, boid){

    updateFrame(time, boid);
    ctx.drawImage(boid.image, boid.x_offset, boid.y_offset, boid.FRAME_WIDTH, boid.FRAME_WIDTH, boid.x, boid.y, boid.FRAME_WIDTH, boid.FRAME_WIDTH);
}

function updateFrame(time, boid) {
    boid.current_frame = ++boid.current_frame % boid.MAX_FRAMES;
    boid.x_offset = boid.FRAME_WIDTH * boid.current_frame;
}


function simulationLoop(currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var boid=0; boid < boids.length; boid++){
        updateBoidPosition(boids[boid]);
        drawBoid(currentTime, boids[boid]);
    }

    requestAnimationFrame(simulationLoop);

}

function boidCreator() {
    var image;
    var x;
    var y;
    var deltaX;
    var deltaY;

    var number = getRandomInt(1,101);

    if(number < 26){ // boids flying south east

        image = boid;
        x = getRandomInt(1,47) * 39;
        y = getRandomInt(1,28) * 36;
        deltaX = 1;
        deltaY = 1;

    }
    else if(number >= 25 && number <51){ // boids flying south west

        image = boid;
        x = getRandomInt(1,47) * 39;
        y = getRandomInt(1,28) * 36;
        deltaX = -1;
        deltaY = 1;
    }

    else if(number >= 51 && number < 76){ // boids flying north east

        image = boid;
        x = getRandomInt(1,47) * 39;
        y = getRandomInt(1,28) * 36;
        deltaX = 1;
        deltaY = -1;

    }

    else{ // boids flying north west

        image = boid;
        x = getRandomInt(1,47) * 39;
        y = getRandomInt(1,28) * 36;
        deltaX = -1;
        deltaY = -1;

    }



    Boid(image,x,y,deltaX,deltaY);

}

function generateBoids(numOfBoids) {

    var boid_count = numOfBoids;

    for(var i=0; i<boid_count; i++){
        boidCreator();
    }
}

function getRandomInt(min, max) { // Returns a random int between min (included) and max (excluded)

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;

}

function updateBoidPosition(boid) {
    boid.x = boid.x + boid.deltaX;
    boid.y = boid.y + boid.deltaY;
    keepBoidInBounds(boid);
}

keepBoidInBounds = function (boid) { //keeps boids in canvas
    if( boid.y < 0){
        boid.y = canvas.height - boid.FRAME_HEIGHT;
    }
    else if(boid.y > canvas.height-boid.FRAME_HEIGHT){
        boid.y = 0;
    }
    else if(boid.x < 0){
        boid.x = canvas.width - boid.FRAME_WIDTH;
    }
    if(boid.x > canvas.width-boid.FRAME_WIDTH){
        boid.x = 0;
    }
}

function runGame() {
    generateBoids(80);
    requestAnimationFrame(simulationLoop)
}

function startGame() {
    loadImages();
    boid.onload = function (param) {
        runGame();
    }
}

startGame();