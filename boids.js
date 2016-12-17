/**
 * Created by devmachine on 12/16/16.
 */

var boidImg = new Image();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var boids = [];
var speed = 4.0;
var radius = 20;
var visibility = .5


function loadImages() {
    boidImg.src = "imgs/butterfly_sprites.png";
}

var boidObject = {
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

    draw : function () {
        ctx.drawImage(this.image, this.x_offset, this.y_offset, this.FRAME_WIDTH, this.FRAME_WIDTH, this.x, this.y, this.FRAME_WIDTH, this.FRAME_WIDTH);
    },

    updateFrame : function () {
        this.current_frame = ++this.current_frame % this.MAX_FRAMES;
        this.x_offset = this.FRAME_WIDTH * this.current_frame;
    },

    move: function() {
        this.x += this.vX;
        this.y += this.vY;
        if (this.x > canvas.width) {
            if (this.vX > 0) {
                this.vX = -this.vX;
            }
        }
        if (this.y > canvas.height) {
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

    norm: function () {
        var z = Math.sqrt(this.vX * this.vX + this.vY * this.vY );
        if (z<.001) {
            this.vX = (Math.random() - .5) * speed;
            this.vY = (Math.random() - .5) * speed;
            this.norm();
        } else {
            z = speed / z;
            this.vX *= z;
            this.vY *= z;
        }
    }
}


function makeBoid(x,y) {
    Empty = function () {};
    Empty.prototype = boidObject;
    var boid = new Empty();
    boid.x = x;
    boid.y = y;
    return boid;
}

for (var i=0; i<50; i++) {
    var b = makeBoid( 50+Math.random()*500, 50+Math.random()*300 );
    boids.push(b)
}

function drawBoids() {
    // clear the window
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw the balls - too bad we can't use for i in theBalls
    for (var i=0; i<boids.length; i++) {
        boids[i].updateFrame();
        boids[i].draw();
    }
}

function bounce(boidList) {
    var rad = 2 * radius;
    rad = rad*rad;

    for(var i=boidList.length-1; i>=0; i--) {
        var bi = boidList[i];
        var bix = bi.x;
        var biy = bi.y;
        // notice that we do the n^2 checks here, slightly painful
        for(var j=i-1; j>=0; j--) {
            var bj = boidList[j];
            var bjx = bj.x;
            var bjy = bj.y;
            var dx = bjx - bix;
            var dy = bjy - biy;
            var d = dx*dx+dy*dy;
            if (d < rad) {
                bj.vX = dy;
                bj.vY = dx;
                bi.vX = -dx;
                bi.vY = -dy;
            }
        }
    }
}


function align(boidList)
{
    var visibility = .9; // alignment parameter - between 0 and 1

    // make temp arrays to store results
    // this is inefficient, but the goal here is to make it work first
    var newVX = new Array(boidList.length);
    var newVY = new Array(boidList.length);

    // do the n^2 loop over all pairs, and sum up the contribution of each
    for(var i=boidList.length-1; i>=0; i--) {
        var bi = boidList[i];
        var bix = bi.x;
        var biy = bi.y;
        newVX[i] = 0;
        newVY[i] = 0;

        for(var j=boidList.length-1; j>=0; j--) {
            var bj = boidList[j];
            // compute the distance for falloff
            var dx = bj.x - bix;
            var dy = bj.y - biy;
            var d = Math.sqrt(dx*dx+dy*dy);
            // add to the weighted sum
            newVX[i] += (bj.vX / (d+visibility));
            newVY[i] += (bj.vY / (d+visibility));
        }
    }
    for(var i=boidList.length-1; i>=0; i--) {
        boidList[i].vX = newVX[i];
        boidList[i].vY = newVY[i];
    }
}

function moveBoids() {
    align(boids);
    bounce(boids);
    for (var i=0; i<boids.length; i++) {
        boids[i].norm();
        boids[i].move();
    }
}


function runGame() {

    moveBoids();
    drawBoids();
    requestAnimationFrame(runGame);
}

function startGame() {
    loadImages();
    boidImg.onload = function (param) {
        runGame();
    }
}

$( "#slider" ).slider({
    max : 1,
    min : 0,

});

startGame();