var canvas;             // The canvas that is used as the drawing surface
var graphics;           // The 2D graphics context for drawing on the canvas.
var mazeDimensions;     // The dimension of the maze drawn by maze.js
var grid;               // The maze

var X_LEFT;    // The xy limits for the coordinate system.
var X_RIGHT;
var Y_BOTTOM;
var Y_TOP;

var BACKGROUND  = "gray";   // The display is filled with this color before the scene is drawn.

var pixelSize;              // The size of one pixel, in the transformed coordinates.

var frameNumber = 0;        // Current frame number. goes up by one in each frame.
var worldMap;                  // A SceneGraphNode representing the entire scene.

// TODO: Define global variables to represent animated objects in the scene.
var theMaze;
var player1;
var goal;
var enemies     = [];
var missions    = [];

//Check which stuff have been given
var isPlayer1   = undefined;
var isGoal      = undefined;
var isEnemies   = undefined;
var isMissions  = undefined;
/**
 *  Builds the data structure that represents the entire picture.
 */
function createWorld() {
    initComponents();
    worldMap = new CompoundObject();  // Root node for the scene graph.
    // TODO: Create objects and add them to the scene graph.

    var wm1 = new TransformedObject(theMaze).setTranslation(0.5, 0.5).setScale(1, 1).setStrokeColor("red");
    worldMap.add(wm1);

    if(typeof isGoal != "undefined"){
        var wm1 = new TransformedObject(goal).setTranslation(isGoal[0] +0.25,isGoal[1] +0.5).setScale(1, 1).setFillColor("green");
        worldMap.add(wm1);
    }
    if(typeof isPlayer1 != "undefined") {
        var wm1 = new TransformedObject(player1).setTranslation(isPlayer1[0] +0.5,isPlayer1[1] + 0.5).setScale(1, 1).setFillColor("white");
        worldMap.add(wm1);
    }
    if(typeof isEnemies != "undefined"){
        for (var i = 0; i < enemies.length; i++) {
            var wm1 = new TransformedObject(enemies[i]).setTranslation(isEnemies[i][0] +0.5, isEnemies[i][1]).setScale(1,1).setFillColor("black");
            worldMap.add(wm1);
        }
    }
    if(typeof isMissions != "undefined"){
        for (var i = 0; i < missions.length; i++) {
            var wm1 = new TransformedObject(missions[i]).setTranslation(isMissions[i][0] +0.5, isMissions[i][1] +0.5).setScale(1, 1).setFillColor("blue");
            worldMap.add(wm1);
        }
    }
}
//-----------Complex Objects that make up the worldMap--------------------
function initComponents() {
    theMaze = createMaze();
    if(typeof isGoal != "undefined")       goal = addGoal();
    if(typeof isMissions != "undefined")   missions = addMission();
    if(typeof isPlayer1 != "undefined")    player1 = addPlayer();
    if(typeof isEnemies != "undefined")    enemies = addEnemies();
}

function createMaze() {
    var maze = new CompoundObject();

    for (var i = 0; i < grid.length-1; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            if (grid[i][j]) {
                if (grid[i][j] == grid[i][j+1])
                    maze.add(new TransformedObject(line).setTranslation(i, j+.5).setRotation(90));
                if (grid[i][j] == grid[i+1][j])
                    maze.add(new TransformedObject(line).setTranslation(i+.5, j));
            }
        }
    }
    for (var i = 0; i < grid.length-1; i++) {
        if (grid[grid.length-1][i+1] && grid[grid.length-1][i])
            maze.add(new TransformedObject(line).setTranslation(grid.length-1, i+.5).setRotation(90));
    }
    return maze;
}

function addEnemies() {
   var enemies = [];
   for (var i = 0; i < isEnemies.length; i++) {
       enemies.push(new TransformedObject(filledTriangle));
   }
   return enemies
}
function addGoal() {
   var goal = new TransformedObject(filledRect);
   return goal;
}

function addMission() {
   var missions = [];
   for (var i = 0; i < isMissions.length; i++) {
       missions.push(new TransformedObject(filledCircle))
   }
   return missions;
}
function addPlayer() {
    var player1 = new TransformedObject(filledCircle);
   return player1
}

/**
 * This method is called just before each frame is drawn.  It updates the modeling
 * transformations of the objects in the scene that are animated.
 */
function updateFrame(player, enemy) {
    frameNumber++;
    // TODO: Update state in preparation for drawing the next frame.
    //update player on the worldMap
    if(typeof player != "undefined"){ player1.setTranslation(player[0], player[1]);}

    //update enemies on the worldMap
    if(typeof enemy != "undefined")
        for (var i = 0; i < enemies.length; i++) {enemies[i].setTranslation(enemy[i][0], enemy[i][1]);}

    // console.log(player[0] + " Math.floor(player[0]) " + player[0])
    //animate the goal
    goal.setRotation(frameNumber*0.75);

}

