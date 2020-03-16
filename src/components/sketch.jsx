import React from "react";
import p from "react-p5-wrapper";

export default function sketch(p) {
  var cols = 150;
  var rows = 150;
  var grid = new Array(cols);

  var openSet = [];
  var closeSet = [];
  var start;
  var end;
  var w, h;
  var path = [];

  function Spot(i, j) {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.i = i;
    this.j = j;
    this.neighbours = [];
    this.previous = undefined;

    this.show = col => {
      p.fill(col);
      p.stroke(0);
      p.rect(this.i * w, this.j * h, w, h);
    };

    this.addNeighbours = grid => {
      var i = this.i;
      var j = this.j;
      if (i < cols - 1) {
        this.neighbours.push(grid[i + 1][j]);
      }
      if (i > 0) {
        this.neighbours.push(grid[i - 1][j]);
      }

      if (j < rows - 1) {
        this.neighbours.push(grid[i][j + 1]);
      }

      if (j > 0) {
        this.neighbours.push(grid[i][j - 1]);
      }
    };
  }

  // iterate from back to avoid skip an element
  function removeFromArray(arr, el) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == el) {
        arr.splice(i, 1);
      }
    }
  }

  function heuristic(a, b) {
    var d = p.dist(a.i, a.j, b.i, b.j);
    return d;
  }

  p.setup = function() {
    p.createCanvas(700, 700);

    w = p.width / cols;
    h = p.height / rows;

    for (var i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].addNeighbours(grid);
      }
    }

    // start at top left
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    openSet.push(start);
    // console.log(openSet.length);
  };

  var winner;

  p.draw = function() {
    if (openSet.length > 0) {
      winner = 0;
      var winnerF = openSet[0].f;
      for (var i = 0; i < openSet.length; i++) {
        // console.log(openSet[i]);
        // console.log(openSet[winner]);
        // console.log(end);
        // console.log(openSet);
        // console.log(winner);
        // console.log(openSet.length);
        console.log("Running the openset loop with i value of : " + i);
        if (openSet[i].f < winnerF) {
          winner = i;
          winnerF = openSet[i].f;
        }

        var current = openSet[winner];
        if (current == end) {
          p.noLoop();
          console.log("Finished");
          // find the path
          //   path = [];
          //   path.push(start);
          //   var temp = current;
          //   path.push(temp);
          //   while (temp.previous) {
          //     path.push(temp.previous);
          //     temp = temp.previous;
          //   }
          //   console.log(openSet.length);
          //
          //   openSet = [];
          //   break;
        }

        // remove current from openset
        removeFromArray(openSet, current);
        // push current into closeset
        closeSet.push(current);

        var neighbours = current.neighbours;
        // checking every neighbours
        for (var i = 0; i < neighbours.length; i++) {
          var neighbour = neighbours[i];
          if (!closeSet.includes(neighbour)) {
            var tempG = current.g + 1;

            if (openSet.includes(neighbour)) {
              if (tempG < neighbour.g) {
                // got a better g
                neighbour.g = tempG;
              }
            } else {
              neighbour.g = tempG;
              openSet.push(neighbour);
            }
            neighbour.h = heuristic(neighbour, end);
            neighbour.f = neighbour.g + neighbour.h;
            neighbour.previous = current;
          }
        }
      }
    } else {
      // no solution
      p.noLoop();
      return;
    }
    p.background(0);

    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].show(p.color(255));
      }
    }

    for (var i = 0; i < closeSet.length; i++) {
      closeSet[i].show(p.color(255, 0, 0));
    }

    for (var i = 0; i < openSet.length; i++) {
      openSet[i].show(p.color(0, 255, 0));
    }

    for (var i = 0; i < path.length; i++) {
      path[i].show(p.color(0, 0, 255));
    }
  };
}
