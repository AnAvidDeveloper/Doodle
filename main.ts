enum Tools {
    Pencil,
    PencilFill,
    Rectangle,
    RectangleFill,
    Ellipse,
    EllipseFill,
    Line,
    Text,
    TextFill
}    


function drawPath(
    context: CanvasRenderingContext2D,
    x: number[], 
    y: number[], 
    stroke: boolean, 
    strokeColor: string, 
    strokeWidth: number,
    fill: boolean, 
    fillColor: string): void {
    
    context.fillStyle = fillColor;            
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
  
    context.beginPath();
        
    if (x.length == 1) {
        // draw short line
        context.moveTo(x[0] - 1, y[0]);
        context.lineTo(x[0], y[0]);
    }
    else {
        // move to first point
        context.moveTo(x[0], y[0]);
            
        // draw lines in sequence
        for (let i = 1; i < x.length; i++) {
            context.lineTo(x[i], y[i]);
        }
            
    }

    if (stroke) context.stroke();
    if (fill) context.fill();
    context.closePath();        
}

// First, let's define a function to draw an ellipse
function drawEllipse(
    context: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    stroke: boolean, 
    strokeColor: string, 
    strokeWidth: number,
    fill: boolean, 
    fillColor: string): void {
    
    context.beginPath();
    // Using bezierCurveTo to approximate an ellipse
    const kappa = 0.5522848; // Control point offset for circle approximation
    const ox = (width / 2) * kappa; // x offset
    const oy = (height / 2) * kappa; // y offset
    const xe = centerX + width / 2; // x-end
    const ye = centerY + height / 2; // y-end
    const xm = centerX; // x-middle
    const ym = centerY; // y-middle

    context.moveTo(xm, centerY - height / 2); // Start at top
    context.bezierCurveTo(
        xm + ox, centerY - height / 2,
        xe, ym - oy,
        xe, ym
    );
    context.bezierCurveTo(
        xe, ym + oy,
        xm + ox, centerY + height / 2,
        xm, centerY + height / 2
    );
    context.bezierCurveTo(
        xm - ox, centerY + height / 2,
        centerX - width / 2, ym + oy,
        centerX - width / 2, ym
    );
    context.bezierCurveTo(
        centerX - width / 2, ym - oy,
        xm - ox, centerY - height / 2,
        xm, centerY - height / 2
    );

    context.closePath();
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.fillStyle = fillColor;
    if (stroke) context.stroke();
    if (fill) context.fill();
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
       try {
            drawPath(context, this.X, this.Y, 
                true, this.color, this.lineWidth, false, null);
        }
        catch (error: any) {
            alert(error.message);
        }
    }
}

class Pencil extends Shape {
   
    public Draw(context: CanvasRenderingContext2D) {
        try {
            drawPath(context, this.X, this.Y, 
                true, this.color, this.lineWidth, false, null);
        }
        catch (error: any) {
            alert(error.message);
        }
    }    
}

class PencilFill extends Pencil {   
    public Draw(context: CanvasRenderingContext2D) {
        drawPath(context, this.X, this.Y, 
            false, null, this.lineWidth, true, this.color);

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
        
        drawEllipse(context, centerX, centerY, width, height, 
            true, this.color, this.lineWidth, false, null);
    }
    
}

class EllipseFill extends Rectangle {
    public Draw(context: CanvasRenderingContext2D) {
        const width = this.X[1] - this.X[0];
        const height = this.Y[1] - this.Y[0];      
        const centerX = this.X[0] + width / 2;
        const centerY = this.Y[0] + height / 2;
        
        drawEllipse(context, centerX, centerY, width, height, 
            false, this.color, this.lineWidth, true, this.color);
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

class TextShape extends Shape {
    public Text: string = "SEAN";
    public Font: string = "16px serif";
    
    public Draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.color;
        context.font = this.Font;
        context.lineWidth = this.lineWidth;
        context.strokeText(this.Text, this.X[0], this.Y[0]);
    }
}

class TextFillShape extends TextShape {
    
    public Draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.font = this.Font;
        context.fillText(this.Text, this.X[0], this.Y[0]);
    }
}

class LoadedBitmap extends Shape {
    
    constructor(private image: HTMLImageElement) {
        super();
    }
    
    public Draw(context: CanvasRenderingContext2D) {
        // Draw image at 0,0 coordinates with original dimensions
        context.drawImage(this.image, 0, 0);
    }
}


class DrawingApp {
    
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private paint: boolean;
    private confirmDialog: HTMLDialogElement;
    private newDialog: HTMLDialogElement;
    private textDialog: HTMLDialogElement;
    
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
        
        this.confirmDialog = document.getElementById('confirmDialog') as 
                                HTMLDialogElement;        
        this.newDialog = document.getElementById('newDialog') as 
                                HTMLDialogElement;
        this.textDialog = document.getElementById('textDialog') as 
                                HTMLDialogElement;
        
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

        document.getElementById('new')
            .addEventListener("click", this.newEventHandler);

        document.getElementById('newOk')
            .addEventListener("click", this.newOkEventHandler);

        document.getElementById('newCancel')
            .addEventListener("click", this.newCancelEventHandler);

        document.getElementById('clear')
            .addEventListener("click", this.clearEventHandler);

        document.getElementById('clearYes')
            .addEventListener("click", this.clearYesEventHandler);

        document.getElementById('clearNo')
            .addEventListener("click", this.clearNoEventHandler);

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
            
        document.getElementById('tool-text')
            .addEventListener("click", this.textEventHandler);            
            