//------------------- A Simple Scene Object-Oriented Scene Graph API ----------------

/**
 * The (abstract) base class for all nodes in the scene graph data structure.
 */
function SceneGraphNode() {
    this.fillColor = null;   // If non-null, the default fillStyle for this node.
    this.strokeColor = null; // If non-null, the default strokeStyle for this node.
}
SceneGraphNode.prototype.doDraw = function(g) {
        // This method is meant to be abstract and must be OVERRIDDEN in an actual
        // object. It is not meant to be called; it is called by draw().
    throw "doDraw not implemented in SceneGraphNode"
}
SceneGraphNode.prototype.draw = function(g) {
       // This method should be CALLED to draw the object It should NOT
       // ordinarily be overridden in subclasses.
    graphics.save();
    if (this.fillColor) {
        g.fillStyle = this.fillColor;
    }
    if (this.strokeColor) {
        g.strokeStyle = this.strokeColor;
    }
    this.doDraw(g);
    graphics.restore();
}
SceneGraphNode.prototype.setFillColor = function(color) {
        // Sets fillColor for this node to color.
        // Color should be a legal CSS color string, or null.
    this.fillColor = color;
    return this;
}
SceneGraphNode.prototype.setStrokeColor = function(color) {
        // Sets strokeColor for this node to color.
        // Color should be a legal CSS color string, or null.
    this.strokeColor = color;
    return this;
}
SceneGraphNode.prototype.setColor = function(color) {
        // Sets both the fillColor and strokeColor to color.
        // Color should be a legal CSS color string, or null.
    this.fillColor = color;
    this.strokeColor = color;
    return this;
}

/**
 *  Defines a subclass, CompoundObject, of SceneGraphNode to represent
 *  an object that is made up of sub-objects.  Initially, there are no
 *  sub-objects.  Objects are added with the add() method.
 */
function CompoundObject() {
    SceneGraphNode.call(this);  // do superclass initialization
    this.subobjects = [];  // the list of sub-objects of this object
}
CompoundObject.prototype = new SceneGraphNode(); // (makes it a subclass!)
CompoundObject.prototype.add = function(node) {
    this.subobjects.push(node);
    return this;
}
CompoundObject.prototype.doDraw = function(g) {
        // Just call the sub-objects' draw() methods.
    for (var i = 0; i < this.subobjects.length; i++)
        this.subobjects[i].draw(g);
}

/**
 *  Define a subclass, TransformedObject, of SceneGraphNode that
 *  represents an object along with a modeling transformation to
 *  be applied to that object.  The object must be specified in
 *  the constructor.  The transformation is specified by calling
 *  the setScale(), setRotate() and setTranslate() methods. Note that
 *  each of these methods returns a reference to the TransformedObject
 *  as its return value, to allow for chaining of method calls.
 *  The modeling transformations are always applied to the object
 *  in the order scale, then rotate, then translate.
 */
function TransformedObject(object) {
    SceneGraphNode.call(this);  // do superclass initialization
    this.object = object;
    this.rotationInDegrees = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.translateX = 0;
    this.translateY = 0;
}
TransformedObject.prototype = new SceneGraphNode();  // (makes it a subclass!)
TransformedObject.prototype.setRotation = function(angle) {
       // Set the angle of rotation, measured in DEGREES.  The rotation
       // is always about the origin.
    this.rotationInDegrees = angle;
    return this;
}
TransformedObject.prototype.setScale = function(sx, sy) {
       // Sets scaling factors.
    this.scaleX = sx;
    this.scaleY = sy;
    return this;
}
TransformedObject.prototype.setTranslation = function(dx,dy) {
       // Set translation mounts.
    this.translateX = dx;
    this.translateY = dy;
    return this;
}
TransformedObject.prototype.doDraw = function(g) {
        // Draws the object, with its modeling transformation.
    g.save();
    if (this.translateX != 0 || this.translateY != 0) {
        g.translate(this.translateX, this.translateY);
    }
    if (this.rotationInDegrees != 0) {
        g.rotate(this.rotationInDegrees/180*Math.PI);
    }
    if (this.scaleX != 1 || this.scaleY != 1) {
        g.scale(this.scaleX, this.scaleY);
    }
    this.object.draw(g);
    g.restore();
}

       // Create some basic shapes as custom SceneGraphNode objects.

var line = new SceneGraphNode();  // Line from (-0.5,0) to (0.5,0)
line.doDraw = function(g) {
    g.beginPath();
    g.moveTo(-0.5,0);
    g.lineTo(0.5,0);
    g.stroke();
}

