
// Add obstacles along the track
// User needs to ovecome them to exit
// On exit, user won

// Increase difficutly, add timeout/ chaser

// add features, e.g. lights, congratulations, reflections, fancy stuff, textures, animations, etc

// Fire, Holes, Spikes

function caseObstaclesGameLoop(gameState) {
	switch(gameState) {

           case 'initialize':
             maze.maze = generateSquareMaze(maze.mazeDimension);
             end = [maze.mazeDimension-1,maze.mazeDimension-2];
             maze.maze[end[0]][end[1]] = false;
             start = [1,1];
             shortestPath = runAStar(maze.maze, start, end);


             initPhysicsMaze();    // describe how you want your maze

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
