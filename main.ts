class Shape {
    
    private X: number[] = [];
    private Y: number[] = [];
    
    private lineWidth : number = 1;
    private color: string = 'black';
    
    public Start(x: number, y: number, lineWidth: number, color: string) {
        this.X.push(x);
        this.Y.push(y);
        this.lineWidth = lineWidth;
        this.color = color;
    }
    
    public Drag(x: number, y: number) {
        this.X.push(x);
        this.Y.push(y);
    }
    
    public End() {
        //this.X.push(x);
        //this.Y.push(y);
    }
    
    public Draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        
        let clickX = this.X;
        let clickY = this.Y;
        
        context.beginPath();
        
        if (this.X.length == 1) {
            // draw short line
            context.moveTo(this.X[0] - 1, this.Y[0]);
            context.lineTo(this.X[0], this.Y[0]);
        }
        else {
            // move to first point
            context.moveTo(this.X[0], this.Y[0]);
            
            // draw lines in sequence
            for (let i = 1; i < this.X.length; i++) {
                context.lineTo(this.X[i], this.Y[i]);
            }
            
        }
        
        context.stroke();
        context.closePath();
    }
}


class DrawingApp {
    
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private paint: boolean;
    
    private shapes: Shape[] = [];
    private currentShape: Shape = null;
    
    private clickX: number[] = [];
    private clickY: number[] = [];
    private clickDrag: boolean[] = [];
    
    constructor() {
        let canvas = document.getElementById('canvas') as
                        HTMLCanvasElement;
        let context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        
        this.canvas = canvas;
        this.context = context;
        
        this.redraw();
        this.createUserEvents();
    }
    
    private createUserEvents() {
        let canvas = this.canvas;

        canvas.addEventListener("mousedown", this.pressEventHandler);
        canvas.addEventListener("mousemove", this.dragEventHandler);
        canvas.addEventListener("mouseup", this.releaseEventHandler);
        canvas.addEventListener("mouseout", this.cancelEventHandler);

        canvas.addEventListener("touchstart", this.pressEventHandler);
        canvas.addEventListener("touchmove", this.dragEventHandler);
        canvas.addEventListener("touchend", this.releaseEventHandler);
        canvas.addEventListener("touchcancel", this.cancelEventHandler);

        document.getElementById('clear')
            .addEventListener("click", this.clearEventHandler);
            
        document.getElementById('color-select')
            .addEventListener("change", this.colorChangeEventHandler);
                  
        document.getElementById('width-select')
            .addEventListener("change", this.widthChangeEventHandler);
    }
    
    private redraw() {
        for (let i = 0; i < this.shapes.length; i++) {
            this.shapes[i].Draw(this.context);
        }
    }

    private addClick(x: number, y: number, dragging: boolean) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    }

    private clearCanvas() {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.currentShape = null;
        this.shapes = [];
    }
    
    private clearEventHandler = () => {
        this.clearCanvas();
    }
    
    private colorChangeEventHandler = () => {
        let newColor = (<HTMLSelectElement>(document.getElementById('color-select'))).value;
        this.context.strokeStyle = newColor;
    }
    
   private widthChangeEventHandler = () => {
        let newWidth = (<HTMLSelectElement>(document.getElementById('width-select'))).value;
        this.context.lineWidth = parseInt(newWidth);
    }

    private releaseEventHandler = () => {
        this.paint = false;
        this.currentShape.End();
        this.currentShape = null;    // clear reference
        this.redraw();
    }

    private cancelEventHandler = () => {
        this.paint = false;
    }
    
    private pressEventHandler = (e: MouseEvent | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ?
                    (e as TouchEvent).changedTouches[0].pageX :
                    (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
                    (e as TouchEvent).changedTouches[0].pageY :
                    (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;
    
        this.paint = true;
        this.currentShape = new Shape();
        this.currentShape.Start(mouseX, mouseY, 
                    this.context.lineWidth, String(this.context.strokeStyle));
        this.shapes.push(this.currentShape);
        this.redraw();
    }
    
    private dragEventHandler = (e: MouseEvent | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ?
                    (e as TouchEvent).changedTouches[0].pageX :
                    (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
                    (e as TouchEvent).changedTouches[0].pageY :
                    (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;
    
        if (this.paint) {
            this.currentShape.Drag(mouseX, mouseY);
            this.redraw();
        }
    
        e.preventDefault();
    }
}

new DrawingApp();