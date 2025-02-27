enum Tools {
    Pencil,
    PencilFill,
    Rectangle,
    RectangleFill,
    Ellipse,
    EllipseFill,
    Line,
    Text
}    

class Shape {
    
    protected X: number[] = [];
    protected Y: number[] = [];
    
    protected lineWidth : number = 1;
    protected color: string = 'black';
    
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

class Pencil extends Shape {
}

class PencilFill extends Pencil {
    
    public Draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.lineWidth = this.lineWidth;
  
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
        
        context.fill();
        context.closePath();
    }
    
}

class Rectangle extends Shape {
   
    public Start(x: number, y: number, lineWidth: number, color: string) {
        this.X.push(x);
        this.Y.push(y);
        this.X.push(x);
        this.Y.push(y);
        this.lineWidth = lineWidth;
        this.color = color;
    }    
    
    public Drag(x: number, y: number) {
        this.X[1] = x;
        this.Y[1] = y;
    }    
    
    public Draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        
        let width = this.X[1] - this.X[0];
        let height = this.Y[1] - this.Y[0];
        
        context.strokeRect(this.X[0], this.Y[0], width, height);
    }
}

class RectangleFill extends Rectangle {
    public Draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.lineWidth = this.lineWidth;
        
        const width = this.X[1] - this.X[0];
        const height = this.Y[1] - this.Y[0];
        
        context.fillRect(this.X[0], this.Y[0], width, height);
    }
}

class Ellipse extends Rectangle {
    public Draw(context: CanvasRenderingContext2D) {
        const width = this.X[1] - this.X[0];
        const height = this.Y[1] - this.Y[0];      
        const centerX = this.X[0] + width / 2;
        const centerY = this.Y[0] + height / 2;
          
        context.fillStyle = this.color;
        context.lineWidth = this.lineWidth;
        
        const ctx = context;
        
        ctx.beginPath();
        // Using bezierCurveTo to approximate an ellipse
        const kappa = 0.5522848; // Control point offset for circle approximation
        const ox = (width / 2) * kappa; // x offset
        const oy = (height / 2) * kappa; // y offset
        const xe = centerX + width / 2; // x-end
        const ye = centerY + height / 2; // y-end
        const xm = centerX; // x-middle
        const ym = centerY; // y-middle

        ctx.moveTo(xm, centerY - height / 2); // Start at top
        ctx.bezierCurveTo(
            xm + ox, centerY - height / 2,
            xe, ym - oy,
            xe, ym
        );
        ctx.bezierCurveTo(
            xe, ym + oy,
            xm + ox, centerY + height / 2,
            xm, centerY + height / 2
        );
        ctx.bezierCurveTo(
            xm - ox, centerY + height / 2,
            centerX - width / 2, ym + oy,
            centerX - width / 2, ym
        );
        ctx.bezierCurveTo(
            centerX - width / 2, ym - oy,
            xm - ox, centerY - height / 2,
            xm, centerY - height / 2
        );
    
        ctx.closePath();
        ctx.stroke();

        
    }
    
}


class Line extends Shape {
   
    public Start(x: number, y: number, lineWidth: number, color: string) {
        this.X.push(x);
        this.Y.push(y);
        this.X.push(x);
        this.Y.push(y);
        this.lineWidth = lineWidth;
        this.color = color;
    }    
    
    public Drag(x: number, y: number) {
        this.X[1] = x;
        this.Y[1] = y;
    }    
    
}


class DrawingApp {
    
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private paint: boolean;
    
    private shapes: Shape[] = [];
    private redoShapes: Shape[] = [];
    private currentShape: Shape = null;
    private currentTool: Tools = Tools.Pencil;
    private color: string = 'black';
    
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

        document.getElementById('save')
            .addEventListener("click", this.saveEventHandler);

        document.getElementById('open')
            .addEventListener("click", this.openEventHandler);
            
        document.getElementById('undo')
            .addEventListener("click", this.undoEventHandler);

        document.getElementById('redo')
            .addEventListener("click", this.redoEventHandler);

        document.getElementById('tool-pencil')
            .addEventListener("click", this.pencilEventHandler);
            
        document.getElementById('tool-pencil-fill')
            .addEventListener("click", this.pencilFillEventHandler);            

        document.getElementById('tool-rectangle')
            .addEventListener("click", this.rectangleEventHandler);
            
        document.getElementById('tool-rectangle-fill')
            .addEventListener("click", this.rectangleFillEventHandler);            
            
        document.getElementById('tool-ellipse')
            .addEventListener("click", this.ellipseEventHandler);
            
        document.getElementById('tool-ellipse-fill')
            .addEventListener("click", this.ellipseFillEventHandler);            
            
