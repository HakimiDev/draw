import DrawingBoard from './DrawingBoard/index.js';

const canvas = document.getElementById("canvas");
const type = document.getElementById("type");
const undo = document.getElementById("undo");
const redo = document.getElementById("redo");
const color = document.getElementById("color");
const fill = document.getElementById("fill");
const clear = document.getElementById("clear");


window.onload = () => {
    
    const drawingBoard = new DrawingBoard({ canvas, height: window.innerHeight, width: window.innerWidth  });
    
    const myPen = drawingBoard.getPen();
    const myEraser = drawingBoard.getEraser();
    
    
    undo.addEventListener("click", (e) => {
        drawingBoard.undo();
    });
    
    redo.addEventListener("click", (e) => {
        drawingBoard.redo();
    })
    
    type.addEventListener("input", () => {
        myPen.selectMode(type.value);
        if (type.value >= 5 && type.value < 8) {
            drawingBoard.useTool(1);
            if (type.value == 5) {
                myEraser.selectMode(0);
            } else if (type.value == 6) {
                myEraser.selectMode(1);
            } else {
                myEraser.selectMode(2);
            }
        }
        else {
            drawingBoard.useTool(0);
        }
    });
    
    color.addEventListener("input", () => {
        myPen.setColor(color.value);
    });
    
    fill.addEventListener("change", () => {
        myPen.setFillDraw(fill.checked);
    });
    
    clear.addEventListener("click", () => {
        drawingBoard.clearDrawingBoard();
    });
    
};
