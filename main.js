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
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        var clickX = this.X;
        var clickY = this.Y;
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
            for (var i = 1; i < this.X.length; i++) {
                context.lineTo(this.X[i], this.Y[i]);
            }
        }
        context.stroke();
        context.closePath();
    };
    return Shape;
}());
var DrawingApp = /** @class */ (function () {
    function DrawingApp() {
        var _this = this;
        this.shapes = [];
        this.currentShape = null;
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.clearEventHandler = function () {
            _this.clearCanvas();
        };
        this.colorChangeEventHandler = function () {
            var newColor = (document.getElementById('color-select')).value;
            _this.context.strokeStyle = newColor;
        };
        this.widthChangeEventHandler = function () {
            var newWidth = (document.getElementById('width-select')).value;
            _this.context.lineWidth = parseInt(newWidth);
        };
        this.releaseEventHandler = function () {
            _this.paint = false;
            _this.currentShape.End();
            _this.currentShape = null; // clear reference
            _this.redraw();
        };
        this.cancelEventHandler = function () {
            _this.paint = false;
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
            _this.currentShape = new Shape();
            _this.currentShape.Start(mouseX, mouseY, _this.context.lineWidth, String(_this.context.strokeStyle));
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
        document.getElementById('clear')
            .addEventListener("click", this.clearEventHandler);
        document.getElementById('color-select')
            .addEventListener("change", this.colorChangeEventHandler);
        document.getElementById('width-select')
            .addEventListener("change", this.widthChangeEventHandler);
    };
    DrawingApp.prototype.redraw = function () {
        for (var i = 0; i < this.shapes.length; i++) {
            this.shapes[i].Draw(this.context);
        }
    };
    DrawingApp.prototype.addClick = function (x, y, dragging) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    };
    DrawingApp.prototype.clearCanvas = function () {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.currentShape = null;
        this.shapes = [];
    };
    return DrawingApp;
}());
new DrawingApp();
