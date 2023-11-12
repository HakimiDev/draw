class Shapes {
    normalErase (drawingBoard, { startPos, stopPos, radius } = {}) {
        const ctx = drawingBoard.context;
        ctx.lineWidth = 1;
        ctx.arc(stopPos.x, stopPos.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        // Save the board before draw eraser animation to restore to it when the pointer stop
        drawingBoard.setSnapShot(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
        // Draw the animation 
        this._normalEraseAnimation(ctx, { startPos, stopPos, radius });
    }
    
    rectangleErase (drawingBoard, { startPos, stopPos, size } = {}) {
        const ctx = drawingBoard.context;
        ctx.fillRect(stopPos.x - (size / 2), stopPos.y - (size / 2), size, size);
        // Save the board before draw eraser animation to restore to it when the pointer stop
        drawingBoard.setSnapShot(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
        // Draw the animation 
        this._rectangleEraseAnimation(ctx, { startPos, stopPos, size });
    }
    
    areaErase (drawingBoard, { startPos, stopPos } = {}) {
        const ctx = drawingBoard.context;
        // Save the board before draw eraser animation to restore to it when the pointer stop
        drawingBoard.setSnapShot(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
        // Draw the animation 
        this._areaEraseAnimation(ctx, { startPos, stopPos });
    }
    
    _normalEraseAnimation (ctx, { startPos, stopPos, radius } = {}) {
        ctx.beginPath();
        ctx.fillStyle = "RED";
        ctx.strokeStyle = "BLACK";
        ctx.globalAlpha = 0.4;
        ctx.arc(stopPos.x, stopPos.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
        ctx.closePath();
    }
    
    _rectangleEraseAnimation (ctx, { startPos, stopPos, size }) {
        ctx.beginPath();
        ctx.fillStyle = "RED";
        ctx.strokeStyle = "BLACK";
        ctx.globalAlpha = 0.4;
        ctx.fillRect(stopPos.x - (size / 2), stopPos.y - (size / 2), size, size);
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.strokeRect(stopPos.x - (size / 2), stopPos.y - (size / 2), size, size);
        ctx.closePath();
    }
    
    _areaEraseAnimation (ctx, { startPos, stopPos } = {}) {
        ctx.beginPath();
        ctx.strokeStyle = "BLACK";
        ctx.lineWidth = 1;
        ctx.strokeRect(stopPos.x, stopPos.y, startPos.x - stopPos.x, startPos.y - stopPos.y);
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "RED";
        ctx.fillRect(stopPos.x, stopPos.y, startPos.x - stopPos.x, startPos.y - stopPos.y);
        ctx.closePath();
        ctx.globalAlpha = 1;
    }
    
    _removeEraserAnimation (drawingBoard) {
        const selectedTool = drawingBoard.getSelectedTool();
        const selectedMode = drawingBoard.getEraser().getSelectedMode();
        if (selectedTool == "eraser") {
            drawingBoard.context.putImageData(drawingBoard.getSnapShot(), 0, 0);
        }
    }
    
    _eraseOnPointerStop (drawingBoard) {
        const selectedTool = drawingBoard.getSelectedTool();
        const selectedMode = drawingBoard.getEraser().getSelectedMode();
        if (selectedTool == "eraser") {
            const eraser = drawingBoard.getEraser();
            const ctx = drawingBoard.context;
            const { startPos, stopPos } = drawingBoard.getPointer();
            if (eraser.getSelectedMode() == "area") {
                drawingBoard._initCtxStyle(eraser.getColor(), eraser.getLineWidth());
                ctx.fillRect(stopPos.x, stopPos.y, startPos.x - stopPos.x, startPos.y - stopPos.y);
            }
        }
    }
    
}

class Eraser extends Shapes {
    constructor ({ color, lineWidth } = {}) {
        super();
        this.color = color || "WHITE";
        this.lineWidth = lineWidth || 25;
        this.modes = ["normal", "rectangle", "area"];
        this.selectedMode = this.modes[0];
    }
    
    getColor () {
        return this.color;
    }
    
    setColor (color = "BLACK") {
        this.color = color;
    }
    
    getLineWidth () {
        return this.lineWidth;
    }
    
    setLineWidth (lineWidth = 5) {
        this.lineWidth = lineWidth;
    }
    
    getSelectedMode () {
        return this.selectedMode;
    }
    
    selectMode (modeNumber = 0) {
        this.selectedMode = this.modes[modeNumber] || this.modes[0];
    }
    
}

export default Eraser;
