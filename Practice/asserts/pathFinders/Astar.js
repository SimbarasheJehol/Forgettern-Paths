class Node {
    constructor(x, y, wall){
      this.finalCost  =  0; //G+H
      this.parent     = undefined;
      this.x          = x;
      this.y          = y;
      this.wall       = wall;
    }
}
var grid = [];


var open = [];
var closed = undefined;
var close = undefined;

var start, end;


function checkAndUpdateCost(current, t, cost) {
    if(t == null || close[t.x][t.y]) return;
    var t_final_cost = (Math.abs(t.x - end[0]) + Math.abs(t.y - end[1])) + cost;
    var inOpen = open.includes(t);
    if(!inOpen || t_final_cost < t.finalCost){
        t.finalCost = t_final_cost;
        t.parent = current;
        if(!inOpen)open.push(t);
    }
}

function aStar() {

    open.push(grid[start[0]][start[1]]);

    var current = new Node;

    while(true) {
      //to OPTIMIZE:  code consider the assumption of adding
      // to the right space, due assuming they're already ordered
      // or changing the data structure
      if(open.length >= 2) {
        k = 0;
        // if (open.length > 5) k = open.length-5;
        for(var i = open.length-1; i > k; i--) {
                if(open[i].finalCost > open[i-1].finalCost) {
                    var temp  = open[i]
                    open[i]   = open[i-1]
                    open[i-1] = temp;
                }
        }
      }

        current = open.pop();

        if(current == undefined) break;
        // console.log(current.x + " " + current.x);
        close[current.x][current.y] = true;

        if(current == (grid[end[0]][end[1]])){
            break;
        }

        var neighbour = new Node();
        if(current.x -1 >= 0){
          neighbour = grid[current.x -1][current.y]; // up
          if(!neighbour.wall) checkAndUpdateCost(current, neighbour, current.finalCost+1);
        }
        if(current.y -1 >= 0){ //left
          neighbour = grid[current.x][current.y -1];
          if(!neighbour.wall) checkAndUpdateCost(current, neighbour, current.finalCost+1);
        }
        if(current.y +1 < grid[0].length){ //right
          neighbour = grid[current.x][current.y +1];
          if(!neighbour.wall) checkAndUpdateCost(current, neighbour, current.finalCost+1);
        }
        if(current.x +1 < grid.length){ //down
          neighbour = grid[current.x +1][current.y];
          if(!neighbour.wall) checkAndUpdateCost(current, neighbour, current.finalCost+1);
        }
    }
}

function initNodes(rows, cols, maze) {

  //initialize close
  close = Array.from(Array(rows), _ => Array(cols).fill(false));

  //initialize open
  open  = []
  
  //initialize grid
  grid = new Array(rows);

  for (var i = 0; i < rows; i++) {grid[i] = (new Array(cols));}

  for(var k = 0; k < rows; ++k) {
      for(var j = 0; j< cols; ++j){
        grid[k][j] = new Node(k, j, maze[k][j]);
        // else grid[k][j] = new Node(k, j, true);
      }
  }

}

function runAStar(maze, pos, goal) {

      //initialize variables
      initNodes(maze.length, maze[0].length, maze);

      //set the start and end of the paths
      start = pos;
      end = goal;

      //call AStar Algorithm
      aStar();

      //Trace back the path
      var path = []
      if(close[goal[0]][goal[1]]){
       // console.log("Path: ");
       var current = grid[goal[0]][goal[1]];
       path.push(current);
       // console.log(current);
       while(current.parent != undefined){
           // console.log(" -> " + current.parent);
           current = current.parent;
           path.push(current);
       }
       // path.push(current);
       // console.log();
      } else console.log("No possible path");

      //Correct orientation
      var finalPath = [];
      for (var i = path.length-1; i >= 0; i--) {
          finalPath.push(path[i]);
      }
      // console.log("finalPath " + finalPath.length)
      return finalPath;
}
