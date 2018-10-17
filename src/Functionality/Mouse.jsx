import React from 'react';
import Konva from 'konva';
import Paint from './Paint.jsx';

export default class Mouse extends React.Component {
    constructor(props, stage, appState, mode, color, sizePencil, brush, sizeEraser, shape) {
        super(props);

        this.stage = stage;
        this.appState = appState;
        this.mode = mode;
        this.color = color;
        this.sizePencil = sizePencil;
        this.brush = brush;
        this.sizeEraser = sizeEraser;
        this.shape = shape;
        
        this.state = {
            isDrawing: false,
            isMouseOnCanvas: false,
            lastPointerPosition: 0,
        }

        this.Paint = new Paint(props);
    }

    scroll = (e, scaleBy, border) => {
        let stageWidth = Math.round(this.stage.width() * 100) / 100;
        if (e.target.style.width === stageWidth.toString() + 'px') {
            var oldScale = this.stage.scaleX();

            var mousePointTo = {
                x: this.stage.getPointerPosition().x / oldScale - this.stage.x() / oldScale,
                y: this.stage.getPointerPosition().y / oldScale - this.stage.y() / oldScale,
            };

            var newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
            this.stage.scale({ x: newScale, y: newScale });

            var newPos = {
                x: -(mousePointTo.x - this.stage.getPointerPosition().x / newScale) * newScale,
                y: -(mousePointTo.y - this.stage.getPointerPosition().y / newScale) * newScale
            };
            this.stage.position(newPos);
            let l = this.stage.find('Transformer');
            if (l.lenght > 0) {
                l[0].anchorSize(10 + this.stage.scaleX());
            }

            if (border !== 0) {
                border.strokeWidth(1 / this.stage.scaleX());
            }
            this.stage.draw();
        }
    }

    mouseUp = () => {
        this.state.isDrawing = false;
        this.state.isMouseOnCanvas = false;
    }

    mouseDown = (event) => {
        // let e = window.event; FOR MAC OS
        // if (e.button === 0) {
            //     this.state.isDrawing = true;
            //     this.state.isMouseOnCanvas = true;
            //     this.state.lastPointerPosition = this.stage.getPointerPosition();
            //     this.Paint.getPosition(this.state.lastPointerPosition);
            // }
        if (event.evt.button === 0) {
            this.state.isDrawing = true;
            this.state.isMouseOnCanvas = true;
            this.state.lastPointerPosition = this.stage.getPointerPosition();
            this.Paint.getPosition(this.state.lastPointerPosition);
        }
    }

    mouseMove = (img) => {
        const { layerManagement } = this.appState;
        const stageLayer = this.stage.children;
        let isGroup;

        layerManagement.forEach(_layersManagement => {
            stageLayer.forEach(_stageLayers => {
                if (_layersManagement.activeLayer === 'true') {
                    const { isDrawing } = this.state;
                    const stage = this.stage;
                    if (!isDrawing) {
                        return;
                    }
                    if (_layersManagement.key === _stageLayers._id) {
                        _stageLayers.children.forEach(_children => {
                            // It's allow you to draw on previous layerManagement
                            // It's divided like this because when I add image, img and draw  place are grouped
                            if (_children.id() === 'drawingPlace') {
                                isGroup = false;
                                this.Paint.startPainting(_children, img, this.mode, stage, 
                                    isGroup, this.color, this.sizePencil, this.brush, this.sizeEraser);
                            }

                            if (_children.id() === 'group') {
                                isGroup = true;
                                this.Paint.startPainting(_children.children[1], img, this.mode, stage, 
                                    isGroup, this.color, this.sizePencil, this.brush, this.sizeEraser);
                            }
                        });
                    }
                }
            });
        });
    }

    /* NEW PROTOTYPE VERSION OF MOVE IMAGE */
    dragGroup = () => {
        const { layerManagement } = this.appState;
        const stageLayer = this.stage.children;

        layerManagement.forEach((layerFromManagement) => {
            stageLayer.forEach(layerFromStage => {
                if (layerFromManagement.activeLayer === 'true') {
                    if (layerFromManagement.key === layerFromStage._id) {
                        layerFromStage.children.forEach(ch => {
                            if (ch.id() === 'group') {
                                if (this.mode === 'move') {
                                    let x = this.stage.getPointerPosition().x - this.stage.x();
                                    let y = this.stage.getPointerPosition().y - this.stage.y();
                                    ch.x(x / this.stage.scaleX());
                                    ch.y(y / this.stage.scaleY());

                                    this.stage.draw();
                                    console.log(ch);
                                }
                            }
                        });
                    }
                }
            });
        });
    }

