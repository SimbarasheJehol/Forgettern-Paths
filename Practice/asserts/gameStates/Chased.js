
// Add an automated chaser
// On collision lose
// On exit win
// add features, e.g. lights, congratulations, reflections, fancy stuff, textures, animations, etc

function addPhysicsEnemy() {
    var sphereShape = new CANNON.Sphere(enemy.radius);
    enemy.body = new CANNON.Body({mass: enemy.mass, shape: sphereShape});
    enemy.body.position.set(enemy.x, enemy.y, enemy.z);                 // places enemy at start
    world.add(enemy.body);
}

function addEnemy() {
    g = new THREE.SphereGeometry(enemy.radius, 32, 16);
    m = enemy.texture;
    enemy.mesh = new THREE.Mesh(g, m);
    enemy.mesh.position.set(enemy.body.initPosition.x, enemy.body.initPosition.y, enemy.body.initPosition.z);
    scene.add(enemy.mesh);
}

function updatePhysicsEnemy() {
    // initializing
    var xStart      = player.body.position.x,
        yStart      = player.body.position.y,
        xGoal       = enemy.body.position.x,
        yGoal       = enemy.body.position.y;
var enemyVelocity = automateMove (xStart, yStart, xGoal, yGoal);     // get move
   //move
enemy.body.velocity.x = enemyVelocity[0];
enemy.body.velocity.y = enemyVelocity[1];
}

function updateEnemy() {
    // Copy coordinates from Cannon.js to Three.js
    enemy.mesh.position.copy(enemy.body.position);
    enemy.mesh.quaternion.copy(enemy.body.quaternion);
}

function caseChasedGameLoop() {
	switch(gameState) {

           case 'initialize':
             maze.maze = generateSquareMaze(maze.mazeDimension);
             end = [maze.mazeDimension-1,maze.mazeDimension-2];
             maze.maze[end[0]][end[1]] = false;
             start = [1,1];
             shortestPath = runAStar(maze.maze, start, end);

             // initialize player
             player = new Player(5, undefined, .25);                                   // (mass, body, radius)
             player.setXYZ(shortestPath[5].x, shortestPath[5].y, 0.5);

             //initialize enemy
             enemy = new Player(5, undefined, .25);                                              // (mass, body, radius)
             enemy.setXYZ(shortestPath[1].x, shortestPath[1].y, 0.5);
             enemy.texture = new THREE.MeshPhongMaterial({map: new THREE.ImageUtils.loadTexture('/asserts/images/brick.png') });

             // initPhysicsMaze();    // describe how you want your maze

             createPhysicsWorld();
             createRenderWorld();
             init(maze.maze, [end[0], end[1]], [player.body.initPosition.x, player.body.initPosition.y], undefined, [[enemy.body.initPosition.x, enemy.body.initPosition.y]]);
             camera.position.set(player.body.initPosition.x, player.body.initPosition.y, 5);
             light.position.set(player.body.initPosition.x, player.body.initPosition.y, 1.5);
             light.intensity = 0;
             var level = Math.floor((maze.mazeDimension-1)/2 - 4);
             gameState = 'fade in';
             break;

           case 'fade in':
               light.intensity += 0.1 * (1.0 - light.intensity);
               renderer.render(scene, camera);

               if (Math.abs(light.intensity - 1.0) < 0.05) {
                   light.intensity = 1.0;
                   gameState = 'play'
               }
               break;

           case 'play':
               updatePhysicsWorld();
               updateRenderWorld();
               updateFrame([player.mesh.position.x-player.body.initPosition.x, player.mesh.position.y-player.body.initPosition.y],
                 [[enemy.body.position.x-enemy.body.initPosition.x, enemy.body.position.y-enemy.body.initPosition.y]]);
               renderer.render(scene, camera);

               // Check for victory.
               var mazeX = Math.floor(player.mesh.position.x + 0.5);
               var mazeY = Math.floor(player.mesh.position.y + 0.5);
               if (mazeX == maze.mazeDimension && mazeY == (maze.mazeDimension-2)) {
                   maze.mazeDimension += 2;
                   gameState = 'fade out';
               }
               break;

           case 'fade out':
               // updatePhysicsWorld();
               updateRenderWorld();
               updateFrame([player.mesh.position.x.toFixed(0), player.mesh.position.y.toFixed(0)],
                 [[enemy.mesh.position.x.toFixed(0), enemy.mesh.position.y.toFixed(0)]]);
               light.intensity += 0.1 * (0.0 - light.intensity);
               renderer.render(scene, camera);
               if (Math.abs(light.intensity - 0.0) < 0.1) {
                   light.intensity = 0.0;
                   renderer.render(scene, camera);
                   gameState = 'initialize'
               }
               break;

       }
}
