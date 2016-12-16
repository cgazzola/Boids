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

    image = boid;
    x = getRandomInt(1,24) * 32;
    y = 30;
    deltaX = 5;
    deltaY = 5;

    Boid(image,x,y,deltaX,deltaY);

}

function generateBoids(numOfBoids) {

    var boid_count = numOfBoids;

    for(var i=0; i<boid_count; i++){
        boidCreator();
    }
    console.log('created');
}

function getRandomInt(min, max) { // Returns a random int between min (included) and max (excluded)

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;

}


function runGame() {
    generateBoids(10);
    requestAnimationFrame(simulationLoop)
}

function startGame() {
    loadImages();
    boid.onload = function (param) {
        runGame();
    }
}

startGame();