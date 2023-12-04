// My implementation rules of Conway's game of life in js
function onload(){
    const pixelSize = 5;
    const chanceForLiveInitialState = 0.6;
    var color = "#FFFFFF";
    var background = "#000000";
    var speed = 200;
    var fade = 0.5;

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;

    var pixelRowCount = Math.floor(width/pixelSize)-1;
    var pixelColCount = Math.floor(height/pixelSize)-1;

    class Pixel {
      constructor(_x, _y, state) {
        this._x = _x;
        this._y = _y;
        this.x = Math.floor(_x/pixelSize);
        this.y = Math.floor(_y/pixelSize);
        this.live = state;
      }
      draw() {
       ctx.globalAlpha = 1;
       ctx.fillStyle = color;
       ctx.fillRect(this._x, this._y, pixelSize, pixelSize);
      }
      check(){
        let x = this.x;
        let y = this.y;
        var neighbours = [];
        for(let i=-1; i<2; i++){
          if (x-1 >= 0 && y+i <= pixelRowCount ){
            var left = pixels[x-1][y+i];
            neighbours.push(left);
          }
          if (x+1 <= pixelColCount && y+i <= pixelRowCount ){
            var right = pixels[x+1][y+i];
            neighbours.push(right);
          }
        }

        var top = pixels[x][y-1];
        neighbours.push(top);

        var bottom = pixels[x][y+1];
        neighbours.push(bottom);

        neighbours = neighbours.filter(function( element ) {
         return element !== undefined;
        });
        var count = neighbours.map(i=>i.live).reduce((a,b)=>a+b);
        return count;
      }
    }

    function generatePixels(){
      var pixels = Array();
      for (let col = 0; col < width; col=col+pixelSize) {
        var rows = [];
        for (let row = 0; row < height; row=row+pixelSize) {
            var state = Math.random() < chanceForLiveInitialState;
            var pixel = new Pixel(col,row,state);
            rows.push(pixel);
        }
        pixels.push(rows);
      }
      return pixels;
    }

    function drawBoard(){
      var livePixels = pixels.flat().filter(pixel => pixel.live);
      livePixels.forEach((pixel)=>pixel.draw());
    }

    function applyRules(liveNeibs,currentState){
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      if (liveNeibs < 2){return false;}
      if (liveNeibs > 3){return false;}
      if ((liveNeibs == 2 || liveNeibs == 3) && currentState == true){return true;}
      if (liveNeibs == 3 && currentState == false){return true;}
      return false;
    }

    function generateNextPixel(pixel){
        var count = pixel.check();
        var newPixel = new Pixel(pixel._x,pixel._y,false);
        newPixel.live = applyRules(count, pixel.live);
        return newPixel;
      }

    function generateNext(pixels){
      var nextGen = Array();
      for(let row=0; row<=pixelRowCount; row++){
        var r = pixels[row];
        var newRow = Array();
        for (let col=0; col<=pixelColCount;col++){
          var pixel = generateNextPixel(r[col]);
          newRow.push(pixel);
        }
        nextGen.push(newRow);
      }
      return nextGen;
    }

    function clear(){
       ctx.globalAlpha = fade;
       ctx.fillStyle = background;
       ctx.fillRect(0, 0, width, height);
    }

    function run() {
      clear();
      pixels = generateNext(pixels);
      drawBoard();
    }

    function generateTestPixels(){
      var pixels = Array();
      for (let col = 0; col < width; col=col+pixelSize) {
        var rows = [];
        for (let row = 0; row < height; row=row+pixelSize) {
            var state = false;
            var pixel = new Pixel(col,row,state);
            rows.push(pixel);
        }
        pixels.push(rows);
      }
      pixels[2][0].live = true;
      pixels[0][1].live = true;
      pixels[2][1].live = true;
      pixels[1][2].live = true;
      pixels[2][2].live = true;
      return pixels;

    }

    var pixels = generatePixels();
    drawBoard();
    run(pixels);
    setInterval(run, speed, pixels);
}


