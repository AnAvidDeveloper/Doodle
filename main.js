var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Tools;
(function (Tools) {
    Tools[Tools["Pencil"] = 0] = "Pencil";
    Tools[Tools["PencilFill"] = 1] = "PencilFill";
    Tools[Tools["Rectangle"] = 2] = "Rectangle";
    Tools[Tools["RectangleFill"] = 3] = "RectangleFill";
    Tools[Tools["Ellipse"] = 4] = "Ellipse";
    Tools[Tools["EllipseFill"] = 5] = "EllipseFill";
    Tools[Tools["Line"] = 6] = "Line";
    Tools[Tools["Text"] = 7] = "Text";
    Tools[Tools["TextFill"] = 8] = "TextFill";
})(Tools || (Tools = {}));
function drawPath(context, x, y, stroke, strokeColor, strokeWidth, fill, fillColor) {
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
        for (var i = 1; i < x.length; i++) {
            context.lineTo(x[i], y[i]);
        }
    }
    if (stroke)
        context.stroke();
    if (fill)
        context.fill();
    context.closePath();
}
// First, let's define a function to draw an ellipse
function drawEllipse(context, centerX, centerY, width, height, stroke, strokeColor, strokeWidth, fill, fillColor) {
    context.beginPath();
    // Using bezierCurveTo to approximate an ellipse
    var kappa = 0.5522848; // Control point offset for circle approximation
    var ox = (width / 2) * kappa; // x offset
    var oy = (height / 2) * kappa; // y offset
    var xe = centerX + width / 2; // x-end
    var ye = centerY + height / 2; // y-end
    var xm = centerX; // x-middle
    var ym = centerY; // y-middle
    context.moveTo(xm, centerY - height / 2); // Start at top
    context.bezierCurveTo(xm + ox, centerY - height / 2, xe, ym - oy, xe, ym);
    context.bezierCurveTo(xe, ym + oy, xm + ox, centerY + height / 2, xm, centerY + height / 2);
    context.bezierCurveTo(xm - ox, centerY + height / 2, centerX - width / 2, ym + oy, centerX - width / 2, ym);
    context.bezierCurveTo(centerX - width / 2, ym - oy, xm - ox, centerY - height / 2, xm, centerY - height / 2);
    context.closePath();
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.fillStyle = fillColor;
    if (stroke)
        context.stroke();
    if (fill)
        context.fill();
}
var Shape = /** @class */ (function () {
    function Shape() {
        this.X = [];
        this.Y = [];
        this.lineWidth = 1;
        this.color = 'black';
    }
    Shape.prototype.Start = function (x, y, lineWidth, color) {
        this.X.push(x);
        this.Y.push(y);
        this.lineWidth = lineWidth;
        this.color = color;
    };
    Shape.prototype.Drag = function (x, y) {
        this.X.push(x);
        this.Y.push(y);
    };
    Shape.prototype.End = function () {
        //this.X.push(x);
        //this.Y.push(y);
    };
    Shape.prototype.Draw = function (context) {
        try {
            drawPath(context, this.X, this.Y, true, this.color, this.lineWidth, false, null);
        }
        catch (error) {
            alert(error.message);
        }
    };
    return Shape;
}());
var Pencil = /** @class */ (function (_super) {
    __extends(Pencil, _super);
    function Pencil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pencil.prototype.Draw = function (context) {
        try {
            drawPath(context, this.X, this.Y, true, this.color, this.lineWidth, false, null);
        }
        catch (error) {
            alert(error.message);
        }
    };
    return Pencil;
}(Shape));
var PencilFill = /** @class */ (function (_super) {
    __extends(PencilFill, _super);
    function PencilFill() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PencilFill.prototype.Draw = function (context) {
        drawPath(context, this.X, this.Y, false, null, this.lineWidth, true, this.color);
    };
    return PencilFill;
}(Pencil));
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rectangle.prototype.Start = function (x, y, lineWidth, color) {
        this.X.push(x);
        this.Y.push(y);
        this.X.push(x);
        this.Y.push(y);
        this.lineWidth = lineWidth;
        this.color = color;
    };
    Rectangle.prototype.Drag = function (x, y) {
        this.X[1] = x;
        this.Y[1] = y;
    };
    Rectangle.prototype.Draw = function (context) {
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        var width = this.X[1] - this.X[0];
        var height = this.Y[1] - this.Y[0];
        context.strokeRect(this.X[0], this.Y[0], width, height);
    };
    return Rectangle;
}(Shape));
var RectangleFill = /** @class */ (function (_super) {
    __extends(RectangleFill, _super);
    function RectangleFill() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RectangleFill.prototype.Draw = function (context) {
        context.fillStyle = this.color;
        context.lineWidth = this.lineWidth;
        var width = this.X[1] - this.X[0];
        var height = this.Y[1] - this.Y[0];
        context.fillRect(this.X[0], this.Y[0], width, height);
    };
    return RectangleFill;
}(Rectangle));
var Ellipse = /** @class */ (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ellipse.prototype.Draw = function (context) {
        var width = this.X[1] - this.X[0];
        var height = this.Y[1] - this.Y[0];
        var centerX = this.X[0] + width / 2;
        var centerY = this.Y[0] + height / 2;
        drawEllipse(context, centerX, centerY, width, height, true, this.color, this.lineWidth, false, null);
    };
    return Ellipse;
}(Rectangle));
var EllipseFill = /** @class */ (function (_super) {
    __extends(EllipseFill, _super);
    function EllipseFill() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EllipseFill.prototype.Draw = function (context) {
        var width = this.X[1] - this.X[0];
        var height = this.Y[1] - this.Y[0];
        var centerX = this.X[0] + width / 2;
        var centerY = this.Y[0] + height / 2;
        drawEllipse(context, centerX, centerY, width, height, false, this.color, this.lineWidth, true, this.color);
    };
    return EllipseFill;
}(Rectangle));
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.Start = function (x, y, lineWidth, color) {
        this.X.push(x);
        this.Y.push(y);
        this.X.push(x);
        this.Y.push(y);
        this.lineWidth = lineWidth;
        this.color = color;
    };
    Line.prototype.Drag = function (x, y) {
        this.X[1] = x;
        this.Y[1] = y;
    };
    return Line;
}(Shape));
var TextShape = /** @class */ (function (_super) {
    __extends(TextShape, _super);
    function TextShape() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Text = "SEAN";
        _this.Font = "16px serif";
        return _this;
    }
    TextShape.prototype.Draw = function (context) {
        context.strokeStyle = this.color;
        context.font = this.Font;
        context.lineWidth = this.lineWidth;
        context.strokeText(this.Text, this.X[0], this.Y[0]);
    };
    return TextShape;
}(Shape));
var TextFillShape = /** @class */ (function (_super) {
    __extends(TextFillShape, _super);
    function TextFillShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextFillShape.prototype.Draw = function (context) {
        context.fillStyle = this.color;
        context.font = this.Font;
        context.fillText(this.Text, this.X[0], this.Y[0]);
    };
    return TextFillShape;
}(TextShape));
var LoadedBitmap = /** @class */ (function (_super) {
    __extends(LoadedBitmap, _super);
    function LoadedBitmap(image) {
        var _this = _super.call(this) || this;
        _this.image = image;
        return _this;
    }
    LoadedBitmap.prototype.Draw = function (context) {
        // Draw image at 0,0 coordinates with original dimensions
        context.drawImage(this.image, 0, 0);
    };
    return LoadedBitmap;
}(Shape));
var DrawingApp = /** @class */ (function () {
    function DrawingApp() {
        var _this = this;
        this.shapes = [];
        this.redoShapes = [];
        this.currentShape = null;
        this.currentTool = Tools.Pencil;
        this.color = 'black';
        this.fileInputEventHandler = function (event) {
            var _a;
            var target = event.target;
            var file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var _a;
                    var img = new Image();
                    img.onload = function () {
                        _this.clearCanvas();
                        _this.canvas.width = img.width;
                        _this.canvas.height = img.height;
                        var loadedImage = new LoadedBitmap(img);
                        _this.shapes.push(loadedImage);
                        _this.redraw();
                    };
                    img.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                };
                reader.readAsDataURL(file);
            }
            else {
                alert('Please select a PNG or JPG file');
            }
        };
        this.saveEventHandler = function () {
            _this.saveCanvasAsPng();
        };
        this.openEventHandler = function () {
            var fileInput = document.getElementById("fileInput");
            fileInput.click();
        };
        this.newEventHandler = function () {
            _this.newDialog.showModal();
        };
        this.newOkEventHandler = function () {
            _this.clearCanvas();
            // get new size and apply
            var newHeight = document.getElementById("newHeight");
            var newWidth = document.getElementById("newWidth");
            _this.canvas.height = Number(newHeight.value);
            _this.canvas.width = Number(newWidth.value);
            _this.newDialog.close();
            _this.redraw();
        };
        this.newCancelEventHandler = function () {
            _this.newDialog.close();
        };
        this.clearEventHandler = function () {
            _this.confirmDialog.showModal();
        };
        this.clearYesEventHandler = function () {
            _this.confirmDialog.close();
            _this.clearCanvas();
        };
        this.clearNoEventHandler = function () {
            _this.confirmDialog.close();
        };
        this.undoEventHandler = function () {
            _this.undo();
        };
        this.redoEventHandler = function () {
            _this.redo();
        };
        this.pencilEventHandler = function () {
            _this.selectTool(Tools.Pencil, "tool-pencil-cell");
        };
        this.pencilFillEventHandler = function () {
            _this.selectTool(Tools.PencilFill, "tool-pencil-fill-cell");
        };
        this.rectangleEventHandler = function () {
            _this.selectTool(Tools.Rectangle, "tool-rectangle-cell");
        };
        this.rectangleFillEventHandler = function () {
            _this.selectTool(Tools.RectangleFill, "tool-rectangle-fill-cell");
        };
        this.ellipseEventHandler = function () {
            _this.selectTool(Tools.Ellipse, "tool-ellipse-cell");
        };
        this.ellipseFillEventHandler = function () {
            _this.selectTool(Tools.EllipseFill, "tool-ellipse-fill-cell");
        };
        this.lineEventHandler = function () {
            _this.selectTool(Tools.Line, "tool-line-cell");
        };
        this.textEventHandler = function () {
            _this.selectTool(Tools.Text, "tool-text-cell");
        };
        this.textFillEventHandler = function () {
            _this.selectTool(Tools.TextFill, "tool-text-fill-cell");
        };
        this.colorChangeEventHandler = function () {
            var newColor = (document.getElementById('color-select')).value;
            _this.color = newColor;
        };
        this.widthChangeEventHandler = function () {
            var newWidth = (document.getElementById('width-select')).value;
            _this.context.lineWidth = parseInt(newWidth);
        };
        this.releaseEventHandler = function () {
            _this.paint = false;
            _this.currentShape.End();
            //this.currentShape = null;    // clear reference
            _this.redraw();
        };
        this.cancelEventHandler = function () {
            _this.paint = false;
        };
        this.textOkEventHandler = function () {
            _this.textOk();
        };
        this.textCancelEventHandler = function () {
            _this.shapes.pop();
            _this.textDialog.close();
            _this.redraw();
        };
        this.pressEventHandler = function (e) {
            var mouseX = e.changedTouches ?
                e.changedTouches[0].pageX :
                e.pageX;
            var mouseY = e.changedTouches ?
                e.changedTouches[0].pageY :
                e.pageY;
            mouseX -= _this.canvas.offsetLeft;
            mouseY -= _this.canvas.offsetTop;
            _this.paint = true;
            switch (_this.currentTool) {
                case Tools.Pencil:
                    _this.currentShape = new Pencil();
                    break;
                case Tools.PencilFill:
                    _this.currentShape = new PencilFill();
                    break;
                case Tools.Rectangle:
                    _this.currentShape = new Rectangle();
                    break;
                case Tools.RectangleFill:
                    _this.currentShape = new RectangleFill();
                    break;
                case Tools.Ellipse:
                    _this.currentShape = new Ellipse();
                    break;
                case Tools.EllipseFill:
                    _this.currentShape = new EllipseFill();
                    break;
                case Tools.Line:
                    _this.currentShape = new Line();
                    break;
                case Tools.Text:
                    _this.currentShape = new TextShape();
                    _this.currentShape = _this.currentShape;
                    _this.textDialog.showModal();
                    break;
                case Tools.TextFill:
                    _this.currentShape = new TextFillShape();
                    _this.currentShape = _this.currentShape;
                    _this.textDialog.showModal();
                    break;
                default:
                    _this.currentShape = new Shape();
                    break;
            }
            _this.currentShape.Start(mouseX, mouseY, _this.context.lineWidth, String(_this.color));
            _this.shapes.push(_this.currentShape);
            _this.redraw();
        };
        this.dragEventHandler = function (e) {
            var mouseX = e.changedTouches ?
                e.changedTouches[0].pageX :
                e.pageX;
            var mouseY = e.changedTouches ?
                e.changedTouches[0].pageY :
                e.pageY;
            mouseX -= _this.canvas.offsetLeft;
            mouseY -= _this.canvas.offsetTop;
            if (_this.paint) {
                _this.currentShape.Drag(mouseX, mouseY);
                _this.redraw();
            }
            e.preventDefault();
        };
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        this.canvas = canvas;
        this.context = context;
        this.confirmDialog = document.getElementById('confirmDialog');
        this.newDialog = document.getElementById('newDialog');
        this.textDialog = document.getElementById('textDialog');
        this.redraw();
        this.createUserEvents();
    }
    DrawingApp.prototype.createUserEvents = function () {
        var canvas = this.canvas;
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
        document.getElementById('color-select')
            .addEventListener("change", this.colorChangeEventHandler);
        document.getElementById('width-select')
            .addEventListener("change", this.widthChangeEventHandler);
        document.getElementById('fileInput')
            .addEventListener("change", this.fileInputEventHandler);
    };
    DrawingApp.prototype.redraw = function () {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.shapes.length; i++) {
            this.shapes[i].Draw(this.context);
        }
        var sizeInfo = document.getElementById("sizeInfo");
        sizeInfo.innerText = "width: " + this.canvas.width + " height: " + this.canvas.height;
    };
    DrawingApp.prototype.clearToolSelection = function () {
        var selectedToolCells = document.getElementsByClassName("tool-selected");
        for (var i = 0; i < selectedToolCells.length; i++) {
            var toolCell = selectedToolCells[i];
            toolCell.className = "";
        }
    };
    DrawingApp.prototype.selectTool = function (tool, toolCellId) {
        try {
            this.clearToolSelection();
            var toolCell = document.getElementById(toolCellId);
            toolCell.className = "tool-selected";
            this.currentTool = tool;
        }
        catch (error) {
            alert(error.message);
        }
    };
    DrawingApp.prototype.saveCanvasAsPng = function (filename) {
        if (filename === void 0) { filename = 'canvas-image.png'; }
        // Convert canvas to data URL
        var dataUrl = this.canvas.toDataURL('image/png');
        // Create a temporary link element
        var link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    DrawingApp.prototype.undo = function () {
        var undone = this.shapes.pop();
        this.redoShapes.push(undone);
        this.redraw();
    };
    DrawingApp.prototype.redo = function () {
        var undone = this.redoShapes.pop();
        this.shapes.push(undone);
        this.redraw();
    };
    DrawingApp.prototype.clearCanvas = function () {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentShape = null;
        this.shapes = [];
        this.redoShapes = [];
    };
    DrawingApp.prototype.textOk = function () {
        try {
            var currentText = this.currentShape;
            var textEntry = document.getElementById("textEntry");
            currentText.Text = textEntry.value;
            var textSize = document.getElementById("textSize");
            currentText.Font = textSize.value + "px serif";
            this.redraw();
        }
        catch (error) {
            alert(error.message);
        }
        this.textDialog.close();
    };
    return DrawingApp;
}());
new DrawingApp();
