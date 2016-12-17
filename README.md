This is a simulation of Craig Reynolds's Boid Simulation. It's written in Javascript.
In this simulation, a spritesheet is provided. You can change this however to whatever sprite sheet you'd like.
All you have to do is reset the framWidth, frameHeight, currentFrame, x_offset, and y_offset variables accordingly.
You may also have to play with the move function, so that your animation stays fully in bounds; this is obviously
because the state of "being in bounds" depends on your sprites dimensions.

The simulation uses JQuery to provide a UI that allows adjustment of the visibility of other neighboring boids.
Have fun!
