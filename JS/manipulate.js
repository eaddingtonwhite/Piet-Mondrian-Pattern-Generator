$(document).ready(function () {

  function initGrid(grid) {
    grid = new Array(40);
    //loop through rows
    for (var x = 0; x < 39; x++) {
      //create columns
      grid[x] = new Array(40);
      //loop rows
      for (var y = 0; y < 39; y++) {
        //Init values
        grid[x][y] = {
          sideCount: 0,
          downCount: 0,
          currentShape: {
            boxHeight: -1,
            boxWidth: -1
          }
        }
      }
    }
    return grid;
  }

  function drawBox(grid, x, y) {

    //Get passed grids height
    var gridWidth = grid.length;
    var gridHeight = grid[0].length;
    var currentBox = grid[x][y];
    var baseUnitPixelSize = 20;
    var backgroundColorOptions = ["#ff0000", "#eeff00", "#004cff", "#000000", "#ffffff", "#07680c"];

    //Calculate boxes width and length
    var newBoxWidth = Math.floor(Math.random() * (gridWidth - x)) + x;
    var newBoxHeight = Math.floor(Math.random() * (gridHeight - y)) + y;

    //Draw Box!
    $("<div></div>")
      .addClass("my-div")
      .css({
        width: newBoxWidth * baseUnitPixelSize,
        height: newBoxHeight * baseUnitPixelSize,
        background: backgroundColorOptions[Math.floor(Math.random() * 6)],
        left: x * baseUnitPixelSize,
        top: y * baseUnitPixelSize,
        display: 'block',
        position: 'absolute'
      })
      .appendTo("#canvas");

    //Update current grid cell with new box info
    currentBox.currentShape.boxWidth = newBoxWidth;
    currentBox.sideCount = newBoxWidth;

    currentBox.currentShape.boxHeight = newBoxHeight;
    currentBox.downCount = newBoxHeight;
  }

  function drawGrid(grid) {
    //Loop through rows
    for (var x = 0; x < grid.length - 1; x++) {
      //Loop down current column
      for (var y = 0; y < grid[x].length - 1; y++) {

        var currentBox = grid[x][y];

        //Check if in begining of grid
        if (x == 0 && y == 0) {
          drawBox(grid, x, y);

          //Check if first column but not first row
        } else if (x == 0 && y > 0) {

          //If Above shape is done drawing start drawing new box
          if (grid[x][y - 1].downCount < 1) {
            drawBox(grid, x, y);
          } else {
            //Decrement current boxes downCount based off above box
            currentBox.downCount = grid[x][y - 1].downCount - 1;
            currentBox.sideCount = grid[x][y - 1].sideCount;

            //Set current box master width and height
            currentBox.currentShape.boxWidth = grid[x][y - 1].currentShape.boxWidth;
            currentBox.currentShape.boxHeight = grid[x][y - 1].currentShape.boxHeight;
          }

          //Check if first row but not first column
        } else if (y == 0 && x > 0) {
          //If shape to the left is done drawing start new box
          if (grid[x - 1][y].sideCount < 1) {
            drawBox(grid, x, y);
          } else {
            //Decrement current boxes sideCount based off left box
            currentBox.downCount = grid[x - 1][y].downCount;
            currentBox.sideCount = grid[x - 1][y].sideCount - 1;
            //Set current box master width and height based off left box
            currentBox.currentShape.boxWidth = grid[x - 1][y].currentShape.boxWidth;
            currentBox.currentShape.boxHeight = grid[x - 1][y].currentShape.boxHeight;
          }

          //Not on first row or column
        } else {

          //Check if left and above done drawing
          if (grid[x - 1][y].sideCount < 1 && grid[x][y - 1].downCount < 1) {
            drawBox(grid, x, y);

            //Check if left done and above not
          } else if (grid[x - 1][y].sideCount < 1) {

            currentBox.downCount = grid[x][y - 1].downCount - 1;
            currentBox.sideCount = grid[x][y - 1].sideCount;
            //Set current box master width and height based off above box
            currentBox.currentShape.boxWidth = grid[x][y - 1].currentShape.boxWidth;
            currentBox.currentShape.boxHeight = grid[x][y - 1].currentShape.boxHeight;

            //Check if above done and left not
          } else if (grid[x][y - 1].downCount < 1) {

            currentBox.downCount = grid[x - 1][y].downCount;
            currentBox.sideCount = grid[x - 1][y].sideCount - 1;
            //Set current box master width and height based off left box
            currentBox.currentShape.boxWidth = grid[x - 1][y].currentShape.boxWidth;
            currentBox.currentShape.boxHeight = grid[x - 1][y].currentShape.boxHeight;

            //else neither above or left is done
          } else {

            currentBox.downCount = grid[x - 1][y].downCount;
            currentBox.sideCount = grid[x - 1][y].sideCount - 1;
            //Set current box master width and height based off left box
            currentBox.currentShape.boxWidth = grid[x - 1][y].currentShape.boxWidth;
            currentBox.currentShape.boxHeight = grid[x - 1][y].currentShape.boxHeight;
          }
        }
      }
    }
  }

  /**
   *On Start button hit start generating canvas on interval
   **/
  $("#startButton").click(function() {
    setInterval(function() {
      // Clean up old elements
      $(".my-div").remove();
      // Initilize and Draw grid
      drawGrid(initGrid());
    }, 1000); //Repeat every second
  });
});