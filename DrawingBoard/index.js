import Board from './board.js';
import Pen from './pen.js';
import Eraser from './eraser.js';

class DrawingBoard extends Board {
    constructor ({ canvas, color, height, width } = {}) {
      super({ canvas, color, height, width });
      this.lastPath;
      this.snapShot = this.context.getImageData(0, 0, this.width, this.height);
      this.undoStack = [];
      this.redoStack = [];
      // Init Tools ...
      this.pen = new Pen();
      this.eraser = new Eraser({ color: this.backgroundColor });
      this.selectedTool = 0; // 0 => Pen, 1 => Eraser
      // Init Pointer ...
      this.pointer = {
          startPos: { x: 0, y: 0 },
          stopPos: { x: 0, y: 0 }
      };
      this.pointerTouching = false;
      this._initControllersEvents();
    }
    
    clearDrawingBoard () {
        this.setSnapShot(null);
        this.clearBoard();
    }
    
    getPen () {
        return this.pen;
    }
    
    getEraser () {
        return this.eraser;
    }
    
    getSelectedTool () {
        return (this.selectedTool == 0) ? "pen" : (this.selectedTool == 1) ? "eraser" : null;
    }
    
    useTool (toolNumber = 0) {
      this.selectedTool = toolNumber;  
    }
    
    getSnapShot () {
        return this.snapShot;
    }
    
    setSnapShot (snapShot = null) {
        this.snapShot = snapShot;
    }
    
    getUndoStack () {
        return this.undoStack;
    }
    
    getRedoStack () {
        return this.redoStack;
    }
    
    getPointer () {
        return this.pointer;
    }
    
    _setPointer (startPos, stopPos) {
        this.pointer.startPos = startPos || this.pointer.startPos;
        this.pointer.stopPos = stopPos || this.pointer.stopPos;
    }
    
    pointerIsTouching () {
        return this.pointerTouching;
    }
    
    _setPointerTouching (to = false) {
        this.pointerTouching = to;
    }
    
    undo () {
        const ctx = this.context;
        const undoStack = this.getUndoStack();
        const redoStack = this.getRedoStack();
        if (undoStack.length > 0) {
            redoStack.push(ctx.getImageData(0, 0, this.width, this.height));
            const currentSnapShot = undoStack.pop();
            ctx.putImageData(currentSnapShot, 0, 0);
            this.setSnapShot(currentSnapShot);
        }
    }
    
    redo () {
        const ctx = this.context;
        const undoStack = this.getUndoStack();
        const redoStack = this.getRedoStack();
        if (redoStack.length > 0) {
            undoStack.push(ctx.getImageData(0, 0, this.width, this.height));
            const currentSnapShot = redoStack.pop();
            ctx.putImageData(currentSnapShot, 0, 0);
            this.setSnapShot(currentSnapShot);
        }
    }
    
    // Draw With Controllers ...
    
    _initControllersEvents () {
        // Init With Touch ...
        this.canvas.addEventListener("touchstart", (e) => this._whenPointerStart(e));
        this.canvas.addEventListener("touchmove", (e) => this._whenPointerMoveing(e));
        this.canvas.addEventListener("touchend", (e) => this._whenPointerStop(e));
        this.canvas.addEventListener("touchleave", (e) => this._whenPointerStop(e));
        // Init With Mouse ...
        this.canvas.addEventListener("mousedown", (e) => this._whenPointerStart(e));
        this.canvas.addEventListener("mousemove", (e) => this._whenPointerMoveing(e));
        this.canvas.addEventListener("mouseup", (e) => this._whenPointerStop(e));
        this.canvas.addEventListener("mouseleave", (e) => this._whenPointerStop(e));
    }
    
    _whenPointerStart (e) {
        e.preventDefault();
        if (e.touches && e.touches.length > 1) return;
        this._setPointerTouching(true);
        this.setSnapShot(this.context.getImageData(0, 0, this.width, this.height));
        this._setPointer(this._getPointerPosition(e), this._getPointerPosition(e));
        // Save Drawing Steps ...
        this.undoStack.push(this.getSnapShot());
        this.redoStack = [];
        //
        this.context.beginPath();
        this._draw();
    }
    
    _whenPointerMoveing (e) {
        e.preventDefault();
        if (!this.pointerIsTouching()) return;
        this._setPointer(undefined, this._getPointerPosition(e));
        //
        this._draw();
    }
    
    _whenPointerStop (e) {
        e.preventDefault();
        this._setPointerTouching(false);
        //
        const eraser = this.getEraser();
        eraser._removeEraserAnimation(this);
        eraser._eraseOnPointerStop(this);
        // Save The Board On SnapShot
        this.setSnapShot(this.context.getImageData(0, 0, this.width, this.height));
    }
    
    _getPointerPosition (e) {
        const rect = this.canvas.getBoundingClientRect(), // abs. size of element
            scaleX = this.canvas.width / rect.width,    // relationship bitmap vs. element for x
            scaleY = this.canvas.height / rect.height,
            clientX = e.touches ? e.touches[0].clientX : e.clientX,  // relationship bitmap vs. element for y
            clientY = e.touches ? e.touches[0].clientY : e.clientY;  // relationship bitmap vs. element for y

          return {
            x: (clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (clientY - rect.top) * scaleY     // been adjusted to be relative to element
          }
    }
    
    _draw () {
      const ctx = this.context;
      const selectedTool = this.getSelectedTool();
      const { startPos, stopPos } = this.getPointer();
      
      ctx.putImageData(this.getSnapShot(), 0, 0);
      
      if (selectedTool == "pen") {
          const pen = this.getPen();
          this._initCtxStyle(pen.getColor(), pen.getLineWidth(), pen.getLineCap());
          
          switch (pen.getSelectedMode()) {
              case "normal":
                  pen.drawNormalLine(ctx, { startPos, stopPos });
                  break;
              case "line":
                  pen.drawLine(ctx, { startPos, stopPos });
                  break;
              case "rectangle":
                  pen.drawRectangle(ctx, { startPos, stopPos, fill: pen.isFillDraw() });
                  break;
              case "circle":
                  pen.drawCircle(ctx, { startPos, stopPos, fill: pen.isFillDraw() });
                  break;
              case "triangle":
                  pen.drawTriangle(ctx, { startPos, stopPos, fill: pen.isFillDraw() });
                  break;
          }
      } else if (selectedTool == "eraser") {
          const eraser = this.getEraser();
          this._initCtxStyle(eraser.getColor(), eraser.getLineWidth());
          
          switch (eraser.getSelectedMode()) {
              case "normal":
                  eraser.normalErase(this, { startPos, stopPos, radius: eraser.getLineWidth() });
                  break;
              case "rectangle":
                  eraser.rectangleErase(this, { startPos, stopPos, size: eraser.getLineWidth() });
                  break;
              case "area": 
                  eraser.areaErase(this, { startPos, stopPos });
                  break;
          }
      }
    }
    
    _initCtxStyle (color, lineWidth, lineCap = "round") {
        const ctx = this.context;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap;
    }
    
}

export default DrawingBoard;