var filledRect = new SceneGraphNode();  // Filled square, size = 1, center = (0,0)
filledRect.doDraw = function(g) {
    g.fillRect(-0.5,-0.5,1,1);
}

var rect = new SceneGraphNode(); // Stroked square, size = 1, center = (0,0)
rect.doDraw = function(g) {
    g.strokeRect(-0.5,-0.5,1,1);
}

var filledCircle = new SceneGraphNode(); // Filled circle, diameter = 1, center = (0,0)
filledCircle.doDraw = function(g) {
    g.beginPath();
    g.arc(0,0,0.5,0,2*Math.PI);
    g.fill();
}

var circle = new SceneGraphNode();// Stroked circle, diameter = 1, center = (0,0)
circle.doDraw = function(g) {
    g.beginPath();
    g.arc(0,0,0.5,0,2*Math.PI);
    g.stroke();
}

var filledTriangle = new SceneGraphNode(); // Filled Triangle, width 1, height 1, center of base at (0,0)
filledTriangle.doDraw = function(g) {
    g.beginPath();
    g.moveTo(-0.5,0);
    g.lineTo(0.5,0);
    g.lineTo(0,1);
    g.closePath();
    g.fill();
}



// ------------------------------- graphics support functions --------------------------

/**
  * Draw one frame of the animation.  Probably doesn't need to be changed,
  * except maybe to change the setting of preserveAspect in applyLimits().
  */
function draw() {
    graphics.save();  // to make sure changes don't carry over from one call to the next
    graphics.fillStyle = BACKGROUND;  // background color
    graphics.fillRect(0,0,canvas.width,canvas.height);
    graphics.fillStyle = "black";
    applyLimits(graphics,X_LEFT,X_RIGHT,Y_TOP,Y_BOTTOM,false);
    graphics.lineWidth = pixelSize;  // Use 1 pixel as the default line width
    worldMap.draw(graphics);
    graphics.restore();
}

/**
 * Applies a coordinate transformation to the graphics context, to worldMap
 * xleft,xright,ytop,ybottom to the edges of the canvas.  This is called
 * by draw().  This does not need to be changed.
 */
function applyLimits(g, xleft, xright, ytop, ybottom, preserveAspect) {
   var width = canvas.width;   // The width of this drawing area, in pixels.
   var height = canvas.height; // The height of this drawing area, in pixels.
   if (preserveAspect) {
         // Adjust the limits to match the aspect ratio of the drawing area.
      var displayAspect = Math.abs(height / width);
      var requestedAspect = Math.abs(( ybottom-ytop ) / ( xright-xleft ));
      var excess;
      if (displayAspect > requestedAspect) {
         excess = (ybottom-ytop) * (displayAspect/requestedAspect - 1);
         ybottom += excess/2;
         ytop -= excess/2;
      }
      else if (displayAspect < requestedAspect) {
         excess = (xright-xleft) * (requestedAspect/displayAspect - 1);
         xright += excess/2;
         xleft -= excess/2;
      }
   }
   var pixelWidth = Math.abs(( xright - xleft ) / width);
   var pixelHeight = Math.abs(( ybottom - ytop ) / height);
   pixelSize = Math.min(pixelWidth,pixelHeight);
   g.scale( width / (xright-xleft), height / (ybottom-ytop) );
   g.translate( -xleft, -ytop );
}


//------------------ Animation framework ------------------------------

var running = false;  // This is set to true when animation is running

function frame() {
    if (running) {
           // Draw one frame of the animation, and schedule the next frame.
        updateFrame();
        draw();
        requestAnimationFrame(frame);
    }
}

function doAnimationCheckbox() {
    var shouldRun = true;
    if ( shouldRun != running ) {
        running = shouldRun;
        if (running)
            requestAnimationFrame(frame);
    }
}

//----------------------- initialization -------------------------------
function init(maze, goal, player, missions, enemies) {
    canvas          = document.getElementById("canvas");
    mazeDimensions  = maze.length;
    grid            = maze;

    X_LEFT          = 0;    // The xy limits for the coordinate system.
    X_RIGHT         = mazeDimensions;
    Y_BOTTOM        = 0;
    Y_TOP           = mazeDimensions;

    isGoal          = goal;
    isMissions      = missions;
    isPlayer1       = player;
    isEnemies       = enemies;

    if (!canvas.getContext) {
        document.getElementById("message").innerHTML = "ERROR: Canvas not supported";
        return;
    }
    graphics = canvas.getContext("2d");
    doAnimationCheckbox();
    createWorld();
    draw();
}
