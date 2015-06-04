$(document).ready(function() {

  /**
   * This initilizes the 2D array that we will use to keep track of what boxes
   * are currently being drawn and how big each generated box will be.
   *
   * Returns: The initilized array[][]
   */
  function initGrid(grid) {

    //Figure out how many boxes to draw
    numOfBoxesWide = parseInt(($(window).height() / 20) + 1);
    numOfBoxesTall = parseInt(($(window).width() / 20) + 1);

    grid = new Array(numOfBoxesWide);
    //loop through rows
    for (var x = 0; x < numOfBoxesWide; x++) {
      //create columns
      grid[x] = new Array(numOfBoxesTall);
      //loop rows
      for (var y = 0; y < numOfBoxesTall; y++) {
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

  /**
   * Helper function used to grab the colors to use from the color select
   * boxes.
   *
   * Returns:  An array of the Hexadecimal string values of all the colors to
   *           use.
   */
  function getColors() {

    colorOptions = [];
    $('input[type=color]').each(function(index, el) {
      colorOptions.push($(el).val());
    });

    return colorOptions;
  }

  /**
   * When it is time to generate an actual colored box this is where the styled
   * div element is generated and appended to the canvas div element.
   */
  function drawBox(grid, x, y) {

    //Get passed grids height
    var gridWidth = grid.length;
    var gridHeight = grid[0].length;
    var currentBox = grid[x][y];
    var baseUnitPixelSize = 20;
    var backgroundColorOptions = getColors();

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

  function updateFromAbove(grid, x, y) {
    //Decrement current boxes downCount based off above box
    grid[x][y].downCount = grid[x][y - 1].downCount - 1;
    grid[x][y].sideCount = grid[x][y - 1].sideCount;

    //Set current box master width and height
    grid[x][y].currentShape.boxWidth = grid[x][y - 1].currentShape.boxWidth;
    grid[x][y].currentShape.boxHeight = grid[x][y - 1].currentShape.boxHeight;
  }

  function updateFromLeft(grid, x, y) {
    //Decrement current boxes sideCount based off left box
    grid[x][y].downCount = grid[x - 1][y].downCount;
    grid[x][y].sideCount = grid[x - 1][y].sideCount - 1;
    //Set current box master width and height based off left box
    grid[x][y].currentShape.boxWidth = grid[x - 1][y].currentShape.boxWidth;
    grid[x][y].currentShape.boxHeight = grid[x - 1][y].currentShape.boxHeight;
  }

  /**
   * Loops through the initilized 2D array and generates the Piet Mondrian Esque
   * pattern calling the drawBox function when it deems apropriate.
   */
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
            updateFromAbove(grid, x, y);
          }

          //Check if first row but not first column
        } else if (y == 0 && x > 0) {
          //If shape to the left is done drawing start new box
          if (grid[x - 1][y].sideCount < 1) {
            drawBox(grid, x, y);
          } else {
            //Decrement current boxes sideCount based off left box
            updateFromLeft(grid, x, y);
          }

          //Not on first row or column
        } else {

          //Check if left and above done drawing
          if (grid[x - 1][y].sideCount < 1 && grid[x][y - 1].downCount < 1) {
            drawBox(grid, x, y);

            //Check if left done and above not
          } else if (grid[x - 1][y].sideCount < 1) {
            //Set current box master width and height based off above box
            updateFromAbove(grid, x, y);

            //Check if above done and left not
          } else if (grid[x][y - 1].downCount < 1) {
            //Set current box master width and height based off left box
            updateFromLeft(grid, x, y);
            //else neither above or left is done
          } else {
            //Set current box master width and height based off left box
            updateFromLeft(grid, x, y);
          }
        }
      }
    }
  }

  //Global ID of current timeout used for changing refresh rate
  var tid;

  //Global boolean are we currently drawing a pattern or not
  var isDrawing = false;

  /**
   * Draws a new Pattern at the defined refresh rate calls itself recursively
   * after each time out finishes to draw the next pattern
   */
  function startDrawing() {

    //Check to make sure we should still be drawing
    if (isDrawing) {
      tid = setTimeout(function() {
        // Clean up old elements
        $(".my-div").remove();
        // Initilize and Draw grid
        drawGrid(initGrid());
        startDrawing();
      }, $('input[name=RefreshRateValue]').val());
    }
  }

  /**
   * Listens for refresh interval change and clears the current time out and
   * starts a new refresh time out cycle drawing at the new set interval.
   */
  function changeRefreshRate() {
    $('input[name=RefreshRateValue]').change(function(event) {
      //Abort current interval
      clearTimeout(tid);
      //Start drawing again
      startDrawing();
    });
  }

  /**
   * On Start button hit start generating canvas on interval
   **/
  $("#startButton").click(function() {

    if (!isDrawing) {
      //Set global isDrawing variable
      isDrawing = true;
      //Reformat Start button to stop button
      $('#startButton').css({
        background: 'red'
      }).text('Stop');
      //Start Drawing
      startDrawing();
    } else {
      //Set global isDrawing variable
      isDrawing = false;
      //Stop current timeout
      clearTimeout(tid);
      //Clear canvas
      $(".my-div").remove();
      //Reformat stop button to start button
      $('#startButton').css({
        background: '#49C331'
      }).text('Start');
    }
  });

});

// UTILITY FUNCTIONS

/**
 * Handles collapsing the side menu
 */
var menuExpanded = true; //Global for handling menu resize

function collapseMenu() {
  //SHRINK MENU
  if (menuExpanded) {
    menuExpanded = false; //Change global
    $('h1,h2,h3').hide();
    //Increase canvas size
    $('#canvas').removeClass('small').addClass('big');
    //Shrink Menu
    $('.menu').removeClass('big').addClass('small');
    $('#menuCollapse').removeClass('big').addClass('small').text('Expand');

  //EXPAND MENU
  }else{
    menuExpanded = true; //Change global
    $('h1,h2,h3').show();
    //Shrink canvas size
    $('#canvas').removeClass('big').addClass('small');
    //Expand Menu
    $('.menu').removeClass('small').addClass('big');
    //Expand Collapse button and change text
    $('#menuCollapse').addClass('big').removeClass('small').text('Collapse');
  }
}