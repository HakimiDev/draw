class Shapes {
    drawNormalLine(ctx, { startPos, stopPos } = {}) {
        ctx.lineTo(stopPos.x, stopPos.y);
        ctx.moveTo(stopPos.x, stopPos.y);
        ctx.stroke();
    }
    
    drawLine(ctx, { startPos, stopPos } = {}) {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(stopPos.x, stopPos.y);
        ctx.stroke();
        ctx.closePath();
    }
    
    drawRectangle (ctx, { startPos, stopPos, fill } = {}) {
        ctx.beginPath();
        if (fill) {
            ctx.fillRect(stopPos.x, stopPos.y, startPos.x - stopPos.x, startPos.y - stopPos.y);
        } else {
            ctx.strokeRect(stopPos.x, stopPos.y, startPos.x - stopPos.x, startPos.y - stopPos.y);
        }
        ctx.closePath();
    }
    
    drawCircle (ctx, { startPos, stopPos, fill }) {
        const radiusX = Math.abs(stopPos.x - startPos.x) / 2;
        const radiusY = Math.abs(stopPos.y - startPos.y) / 2;
        const centerX = Math.min(startPos.x, stopPos.x) + radiusX;
        const centerY = Math.min(startPos.y, stopPos.y) + radiusY;
        const ratioX = radiusX / radiusY;
        const ratioY = radiusY / radiusX;
        
        ctx.beginPath();
        for (let i = 0; i < 2 * Math.PI; i += 0.0008) {
            const xPos = centerX + radiusX * Math.cos(i) * ratioX;
            const yPos = centerY + radiusY * Math.sin(i) * ratioY;
            if (i === 0) {
                ctx.moveTo(xPos, yPos);
            } else {
                ctx.lineTo(xPos, yPos);
            }
        }
        this._strokeFill(ctx, fill);
        ctx.closePath();
    }
    
    drawTriangle (ctx, { startPos, stopPos, fill }) {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(stopPos.x, stopPos.y);
        ctx.lineTo(startPos.x * 2 - stopPos.x, stopPos.y);
        ctx.closePath();
        this._strokeFill(ctx, fill);
    }
    
    _strokeFill (ctx, fill) {
        (fill) ? ctx.fill(): ctx.stroke();
    }

}

class Pen extends Shapes {
    constructor ({ color, lineWidth, lineCap } = {}) {
        super();
        this.color = color || "BLACK";
        this.lineWidth = lineWidth || 50;
        this.lineCap = lineCap || "round";
        this.modes = ["normal", "line", "rectangle", "circle", "triangle"];
        this.selectedMode = this.modes[0];
        this.fillDraw = false; // When be "false" that's mean ctx.stroke
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
    
    getLineCap () {
        return this.lineCap;
    }
    
    setLineCap (lineCap = "round") {
        this.lineCap = lineCap;
    }
    
    getSelectedMode () {
        return this.selectedMode;
    }
    
    selectMode (modeNumber = 0) {
        this.selectedMode = this.modes[modeNumber] || this.modes[0];
    }
    
    isFillDraw () {
        return this.fillDraw;
    }
    
    setFillDraw (to = false) {
        this.fillDraw = to;
    }
    
}

export default Pen;