        document.getElementById('tool-line')
            .addEventListener("click", this.lineEventHandler);            
                                    
        document.getElementById('color-select')
            .addEventListener("change", this.colorChangeEventHandler);
                  
        document.getElementById('width-select')
            .addEventListener("change", this.widthChangeEventHandler);
                  
        document.getElementById('fileInput')
            .addEventListener("change", this.fileInputEventHandler);
    }
    
    private redraw() {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.shapes.length; i++) {
            this.shapes[i].Draw(this.context);
        }
    }
    
    private clearToolSelection() {
        let selectedToolCells = document.getElementsByClassName("tool-selected");        
        for (let i = 0; i < selectedToolCells.length; i++) {
            let toolCell = selectedToolCells[i];
            toolCell.className = "";
        }
    }

    private selectTool(tool: Tools, toolCellId: string) {
        try {
            this.clearToolSelection();
            let toolCell = document.getElementById(toolCellId);
            toolCell.className = "tool-selected";
            this.currentTool = tool;
        }
        catch (error: any) {
            alert(error.message);
        }
    }
    
    private saveCanvasAsPng(filename: string = 'canvas-image.png') {
        // Convert canvas to data URL
        const dataUrl = this.canvas.toDataURL('image/png');

        // Create a temporary link element
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Function to load PNG into canvas
    private loadImageToCanvas(imagePath: string): void {
        // Create new image object
        const img = new Image();
    
        // Set up onload handler
        img.onload = () => {
            // Set canvas size to match image
            this.canvas.width = img.width;
            this.canvas.height = img.height;
        
            // Draw image to canvas
            this.context.drawImage(img, 0, 0);
        };
    
        // Handle loading errors
        img.onerror = () => {
            alert('Failed to load image');
        };
    
        // Set image source (triggers loading)
        img.src = imagePath;
    }    

    
    private undo() {
        let undone = this.shapes.pop();
        this.redoShapes.push(undone);
        this.redraw();
    }
  
    private redo() {
        let undone = this.redoShapes.pop();
        this.shapes.push(undone);
        this.redraw();
    }

    private clearCanvas() {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentShape = null;
        this.shapes = [];
        this.redoShapes = [];
    }
        
    private fileInputEventHandler = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file && file.type === 'image/png') {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      
      img.onload = () => {
        // Clear canvas before drawing new image
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw image at 0,0 coordinates with original dimensions
        this.context.drawImage(img, 0, 0);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  } else {
    console.error('Please select a PNG file');
  }    
    }    
        
    private saveEventHandler = () => {
        this.saveCanvasAsPng();
    }
    
    private openEventHandler = () => {
        const fileInput = document.getElementById("fileInput");
        fileInput.click();
    }
    
    private clearEventHandler = () => {
        this.clearCanvas();
    }
    
    private undoEventHandler = () => {
        this.undo();
    }    
    
    private redoEventHandler = () => {
        this.redo();
    }
    
    private pencilEventHandler = () => {
        this.selectTool(Tools.Pencil, "tool-pencil-cell");
    }
    
    private pencilFillEventHandler = () => {
        this.selectTool(Tools.PencilFill, "tool-pencil-fill-cell");
    }
    
    private rectangleEventHandler = () => {
        this.selectTool(Tools.Rectangle, "tool-rectangle-cell");
    }
    
    private rectangleFillEventHandler = () => {
        this.selectTool(Tools.RectangleFill, "tool-rectangle-fill-cell");
    }
    
    
    private ellipseEventHandler = () => {
        this.selectTool(Tools.Ellipse, "tool-ellipse-cell");
    }
    
    private ellipseFillEventHandler = () => {
        this.selectTool(Tools.EllipseFill, "tool-ellipse-fill-cell");
    }
    
    private lineEventHandler = () => {
        this.selectTool(Tools.Line, "tool-line-cell");
    }
    
    private colorChangeEventHandler = () => {
        let newColor = (<HTMLSelectElement>(document.getElementById('color-select'))).value;
        this.color = newColor;
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
        switch (this.currentTool) {
            case Tools.Pencil:
                this.currentShape = new Pencil();
                break;
            case Tools.PencilFill:
                this.currentShape = new PencilFill();
                break;
            case Tools.Rectangle:
                this.currentShape = new Rectangle();
                break;
            case Tools.RectangleFill:
                this.currentShape = new RectangleFill();
                break;
            case Tools.Ellipse:
                this.currentShape = new Ellipse();
                break;
            case Tools.Line:
                this.currentShape = new Line();
                break;
            default:
                this.currentShape = new Shape();
                break;
        }
        this.currentShape.Start(mouseX, mouseY, 
                    this.context.lineWidth, String(this.color));
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