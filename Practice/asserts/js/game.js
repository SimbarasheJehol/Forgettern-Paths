

//THREE.js variables
var camera, scene, renderer, light;

//objects
var maze = {
        maze:           undefined,
        mazeDimension:  11,
        mesh:           undefined,
        body:           undefined,
        shape:          "box",
        wallHeight:     .5,
        wallWidth:      .5,
        wallRadius:     .5,
        secondLayer:    true,
        secondShape:    "box",
        layerPosition:  1,
        texture:        new THREE.MeshPhongMaterial({map: new THREE.ImageUtils.loadTexture('/asserts/images/brick.png') })
};

var plane = {
        planeTexture:    new THREE.ImageUtils.loadTexture('/asserts/images/concrete.png'),
        planeMesh:       undefined,
        body:            undefined
};

//Players
var player, enemy;

//KeyMovements
var mouseX, mouseY;
var keyAxis        = [0, 0, 0];

//path
var shortestPath   = [],
    end            = [],
    start          = [1, 1];

// Cannon world
var world;

// gameState
 var gameState;

// gameTypes
 var gameType = "timed";

function createPhysicsWorld() {
    // create World
    world = new CANNON.World();
    world.gravity.set(0, 0, -9.82);                           // add gravity
    world.broadphase = new CANNON.NaiveBroadphase();        // find colliding bodies
    world.solver.iterations = 10;                           // force to add to the bodies in contact.

    // Materials
    var groundMaterial = new CANNON.Material("groundMaterial");
    groundMaterial.friction = 0.5;
    groundMaterial.restitution = 0.5;

    // // Adjust constraint equation parameters for ground/ground contact
    var ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
        friction: .5,
        restitution: 0.5,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
        frictionEquationRegularizationTime: 3,
    });

    // Add contact material to the world
    world.addContactMaterial(ground_ground_cm);

    // // add plane.body
    var groundShape = new CANNON.Plane();
    plane.body = new CANNON.Body({ mass: 0, shape: groundShape, material: groundMaterial });    // mass = zero to make it static
    world.add(plane.body);                              undefined                                        // groundMaterial adds friction

    //add player
    var sphereShape = new CANNON.Sphere(player.radius);                                 // player is 5 units ahead of enemy
    player.body = new CANNON.Body({mass: player.mass, shape: sphereShape, material: groundMaterial});
    player.body.position.set(player.x, player.y, player.z);
    world.add(player.body);

    //add enemy
    if (gameType == "chased") addPhysicsEnemy();

    // Add the maze.
    generatePhysicsWalls(groundMaterial);
    world.add(maze.body);          //add maze to physics world
}

function createRenderWorld() {
    // Create the scene object.
    scene = new THREE.Scene();

    // Add the light.
    light= new THREE.PointLight(0xffffff, 1);
    light.position.set(player.body.initPosition.x, player.body.initPosition.y, 1.5);
    scene.add(light);

    var light2 = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light2 );

    // Add the ball.
    var g = new THREE.SphereGeometry(player.radius, 32, 16);
    var m = new THREE.MeshPhongMaterial({map: new THREE.ImageUtils.loadTexture('/asserts/images/ball.png') });
    player.mesh = new THREE.Mesh(g, m);
    player.mesh.position.set(player.body.initPosition.x, player.body.initPosition.y, player.body.initPosition.z);
    scene.add(player.mesh);

    // Add the enemy.
    if(gameType == "chased") addEnemy();

    // Add the camera.
    var aspect = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
    camera.position.set(player.body.initPosition.x, player.body.initPosition.y, 5);
    scene.add(camera);

    // Add the maze.
   maze.mesh = generateWalls(maze.maze);
   scene.add(maze.mesh);

   // Add the ground.
   plane.planeTexture =  THREE.ImageUtils.loadTexture('/asserts/images/concrete.png');
   var me = new THREE.ImageUtils.loadTexture('/asserts/images/concrete.png');
   g = new THREE.PlaneGeometry(maze.mazeDimension*10, maze.mazeDimension*10, maze.mazeDimension, maze.mazeDimension);
   plane.planeTexture.wrapS = plane.planeTexture.wrapT = THREE.RepeatWrapping;
   plane.planeTexture.repeat.set(maze.mazeDimension*5, maze.mazeDimension*5);
   m = new THREE.MeshPhongMaterial({map:plane.planeTexture});
   plane.mesh = new THREE.Mesh(g, m);
   plane.mesh.position.set((maze.mazeDimension-1)/2, (maze.mazeDimension-1)/2, 0);
   // plane.mesh.rotation.set(Math.PI/2, 0, 0);
   scene.add(plane.mesh);
}

function mazeShape(shape) {
	return (shape == "sphere")? new CANNON.Sphere(maze.wallRadius):       // for spherical walled maze
    			new CANNON.Box(new CANNON.Vec3(maze.wallWidth, maze.wallWidth, maze.wallHeight));           // for squared maze
}

function generatePhysicsWalls(groundMaterial) {

    var shapeMaze = mazeShape(maze.shape);
    maze.body = new CANNON.Body({ mass: 0, material: groundMaterial});     // mass = zero to make it static
    maze.body.position.set(0, 0, 0.5);

    for (var i = 0; i < maze.maze.dimension; i++) {
        for (var j = 0; j < maze.maze.dimension; j++) {
            if (maze.maze[i][j]) {
                maze.body.addShape(shapeMaze, new CANNON.Vec3(i, j, 0));
                if(maze.secondLayer) {
                	var secMazeShape = mazeShape(maze.secondShape);
	                maze.body.addShape(secMazeShape, new CANNON.Vec3(i, j, maze.layerPosition));    // adds second layer, think it looks cool
                }
            }
        }
    }
}

