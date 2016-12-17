/**
 * Created by devmachine on 12/16/16.
 */

var boidImg = new Image();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var boids = []; // array to store boids
var speed = 4.0; // default speed of all boids
var halfFrameWidth = 20; // half the frame width of the boid, used to reflect boids if they come too close
var visibility = .5 // initial visibility factor, this can also be set with the slider


function loadImages() { // loads images so that code doesn't try to access them before they're initialized
    boidImg.src = "imgs/butterfly_sprites.png";
}

var boidObject = { // default object, becomes a prototype for the future "boid" object
    image: boidImg,
    x : 100,
    y : 100,
    vX : 10,
    vY : 10,
    current_frame : 0,
    MAX_FRAMES : 13,
    FRAME_WIDTH : 39,
    FRAME_HEIGHT : 36,
    x_offset : 0,
    y_offset : 37,
    angle : 0, // used for orientating the boid

    draw : function () { // draw function to draw boids
        this.angle = Math.atan2(this.vY, this.vX); // gets the angle of the velocity vector in radians
        ctx.save(); //saves current state of the context
        ctx.translate(this.x, this.y); // sets the origin to the current x and y of this boid
        ctx.rotate(this.angle+0.5*Math.PI); // rotates sprite to vector direction
        ctx.translate(-this.x, -this.y);// sets origin back
        ctx.drawImage(this.image, this.x_offset, this.y_offset, this.FRAME_WIDTH, this.FRAME_WIDTH, this.x, this.y, this.FRAME_WIDTH, this.FRAME_WIDTH);
        ctx.setTransform(1,0,0,1,0,0); // sets transformation matrix
        ctx.restore(); // restores state of context
    },

    updateFrame : function () { // update function for animation
        this.current_frame = ++this.current_frame % this.MAX_FRAMES;
        this.x_offset = this.FRAME_WIDTH * this.current_frame;
    },

    move: function() { // moves boid in canvas, while keeping them in bounds
        this.x += this.vX;
        this.y += this.vY;
        if (this.x > canvas.width-30) {
            if (this.vX > 0) {
                this.vX = -this.vX;
            }
        }
        if (this.y > canvas.height-36) {
            if (this.vY > 0) {
                this.vY = -this.vY;
            }
        }
        if (this.x < 0) {
            if (this.vX < 0) {
                this.vX = -this.vX;
            }
        }
        if (this.y < 0) {
            if (this.vY < 0) {
                this.vY = -this.vY;
            }
        }
    },

    normalize: function () { // normalizes the velocity vector
        var z = Math.sqrt(this.vX * this.vX + this.vY * this.vY );
        if (z<.001) {
            this.vX = (Math.random() - .5) * speed;
            this.vY = (Math.random() - .5) * speed;
            this.normalize();
        } else {
            z = speed / z;
            this.vX *= z;
            this.vY *= z;
        }
    }
}


function makeBoid(x,y) { // creates a boid object, sets its prototype to boidObject, set random starting position
    Empty = function () {};
    Empty.prototype = boidObject;
    var boid = new Empty();
    boid.x = x;
    boid.y = y;
    return boid;
}

for (var i=0; i<40; i++) { // initializes all boids and puts them in array, uses random generator for x and y coordinates
    var b = makeBoid( 50+Math.random()*500, 50+Math.random()*300 );
    boids.push(b)
}

function drawBoids() { // draws the boids and updates their frames for animation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i=0; i<boids.length; i++) {
        boids[i].updateFrame();
        boids[i].draw();
    }
}

function reflect(boidList) { // allows boids to reflect off each other if they get too close, part of the overall algorithm
    var length = 2 * halfFrameWidth; // (halfFrameWidth) is the equivalent of a radius if the boid was circular
    length = length*length; // square of the length

    for(var i=boidList.length-1; i>=0; i--) { // iterates through all the boids, except for "this" one
        var bi = boidList[i];
        var bix = bi.x;
        var biy = bi.y;
        for(var j=i-1; j>=0; j--) {
            var bj = boidList[j];
            var bjx = bj.x;
            var bjy = bj.y;
            var dx = bjx - bix;
            var dy = bjy - biy;
            var d = dx*dx+dy*dy;
            if (d < length) {
                bj.vX = dy;
                bj.vY = dx;
                bi.vX = -dx;
                bi.vY = -dy;
            }
        }
    }
}


function flock(boidList) // the last part of the flocking algorithm, which calculates the group's center
{

    // uses arrays to store the 2 resultant vectors
    var newVX = new Array(boidList.length);
    var newVY = new Array(boidList.length);

    // for the cohesion part, sums up all the "other" boids positions in order to find the central average pos
    for(var i=boidList.length-1; i>=0; i--) {
        var bi = boidList[i];
        var bix = bi.x;
        var biy = bi.y;
        newVX[i] = 0;
        newVY[i] = 0;

        for(var j=boidList.length-1; j>=0; j--) {
            var bj = boidList[j];
            // determines the distance
            var dx = bj.x - bix;
            var dy = bj.y - biy;
            var d = Math.sqrt(dx*dx+dy*dy);
            // adds to the sum
            newVX[i] += (bj.vX / (d+visibility));
            newVY[i] += (bj.vY / (d+visibility));
        }
    }
    for(var i=boidList.length-1; i>=0; i--) {
        boidList[i].vX = newVX[i];
        boidList[i].vY = newVY[i];
    }
}

// algorithm loop
function moveBoids() {
    flock(boids);
    reflect(boids);
    for (var i=0; i<boids.length; i++) {
        boids[i].normalize();
        boids[i].move();
    }
}


function runGame() { // runs the simulation

    moveBoids();
    drawBoids();
    requestAnimationFrame(runGame);
}

function startGame() { // loads images and then calls function to run simulation
    loadImages();
    boidImg.onload = function (param) {
        runGame();
    }
}

$("#slider").slider({ //sets sliders values
    max : 1,
    min : .1,
    step : .1,
    value : .5
});

$("#slider").on("slide", function (e, ui) { // gets slider value and sets it to the visibility
    visibility = ui.value;
})


startGame(); // starts the simulation