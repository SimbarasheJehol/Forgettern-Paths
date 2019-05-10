class Person {
    constructor(mass, body) {
        this.mass             = mass;
        this.body             = body;
        this.changeInVelocity = .5;
        this.maxVelocity      = 3;
        this.maxJump          = 1.2;
        this.damping          = 0.5;
    }
    setXYZ(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Player extends Person {
    constructor(mass, body, radius) {
        super(mass, body);
        this.radius     = radius;
        this.texture    = new THREE.MeshPhongMaterial({map: new THREE.ImageUtils.loadTexture('/asserts/images/ball.png') });
    }
}

function jumping(vel, maxJump) {
    // // check if user is jumping
    // 2 == falling, 1 == jumping 0 == on ground
    keyAxis[2] = (player.body.position.z > maxJump/2) ? 2: keyAxis[2];
    keyAxis[2] = (player.body.position.z.toFixed(0) == 0 && keyAxis[2] == 2) ? 0: keyAxis[2];
    // update the velocity of z
    return (keyAxis[2] == 2) ? player.body.velocity.z-vel*.25 :
                             (keyAxis[2] == 1) ? player.body.velocity.z+vel : 0;
}

function updatePlayerVelocity(vel, maxVel, maxJump) {
    // apply force in the direction of user input
    player.body.velocity = new CANNON.Vec3(player.body.velocity.x+keyAxis[0]*vel,
                                                player.body.velocity.y+keyAxis[1]*vel,
                                                jumping(vel, maxJump));
    // setMax velocity constraint
    player.body.velocity.x = ((player.body.velocity.x) > maxVel) ? maxVel : player.body.velocity.x;
    player.body.velocity.x = (player.body.velocity.x < -maxVel) ? -maxVel : player.body.velocity.x;
    player.body.velocity.y = ((player.body.velocity.y) > maxVel) ? maxVel : player.body.velocity.y;
    player.body.velocity.y = (player.body.velocity.y < -maxVel) ? -maxVel : player.body.velocity.y;
}

//function for enemy move, it returns xVelocity and yVelocity in form of array
function automateMove (xStart, yStart, xGoal, yGoal) {
    var index       = 1;
    var xVelocity   = 0;
    var yVelocity   = 0;
    var velocity    = enemy.maxVelocity;

    //rounding off the goal coordinates
    var endX = xGoal.toFixed(0);
    var endY = yGoal.toFixed(0);

    //rounding off the start coordinates
    var startX = xStart.toFixed(0);
    var startY = yStart.toFixed(0);

    var starto = [startX, startY];
    var endo = [endX, endY];

    var sp = runAStar(maze.maze, starto, endo);      //shortestPath from start to end

    // Update enemy position.

    if (startX != endX || startY != endY) {

        var xEnemy =  enemy.body.position.x;
        var yEnemy =  enemy.body.position.y;

        var meshX = xEnemy.toFixed(2);
        var meshY = yEnemy.toFixed(2);

        if (meshX != sp[index].x) {
              if (enemy.body.position.x > sp[index].x) {
                xVelocity = -velocity; //left
              } else {
                xVelocity = velocity;  //right
              }
        }

        if (meshY != sp[index].y) {
            if ( enemy.body.position.y > sp[index].y) {
              yVelocity = -velocity //down
            } else {
              yVelocity = velocity; //up
            }
        }
    } else if (xStart != xGoal || yStart != yGoal) { // if distance if less than 1 unit
          if (xStart > xGoal) {
              xVelocity = -velocity; //left
          }

          if (xStart < xGoal) {
              xVelocity = velocity;  //right

          }

          if (yStart > yGoal) {
              yVelocity = -velocity //down
          }

          if (yStart < yGoal) {
              yVelocity = velocity; //up
          }

    }

    var finalVel = [xVelocity, yVelocity];

    return finalVel;

}