function generateWalls() {
    var obj = new THREE.Object3D();
    var material2 = maze.texture;
    for (var i = 0; i < maze.body.shapes.length; i++) {
        var shape = maze.body.shapes[i];            // get shapes
        var mesh;
        switch(shape.type) {
            case CANNON.Shape.types.SPHERE:         // draw spherical walls
                var sphere_geometry = new THREE.SphereGeometry( shape.radius, 8, 8);
                mesh = new THREE.Mesh( sphere_geometry, material2 );
                break;
            case CANNON.Shape.types.BOX:            // draw square walls
                var box_geometry = new THREE.BoxGeometry(  shape.halfExtents.x*2,
                                                           shape.halfExtents.y*2,
                                                           shape.halfExtents.z*2 );
                mesh = new THREE.Mesh( box_geometry, material2 );
                break;
            default:
                throw "Shape type not recognized: " + shape.type;
        }
        mesh.receiveShadow = true;                  // enable shadows
        mesh.castShadow = true;                     // enable shadows

        var o = maze.body.shapeOffsets[i];
        var q = maze.body.shapeOrientations[i];
        mesh.position.set(o.x, o.y, o.z);           // position shape
        mesh.quaternion.set(q.x, q.y, q.z, q.w);    // copy the shape

        obj.add(mesh);
    }
    return obj;
}


function updatePhysicsWorld() {
    // update player
    var f   = 100,                          // force
    vel     = player.changeInVelocity,      // Velocity
    maxVel  = player.maxVelocity,           // maximum velocity
    maxJump = player.maxJump;               // max position on jump
    player.body.linearDamping = player.body.angularDamping =  player.damping;      // set linearDamping and angularDamping;
    updatePlayerVelocity(vel, maxVel, maxJump)


    //update enemy
    if (gameType == "chased") updatePhysicsEnemy();

    // Step the physics world
    world.step(1/60);           //1/60 is the time step
}

function updateRenderWorld() {
    // Update player position
    // Copy coordinates from Cannon.js to Three.js
    player.mesh.position.copy(player.body.position);
    player.mesh.quaternion.copy(player.body.quaternion);

    // Update enemy position
    if(gameType == "chased") updateEnemy();

    // Update camera and light positions.
    camera.position.x += (player.mesh.position.x - camera.position.x) * 0.1;
    camera.position.y += (player.mesh.position.y - camera.position.y) * 0.1;
    camera.position.z += (5 - camera.position.z) * 0.1;
    light.position.x  = camera.position.x;
    light.position.y  = camera.position.y;
    light.position.z  = camera.position.z - 3.7;
}

function gameLoop() {

       switch(gameType) {

           case 'chased':
                caseChasedGameLoop(gameState);
                break;
           case 'timed':
                caseTimedGameLoop(gameState);
                break;
           case 'obstacles':
                caseObstaclesGameLoop(gameState);
                break;

       }

       requestAnimationFrame(gameLoop);
}

function  initPhysicsMaze(shape, wallHeightOrRadius, wallWidth, secondLayer, secondShape, layerPosition) {
       if ((typeof shape  != "undefined")) maze.shape = shape;                                                       // set shape
       if ((typeof wallHeightOrRadius  != "undefined") && shape == "box") maze.wallHeight = wallHeightOrRadius;      // set wall height
       if ((typeof wallHeightOrRadius  != "undefined") && shape == "sphere") maze.wallRadius = wallHeightOrRadius;   // set wall radius
       if ((typeof wallWidth  != "undefined")) maze.wallWidth = wallWidth;                                           // set wall width
       if ((typeof secondLayer  != "undefined")) {
           maze.secondLayer = secondLayer;                                                                            // set if there's a second layer
           if ((typeof secondShape  != "undefined")) maze.secondShape = secondShape;                                 // set second shape
           if ((typeof layerPosition  != "undefined"))       maze.layerPosition = layerPosition;                     // set the z position of second layer
       }
   }

function onResize() {
   renderer.setSize(window.innerWidth, window.innerHeight);
   camera.aspect = window.innerWidth/window.innerHeight;
   camera.updateProjectionMatrix();
}

function onReleaseKey(e) {
    var val = 0;
    if (event.keyCode == 37 || event.keyCode == 65) keyAxis[0] = val;     // left     arrow/a
    if (event.keyCode == 39 || event.keyCode == 68) keyAxis[0] = val;    // right    arrow/d
    if (event.keyCode == 38 || event.keyCode == 87) keyAxis[1] = val;     // up       arrow/w
    if (event.keyCode == 40 || event.keyCode == 83) keyAxis[1] = val;    // down     arrow/s
    // if (event.keyCode == 32) keyAxis[2] = val;                            // jump     space
    else return;
}

function onMoveKey(e) {
    if (event.keyCode == 37 || event.keyCode == 65) keyAxis[0] = -1;                // left     arrow/a
    if (event.keyCode == 39 || event.keyCode == 68) keyAxis[0] = 1;                 // right    arrow/d
    if (event.keyCode == 38 || event.keyCode == 87) keyAxis[1] = 1;                 // up       arrow/w
    if (event.keyCode == 40 || event.keyCode == 83) keyAxis[1] = -1;                // down     arrow/s
    if (event.keyCode == 70) keyAxis[2] = (keyAxis[2] == 0) ? 1 : keyAxis[2];       // jump     space
}