        document.getElementById('tool-text-fill')
            .addEventListener("click", this.textFillEventHandler);            
            
        document.getElementById('tool-line')
            .addEventListener("click", this.lineEventHandler);            
                                    
        document.getElementById('textOk')
            .addEventListener("click", this.textOkEventHandler);            
                                    
        document.getElementById('textCancel')
            .addEventListener("click", this.textCancelEventHandler);            
                                    
        const cells = document.getElementsByTagName("td");
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.id.indexOf("color-") == 0) {
                cell.addEventListener("click", this.colorEventHandler);
            }
            if (cell.id.indexOf("lineSize-") == 0) {
                cell.addEventListener("click", this.lineSizeEventHandler);
            }
        }
                                                      
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
        
        const sizeInfo = document.getElementById("sizeInfo");
        sizeInfo.innerText = "width: " + this.canvas.width + " height: " + this.canvas.height;
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

        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                const img = new Image();
      
                img.onload = () => {
                    this.clearCanvas();
                    
                    this.canvas.width = img.width;
                    this.canvas.height = img.height;
                    
                    const loadedImage = new LoadedBitmap(img);
                    this.shapes.push(loadedImage);
                    this.redraw();
                };

                img.src = e.target?.result as string;
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select a PNG or JPG file');
        }    
    }    
        
    private saveEventHandler = () => {
        this.saveCanvasAsPng();
    }
    
    private openEventHandler = () => {
        const fileInput = document.getElementById("fileInput");
        fileInput.click();
    }
    
    private newEventHandler = () => {
        this.newDialog.showModal();
    }
        
    private newOkEventHandler = () => {
        this.clearCanvas();
        // get new size and apply
        const newHeight = document.getElementById("newHeight") as HTMLInputElement;
        const newWidth = document.getElementById("newWidth") as HTMLInputElement;   
        this.canvas.height = Number(newHeight.value);
        this.canvas.width = Number(newWidth.value);
        this.newDialog.close();
        this.redraw();
    }    
    
    private newCancelEventHandler = () => {
        this.newDialog.close();
    }
        
    private clearEventHandler = () => {
        this.confirmDialog.showModal();
    }
    
    private clearYesEventHandler = () => {
        this.confirmDialog.close();
        this.clearCanvas();
    }
        
    private clearNoEventHandler = () => {
        this.confirmDialog.close();
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
    
    private textEventHandler = () => {
        this.selectTool(Tools.Text, "tool-text-cell");
    }
    
    private textFillEventHandler = () => {
        this.selectTool(Tools.TextFill, "tool-text-fill-cell");
    }
    
    private widthChangeEventHandler = () => {
        let newWidth = (<HTMLSelectElement>(document.getElementById('width-select'))).value;
        this.context.lineWidth = parseInt(newWidth);
    }

    private releaseEventHandler = () => {
        this.paint = false;
        this.currentShape.End();
        //this.currentShape = null;    // clear reference
        this.redraw();
    }

    private cancelEventHandler = () => {
        this.paint = false;
    }
    
    private textOk() {
        try {
            const currentText = this.currentShape as TextShape;
            const textEntry = document.getElementById("textEntry") as HTMLInputElement;
            currentText.Text = textEntry.value;
            const textSize = document.getElementById("textSize") as HTMLInputElement;
            const textFont = document.getElementById("textFont") as HTMLInputElement;            
            currentText.Font = textSize.value + "px " + textFont.value;
            this.redraw();
        }
        catch (error: any) {
            alert(error.message);
        }
        this.textDialog.close();        
    }
    
    private colorEventHandler = (event: Event) => {
        // clear selected color indicator from cells
        const colorRow = document.getElementById("color-row") as HTMLElement;
        const colorRow2 = document.getElementById("color-row2") as HTMLElement;
        for (let i = 0; i < colorRow.children.length; i++) {
            colorRow.children[i].innerHTML = "&nbsp;";
            colorRow2.children[i].innerHTML = "&nbsp;";
        }
        
        // mark this cell as the selected color cell
        const colorCell = (event.target as HTMLElement);
        colorCell.innerText = "C";
        
        // set selected color
        const colorCellId = colorCell.id;
        const parts = colorCellId.split("-");
        this.color = parts[1];
    }
    
    private lineSizeEventHandler = (event: Event) => {
       const cells = document.getElementsByTagName("td");
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.id.indexOf("lineSize-") == 0) {
                const cellId = cell.id;
                const idParts = cellId.split("-");
                cell.innerHTML = idParts[1];
            }
        }
                
        // mark this cell as the selected line size cell
        const lineSizeCell = (event.target as HTMLElement);
        lineSizeCell.innerText += "*";
        
        // set selected line size
        const lineSizeCellId = lineSizeCell.id;
        const parts = lineSizeCellId.split("-");
        this.context.lineWidth = parseInt(parts[1]);
    }    
    
    private textOkEventHandler = () => {
        this.textOk();
    }
        
    private textCancelEventHandler = () => {
        this.shapes.pop();
        this.textDialog.close();
        this.redraw();
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
            case Tools.EllipseFill:
                this.currentShape = new EllipseFill();
                break;
            case Tools.Line:
                this.currentShape = new Line();
                break;
            case Tools.Text:
                this.currentShape = new TextShape();
                this.currentShape = this.currentShape;
                this.textDialog.showModal();
                break;
            case Tools.TextFill:
                this.currentShape = new TextFillShape();
                this.currentShape = this.currentShape;
                this.textDialog.showModal();
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