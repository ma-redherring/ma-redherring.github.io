var grid = document.getElementById("grid");

var con = grid.getContext("2d");
grid.width = 500;
grid.height = 500;


var startbtn = document.getElementById("start");
var stopbtn = document.getElementById("stop");
var gliderbtn = document.getElementById("glider");

stopbtn.disabled = true;

const State = {
    Dead: 0,
    willDie: 1,
    Alive: 2,
    willLive: 3
};

var gliderArray = [[State.willDie, State.willLive, State.willDie], [State.willDie, State.willDie, State.willLive], [State.willLive, State.willLive, State.willLive]];

var lastpos={x: 0, y:0};
            
var glider = false;
var count = 30;
var sizeX = grid.width / count;
var sizeY = grid.height / count;
var animate;
var gridArray;

clearGrid();

for(let i = 0; i < count; i++){
    for(let j = 0; j < count; j++){
        colorSquare(i, j, "#000000");
    }
}

drawGrid();



function beginUpdates(){
    animate = setInterval(update, 100);
    stopbtn.disabled = false;
    startbtn.disabled = true;

}

function stopUpdates(){
    stopbtn.disabled = true;
    startbtn.disabled = false;
    clearInterval(animate);
}

function clearGrid(){
    gridArray = new Array(count);
    for(let i = 0; i < count; i++){
        gridArray[i] = new Array(count);
        for(let j = 0; j < count; j++){
            gridArray[i][j] = State.Dead;
        }
    }
    drawGrid();
}

function makeGlider(){
    glider = true;
    gliderbtn.disabled = true;
}


function update(){
    for(let x = 0; x < count; x++){
        for(let y = 0; y < count; y++){
            neighbors = countNeighbors(x, y);
            let current = gridArray[x][y];
            if(current == State.Dead && neighbors == 3)
                    gridArray[x][y] = State.willLive;
            else if(current != State.Dead && (neighbors < 2 || neighbors > 3))
                    gridArray[x][y] = State.willDie;
        }
    }
    drawGrid();
}

function cell_select(event){
    let mouse_coord = getMousePos(grid, event);
    let coord = {x: 0, y: 0};
    coord.x = Math.floor(mouse_coord.x/ grid.width * count);
    coord.y = Math.floor(mouse_coord.y/ grid.height * count);
    
    if(glider){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++)
                gridArray[coord.x + i][coord.y + j] = gliderArray[i][j];
        }
        gliderbtn.disabled = false;
        glider = false;
    }
    else
        gridArray[coord.x][coord.y] = State.willLive;
    drawGrid();
}

function preview(event) {
    let mouse_coord = getMousePos(grid, event);
    let coord = {x: 0, y: 0};
    coord.x = Math.floor(mouse_coord.x/ grid.width * count);
    coord.y = Math.floor(mouse_coord.y/ grid.height * count);
    if(coord.x != lastpos.x || coord.y != lastpos.y){
        colorSquare_Valid(lastpos.x, lastpos.y);
        colorSquare(coord.x, coord.y, "#FFFFFF");
        lastpos.x = coord.x;
        lastpos.y = coord.y;
    }
    
}

function countNeighbors(x, y){
    let neighbors = 0;
    let offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [1, -1], [0, 1], [1, 0], [1, 1]];
    for(let i = 0; i < 8; i++){
        let nX = (x + offsets[i][0] + count) % count;
        let nY = (y + offsets[i][1] + count) % count;
        if(gridArray[nX][nY] == State.Alive || gridArray[nX][nY] == State.willDie)
            neighbors++;
    }
    return neighbors;  
}

function drawGrid(){
      for(let x = 0; x < count; x++){
        for(let y = 0; y < count; y++){
            colorSquare_Valid(x, y);
        }
    }  
}

function colorSquare_Valid(x, y){
    let dead = gridArray[x][y] == State.willDie || gridArray[x][y] == State.Dead;
    let alive = gridArray[x][y] == State.Alive || gridArray[x][y] == State.willLive;
    if(dead){
        gridArray[x][y] = State.Dead;
        colorSquare(x, y, "#000000");
    }
    else if(alive){
        gridArray[x][y] = State.Alive;
        colorSquare(x, y, "#FFFFFF");
    }
}

function colorSquare(x, y, color){
    con.fillStyle = color;
    let offX = x < count - 1 ? 2 : 0;
    let offY = y < count - 1 ? 2 : 0;
    con.fillRect(x * sizeX, y * sizeY, sizeX - offX, sizeY - offY);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
}

