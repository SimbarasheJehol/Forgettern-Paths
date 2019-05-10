

// Implement a count down
// Put Mile Stones
// On exit win if on time
// add features, e.g. lights, congratulations, reflections, fancy stuff, textures, animations, etc
var log;
var rock;
var alongPath;
function addObstaclePhysics() {

	var sphereShape = new CANNON.Sphere(rock.radius);                                 // rock is 5 units ahead of enemy
	rock.body = new CANNON.Body({mass: 0, shape: sphereShape});
	rock.body.position.set(rock.x, rock.y, rock.z);
	world.add(rock.body);

	var cylinderShape = new CANNON.Cylinder(log.radius,log.radius,0.5,6);                                 // rock is 5 units ahead of enemy
	log.body = new CANNON.Body({mass: 0, shape: cylinderShape});
	log.body.position.set(log.x, log.y, log.z);
	world.add(log.body);
}
function addObstacle() {
	var g = new THREE.SphereGeometry(rock.radius, 32, 16);
	var m = rock.texture;
	rock.mesh = new THREE.Mesh(g, m);
	rock.mesh.position.set(rock.body.initPosition.x, rock.body.initPosition.y, rock.body.initPosition.z);
	scene.add(rock.mesh);

	var s = new THREE.CylinderGeometry(log.radius,log.radius,0.5 , 6);
	var m = log.texture;
	log.mesh = new THREE.Mesh(s, m);
	log.mesh.position.set(log.body.initPosition.x, log.body.initPosition.y, log.body.initPosition.z);
	scene.add(log.mesh);
}


function caseTimedGameLoop() {
	switch(gameState) {

           case 'initialize':
					 	 startTime = new Date();
             maze.maze = generateSquareMaze(maze.mazeDimension);
             end = [maze.mazeDimension-1,maze.mazeDimension-2];
             maze.maze[end[0]][end[1]] = false;
             start = [1,1];
						 alongPath = runAStar(maze.maze, start, end);
						 console.log(alongPath.length);
						 // initialize obstacles
						 log = new Player(0,undefined,0.25);
						 log.texture = new THREE.MeshPhongMaterial({map: new THREE.ImageUtils.loadTexture('/asserts/images/wood2.png') });
						 log.setXYZ(alongPath[alongPath.length-5].x, alongPath[alongPath.length-5].y, 0);

						 rock = new Player(0,undefined,0.25);
						 rock.texture = new THREE.MeshPhongMaterial({map: new THREE.ImageUtils.loadTexture('/asserts/images/concrete.png') });
						 rock.setXYZ(alongPath[7].x, alongPath[7].y, 0);

						 // initialize player
             player = new Player(5, undefined, .25);                                   // (mass, body, radius)
             player.setXYZ(start[0], start[1], 0.5);

             initPhysicsMaze("box", undefined, undefined, true, "sphere");    // describe how you want your maze (shape, wallHeightOrRadius, wallWidth, secondLayer, secondShape, layerPosition)

             createPhysicsWorld();

             createRenderWorld();
             init(maze.maze, [end[0], end[1]], [player.body.initPosition.x, player.body.initPosition.y]);
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
					 //console.log(startTime);
							 var d= new Date();
							 time =  ((d - startTime) / 1000);
							 //console.log(time);
							// console.log(d);

							t= new Date(time * 1000).toISOString().substr(11, 8);
							 $('#time').html('Time played: ' + t);
               updatePhysicsWorld();
               updateRenderWorld();
               updateFrame([player.mesh.position.x-player.body.initPosition.x, player.mesh.position.y-player.body.initPosition.y]);
               renderer.render(scene, camera);

							 if(t=='00:00:45'){
								$('#timeup').html('Time Up,you lose shame,click Restart to start again');
							gameState = 'fade out';
						}


               // Check for victory.
               var mazeX = Math.floor(player.mesh.position.x + 0.5);
               var mazeY = Math.floor(player.mesh.position.y + 0.5);
               if (mazeX == maze.mazeDimension && mazeY == (maze.mazeDimension-2)) {
                   maze.mazeDimension += 2;
									 ('#timeup').html('You Won!! click Restart to level up');
                   gameState = 'fade out';
               }
               break;

           case 'fade out':
               // updatePhysicsWorld();
               updateRenderWorld();
               updateFrame([player.mesh.position.x.toFixed(0), player.mesh.position.y.toFixed(0)]);
               light.intensity += 0.1 * (0.0 - light.intensity);
               renderer.render(scene, camera);
               // if (Math.abs(light.intensity - 0.0) < 0.1) {
               //     light.intensity = 0.0;
               //     renderer.render(scene, camera);
               //     gameState = 'initialize'
               // }
               break;

       }
}
