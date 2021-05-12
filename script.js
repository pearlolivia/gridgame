let generateCoordX = Math.floor(Math.random() * 6) + 2;
let generateCoordY = Math.floor(Math.random() * 6) + 2;
let objectCoords = {x: generateCoordX, y: generateCoordY};

class GridSystem {
    constructor(matrix, playerX, playerY, objectX, objectY) {
        this.matrix = matrix;
        this.uiContext = this.getContext(420, 580, "#000");
        this.outlineContext = this.getContext(0, 0, "#444");
        this.topContext = this.getContext(0, 0, "#111", true);
        this.cellSize = 50;
        this.padding = 2;

        this.player = {x: playerX, y: playerY, color: "orange"};
        this.object = {x: objectX, y: objectY, color: "pink"};
        this.matrix[playerY][playerX] = 2;
        this.matrix[objectY][objectX] = 3;

        document.addEventListener("keydown", this.movePlayer);
    }

    //stop player moving outside outline of grid
    isValidMove(x, y) {
        if(this.matrix[this.player.y + y][this.player.x + x] === 0 || this.matrix[this.player.y + y][this.player.x + x] === 3) {
            return true;
        }
        return false;
    }

    //change matrix so player can move
    updateMatrix(y, x, val) {
        this.matrix[y][x] = val;
    }

    //check keys pressed to produce correct response
    movePlayer = ( { keyCode } ) => {
        if(keyCode === 37) {
            //left
            if(this.isValidMove(-1, 0)) {
                //clear val of old cell
                this.updateMatrix(this.player.y, this.player.x, 0);
                //populate val of new cell
                this.updateMatrix(this.player.y, this.player.x - 1, 2);
                this.player.x --;
                this.render();
            }
        } else if (keyCode === 39) {
            //right
            if(this.isValidMove(1, 0)) {
                this.updateMatrix(this.player.y, this.player.x, 0);
                this.updateMatrix(this.player.y, this.player.x + 1, 2);
                this.player.x ++;
                this.render();
            }
        } else if (keyCode === 38) {
            if(this.isValidMove(0, -1)) {
                this.updateMatrix(this.player.y, this.player.x, 0);
                this.updateMatrix(this.player.y - 1, this.player.x, 2);
                this.player.y --;
                this.render();
            }
        } else if (keyCode === 40) {
            if(this.isValidMove(0, 1)) {
                this.updateMatrix(this.player.y, this.player.x, 0);
                this.updateMatrix(this.player.y + 1, this.player.x, 2);
                this.player.y ++;
                this.render();
            }
        }
        if (this.player.x === objectCoords.x && this.player.y === objectCoords.y) {
            if(confirm("Congrats! You've completed this level.")) {
                window.location.reload();
            } else {
                console.log("Cancelled");
            }
        }
    }

    //center grid on uiContext (bottom layer)
    getCenter(w, h) {
        return {
            x: window.innerWidth / 2 - w / 2 + "px",
            y: window.innerHeight / 2 - h / 2 + "px"
        }
    }

    //get context and render on html body
    getContext(w, h, colour = '#111', isTransparent = false) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
        this.canvas.style.position = "absolute";
        this.canvas.style.background = colour;
        if (isTransparent) {
            this.canvas.style.backgroundColor = "transparent";
        }
        const center = this.getCenter(w, h);
        this.canvas.style.marginLeft = center.x;
        this.canvas.style.marginTop = center.y;
        document.body.appendChild(this.canvas);

        return this.context;
    }

    //build grid (canvas)
    render() {
        const w = (this.cellSize +this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellSize +this.padding) * this.matrix.length - (this.padding);
        this.outlineContext.canvas.width = w;
        this.outlineContext.canvas.height = h;

        const center = this.getCenter(w, h);
        this.outlineContext.canvas.style.marginLeft = center.x;
        this.outlineContext.canvas.style.marginTop = center.y;
        this.topContext.canvas.style.marginLeft = center.x;
        this.topContext.canvas.style.marginTop = center.y;

        for(let row = 0; row < this.matrix.length; row ++) {
            for(let col = 0; col < this.matrix[row].length; col ++) {
                const cellVAl = this.matrix[row][col];
                let colour = "#111";
                if (cellVAl === 1) {
                    colour = "#4488FF";
                } else if (cellVAl === 2) {
                    colour = this.player.color;
                } else if (cellVAl === 3) {
                    colour = this.object.color;
                }
                this.outlineContext.fillStyle = colour;
                this.outlineContext.fillRect(col * (this.cellSize + this.padding),
                row * (this.cellSize + this.padding),
                    this.cellSize, this.cellSize);
            }
        }
        this.uiContext.font = "15px Courier";
        this.uiContext.fillStyle = "white";
        this.uiContext.fillText('Grid Based Game - Dissertation Practice', 20, 30);
    }
}

const gridMatrix = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,0,1,1,0,1],
    [1,0,0,0,1,0,1],
    [1,0,0,0,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1]
];

const gridSystem = new GridSystem(gridMatrix, 1, 1, objectCoords.x, objectCoords.y);
gridSystem.render();
