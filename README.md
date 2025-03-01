This is a TypeScript program for a simple drawing 
application in a HTML5 compatible web browser.  It 
is programmed on an Android tablet using the Xed-editor.
Termux is used as the shell and environment for running
the tsc transpiler and git and gh tools for source code
control.  The Simple HTTP Server is used to host it
on the tablet.

The DrawingApp class is the main class for the application.

The shapes field is an array of instances of subclasses 
of Shape, and is treated as a stack.  When a user draws, 
a new instance of a Shape subclass is created and 
pushed onto shapes.  When an undo is performed, it pops
the most recent Shape instance from shapes and pushes 
it ontprivate field redoShapes.  Redo is the opposite:
pop from redoShapes and push onto shapes.  In all cases,
a redraw is then performed to update the canvas.
 
 
 
