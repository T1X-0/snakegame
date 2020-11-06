var score = document.getElementById("score");
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var checkbox = document.getElementById("check");
var trailColor = "#DCDCDC";

const grid = 20;

var dx = 20;
var dy = 0;

var snake = [[0,0]];
var fruit = [];

var gameOver = false;

// Check https://stackoverflow.com/questions/19543514/check-whether-an-array-exists-in-an-array-of-arrays for function, thank you, Zeta
function searchForArray(haystack, needle){
    var i, j, current;
    for(i = 0; i < haystack.length; ++i){
      if(needle.length === haystack[i].length){
        current = haystack[i];
        for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
        if(j === needle.length)
          return true;
      }
    }
    return false;
}

// Generate a random point between 0 and 480 (minimum and maximum coordinates)
function generatePoint() {
    return 20*(Math.floor(Math.random() * 24));
}

// Generate a new fruit location
function addFruit() {
    fruit = [generatePoint(),generatePoint()];
    while (searchForArray(snake, fruit)) {
        fruit = [generatePoint(),generatePoint()];
    }
}

// Draw everything on the canvas each frame
function render() {
    score.innerText = snake.length;
    if (gameOver) {
        ctx.clearRect(0,0,c.width,c.height);
        ctx.fillStyle = "black";
        ctx.font = "50px Arial";
        ctx.fillText("Game Over!",120,220);
        ctx.fillText("Press r to restart.",70,270);
    } else {
        // Snake's color is black
        ctx.fillStyle = "black";
        // Draw a rectangle for each element in the snake
        for (i = 0; i < snake.length; i++){
            if (i === 0) {
                ctx.fillRect(snake[i][0],snake[i][1],grid,grid);
            }
        }
        ctx.fillStyle = "red";
        ctx.fillRect(fruit[0],fruit[1],grid,grid);
    }
}

// Clears the removed tail
function clear() {
    ctx.fillStyle = checkbox.checked ? trailColor : "white";
    ctx.fillRect(snake[snake.length-1][0], snake[snake.length-1][1], grid, grid);
}

function move() {
    clear()
    // Get the snake's head
    head = snake[0]
    // Define new head
    newHead = [head[0] + dx, head[1] + dy]
    if (isSameCoords(newHead, fruit)) {
        ctx.fillStyle = "white";
        ctx.clearRect(fruit[0], fruit[1], grid, grid);
        snake.unshift(newHead);
        addFruit();
    } else if (searchForArray(snake, newHead)) {
        gameOver = true;
    } else if (newHead[0] > c.width || newHead[0] < 0 || newHead[1] > c.height || newHead[1] < 0) {
        gameOver = true;
    } else {
        // Remove Tail
        snake.pop();
        snake.unshift(newHead);
    }
}

// Changes the direction according to the key pressed, r to reset
function changeDirection(e) {
    switch (e.key) {
        case "ArrowDown":
            if (dy == -20) {
                break;
            }
            dy = 20;
            dx = 0;
            break;
        case "ArrowUp":
            if (dy == 20) {
                break;
            }
            dy = -20;
            dx = 0;
            break;
        case "ArrowLeft":
            if (dx == 20) {
                break;
            }
            dy = 0;
            dx = -20;
            break;
        case "ArrowRight":
            if (dx == -20) {
                break;
            }
            dy = 0;
            dx = 20;
            break;
        case "r":
            dx = 20;
            dy = 0;
            gameOver = false;
            ctx.fillStyle = "white";
            ctx.fillRect(0,0,c.width,c.height);
            snake = [[0,0]];
            break;
    }
}

function isSameCoords(c1, c2) {
    return(c1[0] == c2[0] && c1[1] == c2[1])
}

// Occurs every frame
function refreshCanvas() {
    x = .1;  // .1 Seconds

    move();
    render();

    setTimeout(refreshCanvas, x*1000);
}

// Run the code
refreshCanvas();
// Place first fruit
addFruit();