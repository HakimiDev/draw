class Board {
    constructor ({ canvas, color, height, width } = {}) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.backgroundColor = color || "WHITE";
        this.setSize(height || canvas.height, width || canvas.width);
        this._initBoard();
    }
    
    getSize () {
        return {
            height: this.height,
            width: this.width
        }
    }
    
    setSize (height, width) {
        this.canvas.height = height;
        this.canvas.width = width;
        this.height = this.canvas.height;
        this.width = this.canvas.width;
    }
    
    getContext () {
        return this.context;
    }
    
    getBackgroundColor () {
        return this.backgroundColor;
    }
    
    clearBoard () {
        this._initBoard();
    }
    
    _initBoard () {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.width, this.height);
    }
    
}

export default Board;