    preventMouseOverCanvas = (e) => {
        if (e.target.className === undefined) {
            this.state.isDrawing = false;
        }
    }

    mouseCircle = (e) => {
        this.preventMouseOverCanvas(e);
        const el = document.querySelector('.mouseCircle');
        let tmpState = this.mode.substr(0, 3);
        if (tmpState === 'no-' || this.mode === 'default') {
            el.style.display = 'none';
            return;
        }

        let size;
        if (this.mode === 'pencil')
            size = this.sizePencil;
        else if (this.mode === 'eraser')
            size = this.sizeEraser;

        let width = parseInt(window.getComputedStyle(el).width, 10);
        let height = parseInt(window.getComputedStyle(el).height, 10);
        let x = this.stage.getPointerPosition().x;
        let y = this.stage.getPointerPosition().y;
        el.style.left = (x - (width / 2)) + 'px';
        el.style.top = (y + 80 - (height / 2)) + 'px'; // 80 is header hight
        el.style.width = (size * this.stage.scaleX()) + 'px';
        el.style.height = (size * this.stage.scaleY()) + 'px';
        if (this.mode === 'pencil')
            el.style.backgroundColor = this.color;
        else if (this.mode === 'eraser')
            el.style.backgroundColor = '#fff';
    }

    dragLayerManagement = (node) => {
        const lm = document.querySelector(node);
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.querySelector(node)) {
            // document.querySelector(node).oncontextmenu = dragMouseDown;
            document.querySelector(node).addEventListener('mousedown', (event) => {
                if (event.button === 2)
                    dragMouseDown(event);
            });
        } else
            lm.oncontextmenu = dragMouseDown;
            
        let navBar = document.querySelector('.nav-bar');
        let footer = document.querySelector('footer');

        let x = parseInt(window.getComputedStyle(lm).left, 10);
        let y = parseInt(window.getComputedStyle(lm).top, 10);

        let width = parseInt(window.getComputedStyle(lm).width, 10);
        let height = parseInt(window.getComputedStyle(lm).height, 10);

        let navBarHeight = parseInt(window.getComputedStyle(navBar).height, 10);
        let footerHeight = parseInt(window.getComputedStyle(footer).height, 10);

        if (x + width > window.innerWidth - 5) {
            document.onmouseup = null;
            document.onmousemove = null;
            let tmpLeft = (x + width) - (window.innerWidth - 5);
            lm.style.left = (x - tmpLeft) + "px";
        }
        else if (y + height > window.innerHeight - footerHeight - 5) {
            document.onmouseup = null;
            document.onmousemove = null;
            let tmpTop = (y - height) + (window.innerHeight - footerHeight - 5);
            lm.style.top = ((tmpTop - (y - height) - height) + "px");
            
        }
        else if (x < 5) {
            document.onmouseup = null;
            document.onmousemove = null;
            let tmpLeft = x - window.innerWidth - 5;
            lm.style.left = x - (tmpLeft + window.innerWidth) + "px";
        }
        else if (y < navBarHeight + 5) {
            document.onmouseup = null;
            document.onmousemove = null;
            let tmpTop = y - navBarHeight - 5;
            lm.style.top = (y - navBarHeight - 5) - 
                           (tmpTop - navBarHeight - 5) + "px";
        }
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            lm.style.top = (lm.offsetTop - pos2) + "px";
            lm.style.left = (lm.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    resizeElement = (node, who) => {
        const elResizer = document.querySelector(node);
        const el = document.querySelector(who);
        if (document.querySelector(node)) {
            document.querySelector(node).onmousedown = dragMouseDown;
        } else {
            elResizer.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            el.style.width = (e.clientX - el.offsetLeft) + 'px';
            el.style.height = (e.clientY - el.offsetTop) + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}